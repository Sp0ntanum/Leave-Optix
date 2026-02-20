from fastapi import APIRouter, Depends
from supabase import Client
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_users(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get all users"""
    # Implementation
    return {"message": "Get users endpoint"}


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get user by ID"""
    # Implementation
    return {"message": f"Get user {user_id}"}
