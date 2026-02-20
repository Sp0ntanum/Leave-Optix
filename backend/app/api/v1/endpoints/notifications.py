from fastapi import APIRouter, Depends, Query
from supabase import Client
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()


@router.get("/")
async def get_notifications(
    unread_only: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get user notifications"""
    return {"message": "Get notifications endpoint"}


@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Mark notification as read"""
    return {"message": f"Mark notification {notification_id} as read"}


@router.put("/read-all")
async def mark_all_read(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Mark all notifications as read"""
    return {"message": "Mark all notifications as read"}
