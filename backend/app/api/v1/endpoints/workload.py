from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from app.core.security import get_current_user
from app.dependencies import get_workload_service
from app.services.workload_service import WorkloadService
from app.exceptions import TeamNotFoundError
from datetime import date

router = APIRouter()


@router.get("/team/{team_id}/analysis")
def get_team_workload_analysis(
    team_id: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: dict = Depends(get_current_user),
    service: WorkloadService = Depends(get_workload_service)
):
    """Get workload analysis for a team"""
    try:
        return service.analyze_team_workload(
            team_id=team_id,
            start_date=start_date,
            end_date=end_date
        )
    except TeamNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze team workload"
        )


@router.get("/capacity/forecast")
def get_capacity_forecast(
    team_id: str = Query(...),
    days_ahead: int = Query(30, ge=1, le=365),
    current_user: dict = Depends(get_current_user),
    service: WorkloadService = Depends(get_workload_service)
):
    """Get team capacity forecast"""
    try:
        return service.get_capacity_forecast(
            team_id=team_id,
            days_ahead=days_ahead
        )
    except TeamNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get capacity forecast"
        )


@router.get("/conflicts/detect")
def detect_workload_conflicts(
    team_id: str = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: dict = Depends(get_current_user),
    service: WorkloadService = Depends(get_workload_service)
):
    """Detect potential workload conflicts in a date range"""
    if start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_date must be before end_date"
        )
    
    try:
        return service.detect_conflicts(
            team_id=team_id,
            start_date=start_date,
            end_date=end_date
        )
    except TeamNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to detect conflicts"
        )


@router.get("/distribution/current")
def get_current_workload_distribution(
    team_id: str = Query(...),
    current_user: dict = Depends(get_current_user),
    service: WorkloadService = Depends(get_workload_service)
):
    """Get current workload distribution across team"""
    try:
        return service.get_workload_distribution(team_id=team_id)
    except TeamNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get workload distribution"
        )
