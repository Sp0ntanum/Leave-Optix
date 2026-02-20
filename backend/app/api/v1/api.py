from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    leaves,
    users,
    teams,
    workload,
    approvals,
    calendar,
    notifications,
    dashboard,
    rules
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(teams.router, prefix="/teams", tags=["Teams"])
api_router.include_router(leaves.router, prefix="/leaves", tags=["Leave Requests"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
api_router.include_router(workload.router, prefix="/workload", tags=["Workload Analysis"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["Calendar"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(rules.router, prefix="/rules", tags=["Auto-Approval Rules"])
