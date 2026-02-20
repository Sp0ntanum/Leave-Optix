from fastapi import APIRouter, Depends, status
from supabase import Client
from typing import List
from app.core.database import get_db
from app.core.security import require_role
from app.schemas.rule import AutoApprovalRuleCreate, AutoApprovalRuleResponse

router = APIRouter()


@router.get("/", response_model=List[AutoApprovalRuleResponse])
async def get_auto_approval_rules(
    team_id: str = None,
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Get all auto-approval rules"""
    return {"message": "Get auto-approval rules endpoint"}


@router.post("/", response_model=AutoApprovalRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_auto_approval_rule(
    rule_data: AutoApprovalRuleCreate,
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Create a new auto-approval rule"""
    return {"message": "Create auto-approval rule endpoint"}


@router.put("/{rule_id}", response_model=AutoApprovalRuleResponse)
async def update_auto_approval_rule(
    rule_id: str,
    rule_data: AutoApprovalRuleCreate,
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Update an auto-approval rule"""
    return {"message": f"Update rule {rule_id} endpoint"}


@router.delete("/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_auto_approval_rule(
    rule_id: str,
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Delete an auto-approval rule"""
    return None
