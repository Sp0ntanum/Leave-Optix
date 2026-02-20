from fastapi import APIRouter, Depends, Query
from supabase import Client
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.workload_service import WorkloadService
from datetime import date

router = APIRouter()


@router.get("/team/{team_id}/analysis")
async def get_team_workload_analysis(
    team_id: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get workload analysis for a team"""
    service = WorkloadService(db)
    return await service.analyze_team_workload(
        team_id=team_id,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/capacity/forecast")
async def get_capacity_forecast(
    team_id: str = Query(...),
    days_ahead: int = Query(30, ge=1, le=365),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get team capacity forecast"""
    service = WorkloadService(db)
    return await service.get_capacity_forecast(
        team_id=team_id,
        days_ahead=days_ahead
    )


@router.get("/conflicts/detect")
async def detect_workload_conflicts(
    team_id: str = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Detect potential workload conflicts in a date range"""
    service = WorkloadService(db)
    return await service.detect_conflicts(
        team_id=team_id,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/distribution/current")
async def get_current_workload_distribution(
    team_id: str = Query(...),
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get current workload distribution across team"""
    service = WorkloadService(db)
    return await service.get_workload_distribution(team_id=team_id)
