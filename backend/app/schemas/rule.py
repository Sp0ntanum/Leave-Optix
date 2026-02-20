from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class RuleConditionType(str, Enum):
    MAX_DAYS = "max_days"
    ADVANCE_NOTICE = "advance_notice"
    TEAM_CAPACITY = "team_capacity"
    LEAVE_TYPE = "leave_type"


class AutoApprovalRuleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    team_id: Optional[str] = None
    conditions: Dict[str, Any]
    is_active: bool = True
    priority: int = 0


class AutoApprovalRuleResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    team_id: Optional[str]
    conditions: Dict[str, Any]
    is_active: bool
    priority: int
    created_by: str
    created_at: datetime
    updated_at: datetime
