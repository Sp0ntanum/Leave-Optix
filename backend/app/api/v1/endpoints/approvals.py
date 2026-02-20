from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.core.security import get_current_user, require_role, UserRole
from app.dependencies import get_approval_service
from app.services.approval_service import ApprovalService
from app.schemas.approval import ApprovalAction, ApprovalResponse
from app.exceptions import (
    UnauthorizedApprovalError,
    LeaveRequestNotFoundError,
    InvalidLeaveStatusError,
    UserNotFoundError
)
from datetime import date

router = APIRouter()


@router.get("/pending")
def get_pending_approvals(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role(UserRole.MANAGER)),
    service: ApprovalService = Depends(get_approval_service)
):
    """Get all pending approval requests for manager"""
    try:
        return service.get_pending_approvals(
            manager_id=current_user["id"],
            page=page,
            page_size=page_size
        )
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve pending approvals"
        )


@router.post("/{leave_id}/approve", response_model=ApprovalResponse)
def approve_leave_request(
    leave_id: str,
    action: ApprovalAction,
    current_user: dict = Depends(require_role(UserRole.MANAGER)),
    service: ApprovalService = Depends(get_approval_service)
):
    """Approve or reject a leave request"""
    try:
        return service.process_approval(
            leave_id=leave_id,
            manager_id=current_user["id"],
            action=action
        )
    except LeaveRequestNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    except UnauthorizedApprovalError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except InvalidLeaveStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Manager not found"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process approval"
        )


@router.get("/history")
def get_approval_history(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role(UserRole.MANAGER)),
    service: ApprovalService = Depends(get_approval_service)
):
    """Get approval history for manager"""
    try:
        return service.get_approval_history(
            manager_id=current_user["id"],
            start_date=start_date,
            end_date=end_date,
            page=page,
            page_size=page_size
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve approval history"
        )
