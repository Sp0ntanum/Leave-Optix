from supabase import Client
from app.core.config import settings
from app.exceptions import TeamNotFoundError
from datetime import date, timedelta
from typing import Optional, Dict, List
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class WorkloadService:
    def __init__(self, db: Client):
        self.db = db
    
    def analyze_team_workload(
        self,
        team_id: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict:
        """Optimized workload analysis - single query for all data"""
        if not start_date:
            start_date = date.today()
        if not end_date:
            end_date = start_date + timedelta(days=30)
        
        logger.info(f"Analyzing workload for team {team_id}")
        
        # Single query for team members - select only needed columns
        team_members = self.db.table('users').select('id, full_name').eq('team_id', team_id).execute()
        
        if not team_members.data:
            raise TeamNotFoundError(f"No members found for team {team_id}")
        
        total_members = len(team_members.data)
        member_ids = [m['id'] for m in team_members.data]
        
        # Single optimized query for all leaves - select only needed columns
        leaves = self.db.table('leave_requests').select(
            'user_id, start_date, end_date'
        ).in_('user_id', member_ids).in_(
            'status', ['approved', 'pending', 'auto_approved']
        ).gte('end_date', start_date.isoformat()).lte(
            'start_date', end_date.isoformat()
        ).execute()
        
        # Build absence map for efficient lookup
        absence_map = self._build_absence_map(leaves.data or [], start_date, end_date)
        
        # Calculate daily capacity efficiently
        daily_capacities = []
        current = start_date
        
        while current <= end_date:
            if current.weekday() < 5:  # Weekday only
                absent_count = len(absence_map.get(current, set()))
                available = total_members - absent_count
                utilization = absent_count / total_members if total_members > 0 else 0.0
                
                daily_capacities.append({
                    'date': current.isoformat(),
                    'total_capacity': total_members,
                    'available_capacity': available,
                    'absent_count': absent_count,
                    'utilization': utilization
                })
            
            current += timedelta(days=1)
        
        # Compute metrics
        if daily_capacities:
            avg_available = sum(d['available_capacity'] for d in daily_capacities) / len(daily_capacities)
            avg_utilization = sum(d['utilization'] for d in daily_capacities) / len(daily_capacities)
            peak_day = min(daily_capacities, key=lambda d: d['available_capacity'])
        else:
            avg_available = total_members
            avg_utilization = 0.0
            peak_day = None
        
        return {
            'team_id': team_id,
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            },
            'metrics': {
                'total_members': total_members,
                'average_available_capacity': round(avg_available, 2),
                'average_utilization': round(avg_utilization, 2),
                'peak_absence_date': peak_day['date'] if peak_day else None,
                'peak_absence_count': peak_day['absent_count'] if peak_day else 0
            },
            'daily_capacity': daily_capacities
        }
    
    def detect_conflicts(
        self,
        team_id: str,
        start_date: date,
        end_date: date
    ) -> Dict:
        """Detect conflicts using cached analysis"""
        analysis = self.analyze_team_workload(team_id, start_date, end_date)
        
        conflicts = []
        
        for day in analysis['daily_capacity']:
            utilization = day['utilization']
            available_pct = day['available_capacity'] / day['total_capacity'] if day['total_capacity'] > 0 else 1.0
            
            if utilization >= settings.WORKLOAD_THRESHOLD_HIGH:
                risk_level = RiskLevel.HIGH
                message = f"Critical: Only {available_pct:.0%} capacity available"
            elif utilization >= settings.WORKLOAD_THRESHOLD_MEDIUM:
                risk_level = RiskLevel.MEDIUM
                message = f"Warning: Only {available_pct:.0%} capacity available"
            else:
                continue
            
            conflicts.append({
                'date': day['date'],
                'risk_level': risk_level.value,
                'utilization': round(utilization, 2),
                'total_capacity': day['total_capacity'],
                'available_capacity': day['available_capacity'],
                'absent_count': day['absent_count'],
                'message': message
            })
        
        return {
            'team_id': team_id,
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            },
            'conflicts': conflicts,
            'has_conflicts': len(conflicts) > 0,
            'summary': {
                'total_conflict_days': len(conflicts),
                'high_risk_days': sum(1 for c in conflicts if c['risk_level'] == RiskLevel.HIGH.value),
                'medium_risk_days': sum(1 for c in conflicts if c['risk_level'] == RiskLevel.MEDIUM.value)
            }
        }
    
    def get_capacity_forecast(self, team_id: str, days_ahead: int = 30) -> Dict:
        """Get capacity forecast"""
        start_date = date.today()
        end_date = start_date + timedelta(days=days_ahead)
        
        analysis = self.analyze_team_workload(team_id, start_date, end_date)
        
        return {
            'team_id': team_id,
            'forecast_days': days_ahead,
            'forecast_start': start_date.isoformat(),
            'forecast_end': end_date.isoformat(),
            'daily_forecast': analysis['daily_capacity'],
            'summary': analysis['metrics']
        }
    
    def get_workload_distribution(self, team_id: str) -> Dict:
        """Optimized distribution - single query with aggregation"""
        # Single query for team members
        team_members = self.db.table('users').select('id, full_name').eq('team_id', team_id).execute()
        
        if not team_members.data:
            raise TeamNotFoundError(f"No members found for team {team_id}")
        
        member_ids = [m['id'] for m in team_members.data]
        
        # Single query for all active leaves
        leaves = self.db.table('leave_requests').select(
            'user_id, start_date, end_date, status'
        ).in_('user_id', member_ids).in_(
            'status', ['approved', 'pending', 'auto_approved']
        ).gte('end_date', date.today().isoformat()).execute()
        
        # Build distribution map
        leave_counts = {}
        on_leave_today = set()
        today = date.today()
        
        for leave in leaves.data or []:
            user_id = leave['user_id']
            leave_counts[user_id] = leave_counts.get(user_id, 0) + 1
            
            leave_start = date.fromisoformat(leave['start_date'])
            leave_end = date.fromisoformat(leave['end_date'])
            if leave_start <= today <= leave_end:
                on_leave_today.add(user_id)
        
        distribution = []
        for member in team_members.data:
            distribution.append({
                'user_id': member['id'],
                'user_name': member.get('full_name', 'Unknown'),
                'active_leaves': leave_counts.get(member['id'], 0),
                'on_leave_today': member['id'] in on_leave_today
            })
        
        total_on_leave = len(on_leave_today)
        total_available = len(distribution) - total_on_leave
        
        return {
            'team_id': team_id,
            'distribution': distribution,
            'summary': {
                'total_members': len(distribution),
                'available_today': total_available,
                'on_leave_today': total_on_leave,
                'availability_rate': round(total_available / len(distribution), 2) if distribution else 0
            }
        }
    
    def _build_absence_map(self, leaves: List[Dict], start_date: date, end_date: date) -> Dict[date, set]:
        """Build efficient absence lookup map"""
        absence_map = {}
        
        for leave in leaves:
            leave_start = date.fromisoformat(leave['start_date'])
            leave_end = date.fromisoformat(leave['end_date'])
            
            # Clamp to analysis period
            actual_start = max(leave_start, start_date)
            actual_end = min(leave_end, end_date)
            
            current = actual_start
            while current <= actual_end:
                if current.weekday() < 5:  # Weekday only
                    if current not in absence_map:
                        absence_map[current] = set()
                    absence_map[current].add(leave['user_id'])
                current += timedelta(days=1)
        
        return absence_map
