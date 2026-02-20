from fastapi import APIRouter, Depends
from supabase import Client
from app.core.database import get_db
from app.core.security import require_role

router = APIRouter()


@router.get("/approvals")
async def get_manager_approvals(
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Get pending approvals for manager"""
    return [
        {
            "id": 1,
            "employeeName": "Alice Johnson",
            "startDate": "2026-03-01",
            "endDate": "2026-03-03",
            "type": "Casual",
            "reason": "Personal work",
            "status": "Pending"
        },
        {
            "id": 2,
            "employeeName": "Bob Smith",
            "startDate": "2026-03-05",
            "endDate": "2026-03-07",
            "type": "Sick",
            "reason": "Medical appointment",
            "status": "Pending"
        },
        {
            "id": 3,
            "employeeName": "Carol Williams",
            "startDate": "2026-03-10",
            "endDate": "2026-03-15",
            "type": "Vacation",
            "reason": "Family trip",
            "status": "Pending"
        },
        {
            "id": 4,
            "employeeName": "David Brown",
            "startDate": "2026-03-12",
            "endDate": "2026-03-14",
            "type": "Casual",
            "reason": "Personal matters",
            "status": "Pending"
        },
        {
            "id": 5,
            "employeeName": "Emma Davis",
            "startDate": "2026-03-18",
            "endDate": "2026-03-20",
            "type": "Sick",
            "reason": "Health checkup",
            "status": "Pending"
        }
    ]


@router.get("/workload-visualization")
async def get_workload_visualization(
    current_user: dict = Depends(require_role("manager")),
    db: Client = Depends(get_db)
):
    """Get workload visualization data"""
    return {
        "taskDistribution": [
            {"member": "John Doe", "tasks": 7},
            {"member": "Alice Smith", "tasks": 5},
            {"member": "Bob Johnson", "tasks": 9},
            {"member": "Sarah Williams", "tasks": 6}
        ],
        "leaveOverlap": [
            {"month": "Jan", "leaves": 10},
            {"month": "Feb", "leaves": 8},
            {"month": "Mar", "leaves": 12},
            {"month": "Apr", "leaves": 15},
            {"month": "May", "leaves": 9},
            {"month": "Jun", "leaves": 11}
        ],
        "teamCapacity": [
            {"status": "Available", "value": 60},
            {"status": "On Leave", "value": 25},
            {"status": "Unavailable", "value": 15}
        ]
    }
