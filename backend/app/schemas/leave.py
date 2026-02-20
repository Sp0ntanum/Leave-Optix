from pydantic import BaseModel, field_validator, model_validator
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
    half_day_period: Optional[str] = None
    
    @field_validator('reason')
    @classmethod
    def validate_reason(cls, v):
        if len(v.strip()) < 10:
            raise ValueError("Reason must be at least 10 characters")
        return v.strip()
    
    @model_validator(mode='after')
    def validate_dates(self):
        if self.start_date > self.end_date:
            raise ValueError("start_date must be before or equal to end_date")
        
        if self.start_date < date.today():
            raise ValueError("Cannot request leave for past dates")
        
        if self.is_half_day and (self.start_date != self.end_date):
            raise ValueError("Half day leave must be for single day")
        
        if self.is_half_day and not self.half_day_period:
            raise ValueError("half_day_period required for half day leave")
        
        if self.half_day_period and self.half_day_period not in ["morning", "afternoon"]:
            raise ValueError("half_day_period must be 'morning' or 'afternoon'")
        
        return self


class LeaveRequestUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    reason: Optional[str] = None
    is_half_day: Optional[bool] = None
    half_day_period: Optional[str] = None
    
    @field_validator('reason')
    @classmethod
    def validate_reason(cls, v):
        if v and len(v.strip()) < 10:
            raise ValueError("Reason must be at least 10 characters")
        return v.strip() if v else None


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
