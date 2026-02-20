from pydantic import BaseModel, model_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class ApprovalStatus(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"


class ApprovalAction(BaseModel):
    status: ApprovalStatus
    comments: Optional[str] = None
    
    @model_validator(mode='after')
    def validate_rejection_comments(self):
        if self.status == ApprovalStatus.REJECTED and not self.comments:
            raise ValueError("Comments required when rejecting leave request")
        return self


class ApprovalResponse(BaseModel):
    leave_id: str
    status: str
    approved_by: str
    approved_at: str
    comments: Optional[str] = None
