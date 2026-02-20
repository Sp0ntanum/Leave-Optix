from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from enum import Enum


class LeaveType(str, Enum):
    VACATION = "vacation"
    SICK = "sick"
    PERSONAL = "personal"
    UNPAID = "unpaid"
    MATERNITY = "maternity"
    PATERNITY = "paternity"


class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    AUTO_APPROVED = "auto_approved"


class LeaveRequestCreate(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    is_half_day: bool = False
    half_day_period: Optional[str] = None  # "morning" or "afternoon"


class LeaveRequestUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    reason: Optional[str] = None
    is_half_day: Optional[bool] = None
    half_day_period: Optional[str] = None


class LeaveRequestResponse(BaseModel):
    id: str
    user_id: str
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    status: LeaveStatus
    is_half_day: bool
    half_day_period: Optional[str]
    days_count: float
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LeaveRequestList(BaseModel):
    items: List[LeaveRequestResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
