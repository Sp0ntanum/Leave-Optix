from fastapi import APIRouter, Depends, Query
from supabase import Client
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.services.approval_service import ApprovalService
from app.schemas.approval import ApprovalAction, ApprovalResponse
from datetime import date

router = APIRouter()


@router.get("/pending")
async def get_pending_approvals(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Get all pending approval requests for manager"""
    service = ApprovalService(db)
    return await service.get_pending_approvals(
        manager_id=current_user["id"],
        page=page,
        page_size=page_size
    )


@router.post("/{leave_id}/approve", response_model=ApprovalResponse)
async def approve_leave_request(
    leave_id: str,
    action: ApprovalAction,
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Approve or reject a leave request"""
    service = ApprovalService(db)
    return await service.process_approval(
        leave_id=leave_id,
        manager_id=current_user["id"],
        action=action
    )


@router.get("/history")
async def get_approval_history(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Get approval history for manager"""
    service = ApprovalService(db)
    return await service.get_approval_history(
        manager_id=current_user["id"],
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size
    )
