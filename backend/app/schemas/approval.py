from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class ApprovalStatus(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"


class ApprovalAction(BaseModel):
    status: ApprovalStatus
    comments: Optional[str] = None


class ApprovalResponse(BaseModel):
    leave_id: str
    status: str
    approved_by: str
    approved_at: datetime
    comments: Optional[str] = None
