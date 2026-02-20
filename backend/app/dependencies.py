"""Dependency injection for services"""
from fastapi import Depends
from supabase import Client
from app.core.database import get_db
from app.services.leave_service import LeaveService
from app.services.approval_service import ApprovalService
from app.services.workload_service import WorkloadService


def get_leave_service(db: Client = Depends(get_db)) -> LeaveService:
    return LeaveService(db)


def get_approval_service(db: Client = Depends(get_db)) -> ApprovalService:
    return ApprovalService(db)


def get_workload_service(db: Client = Depends(get_db)) -> WorkloadService:
    return WorkloadService(db)
