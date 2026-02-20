from supabase import Client
from app.schemas.approval import ApprovalAction, ApprovalStatus, ApprovalResponse
from app.schemas.leave import LeaveStatus
from app.exceptions import (
    UnauthorizedApprovalError,
    LeaveRequestNotFoundError,
    InvalidLeaveStatusError,
    UserNotFoundError
)
from datetime import date, datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ApprovalService:
    def __init__(self, db: Client):
        self.db = db
    
    def get_pending_approvals(
        self,
        manager_id: str,
        page: int = 1,
        page_size: int = 20
    ) -> dict:
        """Get pending approvals with optimized query (no N+1)"""
        # Get manager's team in single query
        manager_result = self.db.table('users').select('team_id').eq('id', manager_id).single().execute()
        
        if not manager_result.data:
            raise UserNotFoundError("Manager not found")
        
        team_id = manager_result.data.get('team_id')
        
        if not team_id:
            return {
                "items": [],
                "total": 0,
                "page": page,
                "page_size": page_size
            }
        
        # Single query with join - select only needed columns
        offset = (page - 1) * page_size
        result = self.db.table('leave_requests').select(
            'id, user_id, leave_type, start_date, end_date, reason, days_count, created_at, '
            'users!inner(id, full_name, email)'
        ).eq('users.team_id', team_id).eq('status', LeaveStatus.PENDING.value).order(
            'created_at', desc=False
        ).range(offset, offset + page_size - 1).execute()
        
        # Get total count
        count_result = self.db.table('leave_requests').select(
            'id', count='exact'
        ).eq('status', LeaveStatus.PENDING.value).execute()
        
        total = count_result.count if hasattr(count_result, 'count') else len(count_result.data or [])
        
        return {
            "items": result.data or [],
            "total": total,
            "page": page,
            "page_size": page_size
        }
    
    def process_approval(
        self,
        leave_id: str,
        manager_id: str,
        action: ApprovalAction
    ) -> dict:
        """Process approval atomically (race condition safe)"""
        # Validate manager authority first
        leave_result = self.db.table('leave_requests').select(
            'id, user_id, users!inner(team_id)'
        ).eq('id', leave_id).single().execute()
        
        if not leave_result.data:
            raise LeaveRequestNotFoundError("Leave request not found")
        
        leave_request = leave_result.data
        
        manager_result = self.db.table('users').select('team_id, role').eq('id', manager_id).single().execute()
        
        if not manager_result.data:
            raise UserNotFoundError("Manager not found")
        
        manager = manager_result.data
        
        if manager.get('role') not in ['manager', 'admin']:
            raise UnauthorizedApprovalError("User is not a manager")
        
        if manager.get('team_id') != leave_request['users']['team_id']:
            raise UnauthorizedApprovalError("Manager does not have authority over this team")
        
        # Use atomic RPC function
        try:
            new_status = 'approved' if action.status == ApprovalStatus.APPROVED else 'rejected'
            
            result = self.db.rpc('process_approval_atomic', {
                'p_leave_id': leave_id,
                'p_manager_id': manager_id,
                'p_status': new_status,
                'p_comments': action.comments or ''
            }).execute()
            
            if not result.data:
                raise Exception("Failed to process approval")
            
            return result.data
            
        except Exception as e:
            error_msg = str(e)
            if 'not found' in error_msg.lower():
                raise LeaveRequestNotFoundError(error_msg)
            elif 'not pending' in error_msg.lower():
                raise InvalidLeaveStatusError(error_msg)
            logger.error(f"Error processing approval: {error_msg}")
            raise
    
    def get_approval_history(
        self,
        manager_id: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        page: int = 1,
        page_size: int = 20
    ) -> dict:
        """Get approval history with optimized query"""
        # Single query with join - select only needed columns
        query = self.db.table('leave_requests').select(
            'id, user_id, leave_type, start_date, end_date, status, approved_at, rejection_reason, '
            'users!inner(full_name, email)',
            count='exact'
        ).eq('approved_by', manager_id).in_(
            'status', [LeaveStatus.APPROVED.value, LeaveStatus.REJECTED.value]
        )
        
        if start_date:
            query = query.gte('approved_at', start_date.isoformat())
        if end_date:
            query = query.lte('approved_at', end_date.isoformat())
        
        # Get total
        count_result = query.execute()
        total = count_result.count if hasattr(count_result, 'count') else len(count_result.data or [])
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.order('approved_at', desc=True).range(offset, offset + page_size - 1)
        
        result = query.execute()
        
        return {
            "items": result.data or [],
            "total": total,
            "page": page,
            "page_size": page_size
        }
    
    def _update_leave_balance(self, user_id: str, leave_type: str, days_count: float):
        """Update balance with single query"""
        result = self.db.table('leave_balances').select('id, used, pending').eq(
            'user_id', user_id
        ).eq('leave_type', leave_type).single().execute()
        
        if result.data:
            balance = result.data
            new_used = balance.get('used', 0) + days_count
            new_pending = max(0, balance.get('pending', 0) - days_count)
            
            self.db.table('leave_balances').update({
                'used': new_used,
                'pending': new_pending,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', balance['id']).execute()
