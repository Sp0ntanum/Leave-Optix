from fastapi import APIRouter, Depends
from supabase import Client
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_teams(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get all teams"""
    return {"message": "Get teams endpoint"}


@router.get("/{team_id}")
async def get_team(
    team_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get team by ID"""
    return {"message": f"Get team {team_id}"}


@router.get("/{team_id}/members")
async def get_team_members(
    team_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get team members"""
    return {"message": f"Get team {team_id} members"}
