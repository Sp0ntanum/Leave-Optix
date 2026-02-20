from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.core.security import get_current_user
from app.dependencies import get_leave_service
from app.services.leave_service import LeaveService
from app.schemas.leave import (
    LeaveRequestCreate,
    LeaveRequestUpdate,
    LeaveRequestResponse,
    LeaveRequestList
)
from app.exceptions import (
    InsufficientLeaveBalanceError,
    OverlappingLeaveError,
    LeaveRequestNotFoundError,
    InvalidLeaveStatusError
)
from datetime import date

router = APIRouter()


@router.post("/", response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def create_leave_request(
    leave_data: LeaveRequestCreate,
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Create a new leave request"""
    try:
        result = service.create_leave_request(
            user_id=current_user["id"],
            leave_data=leave_data
        )
        return result
    except InsufficientLeaveBalanceError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except OverlappingLeaveError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create leave request"
        )


@router.get("/", response_model=LeaveRequestList)
def get_leave_requests(
    status_filter: Optional[str] = Query(None, alias="status"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Get user's leave requests with filters"""
    try:
        return service.get_user_leave_requests(
            user_id=current_user["id"],
            status=status_filter,
            start_date=start_date,
            end_date=end_date,
            page=page,
            page_size=page_size
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve leave requests"
        )


@router.get("/{leave_id}", response_model=LeaveRequestResponse)
def get_leave_request(
    leave_id: str,
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Get a specific leave request"""
    try:
        return service.get_leave_request(leave_id, current_user["id"])
    except LeaveRequestNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve leave request"
        )


@router.put("/{leave_id}", response_model=LeaveRequestResponse)
def update_leave_request(
    leave_id: str,
    leave_data: LeaveRequestUpdate,
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Update a leave request (only if pending)"""
    try:
        return service.update_leave_request(
            leave_id=leave_id,
            user_id=current_user["id"],
            leave_data=leave_data
        )
    except LeaveRequestNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    except InvalidLeaveStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update leave request"
        )


@router.delete("/{leave_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_leave_request(
    leave_id: str,
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Cancel a leave request"""
    try:
        service.cancel_leave_request(leave_id, current_user["id"])
        return None
    except LeaveRequestNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found"
        )
    except InvalidLeaveStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel leave request"
        )


@router.get("/me/balance")
def get_leave_balance(
    current_user: dict = Depends(get_current_user),
    service: LeaveService = Depends(get_leave_service)
):
    """Get user's leave balance summary"""
    try:
        return service.get_leave_balance(current_user["id"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve leave balance"
        )
