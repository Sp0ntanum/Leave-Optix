"""
Production-ready Leave Service
Works with existing Supabase tables without schema modifications
"""
from supabase import Client
from app.schemas.leave import LeaveRequestCreate, LeaveRequestUpdate
from app.exceptions import (
    InsufficientLeaveBalanceError,
    OverlappingLeaveError,
    LeaveRequestNotFoundError,
    InvalidLeaveStatusError
)
from app.services.rule_engine import RuleEngine
from datetime import date, datetime, timedelta
from typing import Optional, Dict, List
import logging

logger = logging.getLogger(__name__)


class LeaveService:
    def __init__(self, db: Client):
        self.db = db
    
    def create_leave_request(self, user_id: str, leave_data: LeaveRequestCreate) -> Dict:
        """
        Create a new leave request with atomic validation (race condition safe)
        """
        logger.info(f"Creating leave request for user {user_id}")
        
        if leave_data.start_date > leave_data.end_date:
            raise ValueError("start_date must be before or equal to end_date")
        
        days_count = self._calculate_leave_days(
            leave_data.start_date,
            leave_data.end_date,
            leave_data.is_half_day
        )
        
        try:
            # Use atomic RPC function (prevents race conditions)
            result = self.db.rpc('create_leave_request_atomic', {
                'p_user_id': user_id,
                'p_leave_type': leave_data.leave_type.value,
                'p_start_date': leave_data.start_date.isoformat(),
                'p_end_date': leave_data.end_date.isoformat(),
                'p_reason': leave_data.reason,
                'p_days_count': days_count,
                'p_is_half_day': leave_data.is_half_day,
                'p_half_day_period': leave_data.half_day_period
            }).execute()
            
            if not result.data:
                raise Exception("Failed to create leave request")
            
            created_leave = result.data
            
            # Check auto-approval rules
            rule_engine = RuleEngine(self.db)
            auto_approval_decision = rule_engine.evaluate(created_leave, user_id)
            
            if auto_approval_decision['auto_approved']:
                created_leave = self._apply_auto_approval(
                    created_leave['id'],
                    auto_approval_decision['rule_triggered']
                )
                logger.info(f"Leave request auto-approved by rule: {auto_approval_decision['rule_triggered']}")
            
            logger.info(f"Leave request created successfully: {created_leave.get('id')}")
            return created_leave
            
        except Exception as e:
            error_msg = str(e)
            if 'Insufficient balance' in error_msg:
                raise InsufficientLeaveBalanceError(error_msg)
            elif 'Overlapping leave' in error_msg:
                raise OverlappingLeaveError(error_msg)
            logger.error(f"Error creating leave request: {error_msg}")
            raise
    
    def get_leave_history(
        self,
        user_id: str,
        status: Optional[str] = None,
        leave_type: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Dict:
        """
        Get leave history with filtering and pagination
        
        Filters:
        - status: Filter by leave status
        - leave_type: Filter by leave type
        - start_date: Filter leaves starting from this date
        - end_date: Filter leaves ending before this date
        
        Returns: Paginated leave history
        """
        try:
            # Build query
            query = self.db.table('leave_requests').select('*', count='exact').eq('user_id', user_id)
            
            # Apply filters
            if status:
                query = query.eq('status', status)
            
            if leave_type:
                query = query.eq('leave_type', leave_type)
            
            if start_date:
                query = query.gte('start_date', start_date.isoformat())
            
            if end_date:
                query = query.lte('end_date', end_date.isoformat())
            
            # Get total count
            count_result = query.execute()
            total = count_result.count if hasattr(count_result, 'count') else len(count_result.data or [])
            
            # Apply pagination and ordering
            offset = (page - 1) * page_size
            query = query.order('created_at', desc=True).range(offset, offset + page_size - 1)
            
            result = query.execute()
            
            return {
                'items': result.data or [],
                'total': total,
                'page': page,
                'page_size': page_size,
                'total_pages': (total + page_size - 1) // page_size if total > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Error fetching leave history: {str(e)}")
            raise
    
    def get_leave_request(self, leave_id: str, user_id: str) -> Dict:
        """Get a specific leave request"""
        try:
            result = self.db.table('leave_requests').select('*').eq('id', leave_id).eq('user_id', user_id).execute()
            
            if not result.data:
                raise LeaveRequestNotFoundError(f"Leave request {leave_id} not found")
            
            return result.data[0]
            
        except LeaveRequestNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Error fetching leave request: {str(e)}")
            raise
    
    def update_leave_request(
        self,
        leave_id: str,
        user_id: str,
        leave_data: LeaveRequestUpdate
    ) -> Dict:
        """Update a leave request (only if pending)"""
        try:
            # Get existing request
            existing = self.get_leave_request(leave_id, user_id)
            
            # Validate status
            if existing['status'] != 'pending':
                raise InvalidLeaveStatusError("Can only update pending leave requests")
            
            # Build update data
            update_data = {'updated_at': datetime.utcnow().isoformat()}
            recalculate_days = False
            
            if leave_data.start_date:
                update_data['start_date'] = leave_data.start_date.isoformat()
                recalculate_days = True
            
            if leave_data.end_date:
                update_data['end_date'] = leave_data.end_date.isoformat()
                recalculate_days = True
            
            if leave_data.reason:
                update_data['reason'] = leave_data.reason
            
            if leave_data.is_half_day is not None:
                update_data['is_half_day'] = leave_data.is_half_day
                recalculate_days = True
            
            if leave_data.half_day_period:
                update_data['half_day_period'] = leave_data.half_day_period
            
            # Recalculate days if dates changed
            if recalculate_days:
                start = leave_data.start_date or date.fromisoformat(existing['start_date'])
                end = leave_data.end_date or date.fromisoformat(existing['end_date'])
                is_half = leave_data.is_half_day if leave_data.is_half_day is not None else existing['is_half_day']
                
                old_days = existing['days_count']
                new_days = self._calculate_leave_days(start, end, is_half)
                update_data['days_count'] = new_days
                
                # Update pending balance
                if old_days != new_days:
                    days_diff = new_days - old_days
                    self._update_pending_balance(user_id, existing['leave_type'], days_diff, increment=True)
            
            # Update record
            result = self.db.table('leave_requests').update(update_data).eq('id', leave_id).execute()
            
            if not result.data:
                raise LeaveRequestNotFoundError(f"Leave request {leave_id} not found")
            
            return result.data[0]
            
        except (LeaveRequestNotFoundError, InvalidLeaveStatusError):
            raise
        except Exception as e:
            logger.error(f"Error updating leave request: {str(e)}")
            raise
    
    def cancel_leave_request(self, leave_id: str, user_id: str) -> None:
        """
        Cancel a leave request atomically (race condition safe)
        """
        try:
            # Use atomic RPC function
            result = self.db.rpc('cancel_leave_request_atomic', {
                'p_leave_id': leave_id,
                'p_user_id': user_id
            }).execute()
            
            if not result.data:
                raise Exception("Failed to cancel leave request")
            
            logger.info(f"Leave request {leave_id} cancelled successfully")
            
        except Exception as e:
            error_msg = str(e)
            if 'not found' in error_msg.lower():
                raise LeaveRequestNotFoundError(error_msg)
            elif 'Cannot cancel' in error_msg:
                raise InvalidLeaveStatusError(error_msg)
            logger.error(f"Error cancelling leave request: {error_msg}")
            raise
    
    def get_leave_balance(self, user_id: str) -> Dict:
        """Get user's leave balance summary"""
        try:
            result = self.db.table('leave_balances').select('*').eq('user_id', user_id).execute()
            
            balances = {}
            for balance in result.data or []:
                leave_type = balance['leave_type']
                total = balance.get('total', 0)
                used = balance.get('used', 0)
                pending = balance.get('pending', 0)
                
                balances[leave_type] = {
                    'total': total,
                    'used': used,
                    'pending': pending,
                    'available': total - used - pending
                }
            
            return {
                'user_id': user_id,
                'balances': balances
            }
            
        except Exception as e:
            logger.error(f"Error fetching leave balance: {str(e)}")
            raise
    
    # Private helper methods
    
    def _calculate_leave_days(self, start_date: date, end_date: date, is_half_day: bool) -> float:
        """Calculate number of leave days excluding weekends"""
        if is_half_day:
            return 0.5
        
        days = 0
        current = start_date
        
        while current <= end_date:
            # Monday = 0, Sunday = 6
            if current.weekday() < 5:  # Weekday
                days += 1
            current += timedelta(days=1)
        
        return float(days)
    
    def _get_available_balance(self, user_id: str, leave_type: str) -> float:
        """Get available leave balance for user and leave type"""
        try:
            result = self.db.table('leave_balances').select('*').eq(
                'user_id', user_id
            ).eq('leave_type', leave_type).execute()
            
            if not result.data:
                return 0.0
            
            balance = result.data[0]
            total = balance.get('total', 0)
            used = balance.get('used', 0)
            pending = balance.get('pending', 0)
            
            return total - used - pending
            
        except Exception as e:
            logger.error(f"Error fetching available balance: {str(e)}")
            return 0.0
    
    def _has_overlapping_leaves(self, user_id: str, start_date: date, end_date: date) -> bool:
        """Check if user has overlapping leave requests"""
        try:
            # Get all active leaves (pending, approved, auto_approved)
            result = self.db.table('leave_requests').select('id, start_date, end_date').eq(
                'user_id', user_id
            ).in_('status', ['pending', 'approved', 'auto_approved']).execute()
            
            for leave in result.data or []:
                existing_start = date.fromisoformat(leave['start_date'])
                existing_end = date.fromisoformat(leave['end_date'])
                
                # Check for overlap: (start1 <= end2) and (end1 >= start2)
                if start_date <= existing_end and end_date >= existing_start:
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking overlapping leaves: {str(e)}")
            return False
    
    def _update_pending_balance(self, user_id: str, leave_type: str, days: float, increment: bool) -> None:
        """Update pending balance (increment or decrement)"""
        try:
            result = self.db.table('leave_balances').select('*').eq(
                'user_id', user_id
            ).eq('leave_type', leave_type).execute()
            
            if result.data:
                balance = result.data[0]
                current_pending = balance.get('pending', 0)
                new_pending = current_pending + days if increment else current_pending - days
                new_pending = max(0, new_pending)  # Ensure non-negative
                
                self.db.table('leave_balances').update({
                    'pending': new_pending,
                    'updated_at': datetime.utcnow().isoformat()
                }).eq('id', balance['id']).execute()
                
        except Exception as e:
            logger.error(f"Error updating pending balance: {str(e)}")
    
    def _update_used_balance(self, user_id: str, leave_type: str, days: float, increment: bool) -> None:
        """Update used balance (increment or decrement)"""
        try:
            result = self.db.table('leave_balances').select('*').eq(
                'user_id', user_id
            ).eq('leave_type', leave_type).execute()
            
            if result.data:
                balance = result.data[0]
                current_used = balance.get('used', 0)
                new_used = current_used + days if increment else current_used - days
                new_used = max(0, new_used)  # Ensure non-negative
                
                self.db.table('leave_balances').update({
                    'used': new_used,
                    'updated_at': datetime.utcnow().isoformat()
                }).eq('id', balance['id']).execute()
                
        except Exception as e:
            logger.error(f"Error updating used balance: {str(e)}")
    
    def _apply_auto_approval(self, leave_id: str, rule_id: str) -> Dict:
        """Apply auto-approval to leave request"""
        try:
            update_data = {
                'status': 'auto_approved',
                'approved_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.db.table('leave_requests').update(update_data).eq('id', leave_id).execute()
            
            if not result.data:
                raise Exception("Failed to apply auto-approval")
            
            approved_leave = result.data[0]
            
            # Move from pending to used balance
            self._update_used_balance(
                approved_leave['user_id'],
                approved_leave['leave_type'],
                approved_leave['days_count'],
                increment=True
            )
            
            return approved_leave
            
        except Exception as e:
            logger.error(f"Error applying auto-approval: {str(e)}")
            raise
