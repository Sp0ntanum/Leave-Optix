from fastapi import APIRouter, Depends, HTTPException, status, Query
from supabase import Client
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.leave import (
    LeaveRequestCreate,
    LeaveRequestUpdate,
    LeaveRequestResponse,
    LeaveRequestList
)
from app.services.leave_service import LeaveService
from datetime import date

router = APIRouter()


@router.post("/", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_leave_request(
    leave_data: LeaveRequestCreate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Create a new leave request"""
    service = LeaveService(db)
    return await service.create_leave_request(
        user_id=current_user["id"],
        leave_data=leave_data
    )


@router.get("/", response_model=LeaveRequestList)
async def get_leave_requests(
    status: Optional[str] = Query(None, description="Filter by status"),
    start_date: Optional[date] = Query(None, description="Filter from date"),
    end_date: Optional[date] = Query(None, description="Filter to date"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get user's leave requests with filters"""
    service = LeaveService(db)
    return await service.get_user_leave_requests(
        user_id=current_user["id"],
        status=status,
        start_date=start_date,
        end_date=end_date,
        page=page,
        page_size=page_size
    )


@router.get("/{leave_id}", response_model=LeaveRequestResponse)
async def get_leave_request(
    leave_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get a specific leave request"""
    service = LeaveService(db)
    return await service.get_leave_request(leave_id, current_user["id"])


@router.put("/{leave_id}", response_model=LeaveRequestResponse)
async def update_leave_request(
    leave_id: str,
    leave_data: LeaveRequestUpdate,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Update a leave request (only if pending)"""
    service = LeaveService(db)
    return await service.update_leave_request(
        leave_id=leave_id,
        user_id=current_user["id"],
        leave_data=leave_data
    )


@router.delete("/{leave_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_leave_request(
    leave_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Cancel a leave request"""
    service = LeaveService(db)
    await service.cancel_leave_request(leave_id, current_user["id"])
    return None


@router.put("/update/{leave_id}")
async def update_leave_status(
    leave_id: int,
    status_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Update leave request status (for managers)"""
    # Mock response for demo
    return {"message": f"Leave request {leave_id} updated to {status_data.get('status')}"}


@router.get("/balance/summary")
async def get_leave_balance(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get user's leave balance summary"""
    service = LeaveService(db)
    return await service.get_leave_balance(current_user["id"])
