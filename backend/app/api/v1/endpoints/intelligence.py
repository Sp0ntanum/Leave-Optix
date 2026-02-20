from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

@router.get("/employee/{employee_id}/leave-history")
async def get_employee_leave_history(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get comprehensive leave history for an employee"""
    
    # Total leaves query
    total_query = text("""
        SELECT COUNT(*) as total_leaves,
               AVG(EXTRACT(DAY FROM (end_date - start_date))) as avg_duration
        FROM leave_requests
        WHERE user_id = :employee_id AND status = 'Approved'
    """)
    total_result = db.execute(total_query, {"employee_id": employee_id}).fetchone()
    
    # Leave by type breakdown
    type_query = text("""
        SELECT leave_type, COUNT(*) as count
        FROM leave_requests
        WHERE user_id = :employee_id AND status = 'Approved'
        GROUP BY leave_type
    """)
    type_results = db.execute(type_query, {"employee_id": employee_id}).fetchall()
    
    # Overlapping leaves count
    overlap_query = text("""
        SELECT COUNT(DISTINCT lr1.id) as overlapping_count
        FROM leave_requests lr1
        JOIN leave_requests lr2 ON lr1.user_id != lr2.user_id
        WHERE lr1.user_id = :employee_id
        AND lr1.status = 'Approved'
        AND lr2.status = 'Approved'
        AND lr1.start_date <= lr2.end_date
        AND lr1.end_date >= lr2.start_date
    """)
    overlap_result = db.execute(overlap_query, {"employee_id": employee_id}).fetchone()
    
    # Last 5 leaves
    recent_query = text("""
        SELECT id, leave_type, start_date, end_date, status, reason
        FROM leave_requests
        WHERE user_id = :employee_id
        ORDER BY created_at DESC
        LIMIT 5
    """)
    recent_results = db.execute(recent_query, {"employee_id": employee_id}).fetchall()
    
    # Monthly trend (last 12 months)
    trend_query = text("""
        SELECT 
            TO_CHAR(start_date, 'Mon YYYY') as month,
            COUNT(*) as leaves
        FROM leave_requests
        WHERE user_id = :employee_id
        AND status = 'Approved'
        AND start_date >= CURRENT_DATE - INTERVAL '12 months'
        GROUP BY TO_CHAR(start_date, 'Mon YYYY'), DATE_TRUNC('month', start_date)
        ORDER BY DATE_TRUNC('month', start_date)
    """)
    trend_results = db.execute(trend_query, {"employee_id": employee_id}).fetchall()
    
    return {
        "total_leaves": total_result.total_leaves or 0,
        "avg_leave_duration": round(total_result.avg_duration or 0, 1),
        "overlapping_leave_count": overlap_result.overlapping_count or 0,
        "leave_by_type": [{"type": r.leave_type, "count": r.count} for r in type_results],
        "last_5_leaves": [
            {
                "id": r.id,
                "type": r.leave_type,
                "start_date": r.start_date.isoformat(),
                "end_date": r.end_date.isoformat(),
                "status": r.status,
                "reason": r.reason
            } for r in recent_results
        ],
        "monthly_leave_trend": [{"month": r.month, "leaves": r.leaves} for r in trend_results]
    }


@router.get("/employee/{employee_id}/workload-analysis")
async def get_employee_workload_analysis(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Analyze employee workload and burnout risk"""
    
    # Current workload
    workload_query = text("""
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority_tasks,
            AVG(estimated_hours) as avg_weekly_hours
        FROM tasks
        WHERE assigned_to = :employee_id
        AND status NOT IN ('Completed', 'Cancelled')
    """)
    workload_result = db.execute(workload_query, {"employee_id": employee_id}).fetchone()
    
    # Last 4 weeks trend
    trend_query = text("""
        SELECT 
            DATE_TRUNC('week', created_at) as week,
            COUNT(*) as task_count
        FROM tasks
        WHERE assigned_to = :employee_id
        AND created_at >= CURRENT_DATE - INTERVAL '4 weeks'
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY week
    """)
    trend_results = db.execute(trend_query, {"employee_id": employee_id}).fetchall()
    
    # Calculate workload percentage (assuming 40 hours/week capacity)
    total_tasks = workload_result.total_tasks or 0
    avg_hours = workload_result.avg_weekly_hours or 0
    workload_percentage = min(100, int((avg_hours / 40) * 100))
    
    # Burnout risk calculation
    high_workload_weeks = sum(1 for r in trend_results if r.task_count > 15)
    if workload_percentage > 85 and high_workload_weeks >= 2:
        burnout_risk = "High"
    elif workload_percentage > 70:
        burnout_risk = "Medium"
    else:
        burnout_risk = "Low"
    
    return {
        "workload_percentage": workload_percentage,
        "total_tasks": total_tasks,
        "high_priority_tasks": workload_result.high_priority_tasks or 0,
        "avg_weekly_hours": round(avg_hours, 1),
        "burnout_risk": burnout_risk,
        "last_4_week_trend": [
            {"week": r.week.isoformat(), "tasks": r.task_count} 
            for r in trend_results
        ]
    }


@router.get("/project-risk-analysis")
async def get_project_risk_analysis(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Analyze project risks based on team availability and deadlines"""
    
    query = text("""
        WITH project_availability AS (
            SELECT 
                p.id,
                p.name,
                p.deadline,
                p.deadline - CURRENT_DATE as days_remaining,
                COUNT(DISTINCT tm.user_id) as total_team,
                COUNT(DISTINCT CASE 
                    WHEN lr.id IS NOT NULL THEN tm.user_id 
                END) as on_leave_count
            FROM projects p
            LEFT JOIN team_members tm ON p.id = tm.project_id
            LEFT JOIN leave_requests lr ON tm.user_id = lr.user_id
                AND lr.status = 'Approved'
                AND CURRENT_DATE BETWEEN lr.start_date AND lr.end_date
            WHERE p.status = 'Active'
            GROUP BY p.id, p.name, p.deadline
        )
        SELECT 
            id,
            name as project_name,
            deadline,
            days_remaining,
            CASE 
                WHEN total_team > 0 
                THEN ROUND(((total_team - on_leave_count)::numeric / total_team) * 100, 0)
                ELSE 100
            END as team_availability,
            on_leave_count as contributing_leaves,
            CASE
                WHEN ((total_team - on_leave_count)::numeric / NULLIF(total_team, 0)) < 0.7 
                     AND days_remaining < 7 THEN 'High'
                WHEN ((total_team - on_leave_count)::numeric / NULLIF(total_team, 0)) < 0.8 
                     AND days_remaining < 14 THEN 'Medium'
                ELSE 'Low'
            END as risk_level
        FROM project_availability
        ORDER BY 
            CASE 
                WHEN ((total_team - on_leave_count)::numeric / NULLIF(total_team, 0)) < 0.7 
                     AND days_remaining < 7 THEN 1
                WHEN ((total_team - on_leave_count)::numeric / NULLIF(total_team, 0)) < 0.8 
                     AND days_remaining < 14 THEN 2
                ELSE 3
            END,
            days_remaining
    """)
    
    results = db.execute(query).fetchall()
    
    return [
        {
            "project_id": r.id,
            "project_name": r.project_name,
            "deadline": r.deadline.isoformat(),
            "days_remaining": r.days_remaining,
            "team_availability": int(r.team_availability),
            "contributing_leaves": r.contributing_leaves,
            "risk_level": r.risk_level
        } for r in results
    ]


@router.post("/optimize-workload")
async def optimize_workload(
    leave_request_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Generate workload optimization plan using greedy balancing"""
    
    # Get current workload distribution
    workload_query = text("""
        SELECT 
            u.id,
            u.full_name,
            COUNT(t.id) as task_count,
            COALESCE(SUM(t.estimated_hours), 0) as total_hours
        FROM users u
        LEFT JOIN tasks t ON u.id = t.assigned_to 
            AND t.status NOT IN ('Completed', 'Cancelled')
        WHERE u.role = 'employee'
        GROUP BY u.id, u.full_name
    """)
    workload_results = db.execute(workload_query).fetchall()
    
    # Calculate capacity percentages
    employees = []
    for r in workload_results:
        capacity = min(100, int((r.total_hours / 40) * 100))
        employees.append({
            "id": r.id,
            "name": r.full_name,
            "task_count": r.task_count,
            "capacity": capacity,
            "hours": r.total_hours
        })
    
    # Identify overloaded (>85%) and underutilized (<60%)
    overloaded = [e for e in employees if e["capacity"] > 85]
    underutilized = [e for e in employees if e["capacity"] < 60]
    
    # Simple greedy redistribution
    transfers = []
    for over_emp in overloaded:
        if not underutilized:
            break
            
        # Get tasks from overloaded employee
        tasks_query = text("""
            SELECT id, title, estimated_hours
            FROM tasks
            WHERE assigned_to = :emp_id
            AND status NOT IN ('Completed', 'Cancelled')
            ORDER BY priority DESC, estimated_hours ASC
            LIMIT 3
        """)
        tasks = db.execute(tasks_query, {"emp_id": over_emp["id"]}).fetchall()
        
        for task in tasks:
            if not underutilized:
                break
            under_emp = underutilized[0]
            
            transfers.append({
                "task_id": task.id,
                "task_title": task.title,
                "from_employee": over_emp["name"],
                "to_employee": under_emp["name"],
                "hours": task.estimated_hours
            })
            
            # Update capacities
            over_emp["capacity"] -= int((task.estimated_hours / 40) * 100)
            under_emp["capacity"] += int((task.estimated_hours / 40) * 100)
            
            if under_emp["capacity"] >= 60:
                underutilized.pop(0)
    
    # Calculate before/after
    before_capacity = sum(e["capacity"] for e in employees) / len(employees) if employees else 0
    after_capacity = before_capacity + (len(transfers) * 5)  # Approximate improvement
    
    return {
        "before_capacity": round(before_capacity, 1),
        "after_capacity": round(min(100, after_capacity), 1),
        "transfers": transfers,
        "improvement_percentage": round(after_capacity - before_capacity, 1)
    }


@router.post("/what-if")
async def what_if_simulation(
    hypothetical_leaves: List[Dict[str, Any]],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Simulate impact of hypothetical leave requests"""
    
    # Get current team size
    team_query = text("SELECT COUNT(*) as total FROM users WHERE role = 'employee'")
    team_result = db.execute(team_query).fetchone()
    total_team = team_result.total
    
    # Count affected employees
    affected_count = len(hypothetical_leaves)
    
    # Calculate team capacity
    team_capacity = round(((total_team - affected_count) / total_team) * 100, 1)
    
    # Stability score (100 - impact percentage)
    stability_score = max(0, 100 - (affected_count / total_team * 100))
    
    # Count overloaded employees (those picking up extra work)
    overload_count = max(0, affected_count - int(total_team * 0.2))
    
    # Risk level determination
    if team_capacity < 70:
        risk_level = "High"
    elif team_capacity < 85:
        risk_level = "Medium"
    else:
        risk_level = "Low"
    
    return {
        "team_capacity": team_capacity,
        "stability_score": round(stability_score, 1),
        "overload_count": overload_count,
        "risk_level": risk_level,
        "affected_employees": affected_count,
        "total_team": total_team
    }


@router.get("/system-metrics")
async def get_system_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get system-wide analytics metrics"""
    
    # Total leave requests
    total_query = text("SELECT COUNT(*) as total FROM leave_requests")
    total_result = db.execute(total_query).fetchone()
    
    # Auto-approved percentage
    auto_approved_query = text("""
        SELECT 
            COUNT(CASE WHEN auto_approved = true THEN 1 END)::float / 
            NULLIF(COUNT(*), 0) * 100 as percentage
        FROM leave_requests
        WHERE status = 'Approved'
    """)
    auto_result = db.execute(auto_approved_query).fetchone()
    
    # Average response time
    response_query = text("""
        SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as avg_hours
        FROM leave_requests
        WHERE status IN ('Approved', 'Rejected')
    """)
    response_result = db.execute(response_query).fetchone()
    
    # Peak leave day
    peak_query = text("""
        SELECT start_date, COUNT(*) as count
        FROM leave_requests
        WHERE status = 'Approved'
        AND start_date >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY start_date
        ORDER BY count DESC
        LIMIT 1
    """)
    peak_result = db.execute(peak_query).fetchone()
    
    # Most overloaded employee
    overload_query = text("""
        SELECT u.full_name, COUNT(t.id) as task_count
        FROM users u
        JOIN tasks t ON u.id = t.assigned_to
        WHERE t.status NOT IN ('Completed', 'Cancelled')
        GROUP BY u.id, u.full_name
        ORDER BY task_count DESC
        LIMIT 1
    """)
    overload_result = db.execute(overload_query).fetchone()
    
    return {
        "total_leave_requests": total_result.total,
        "auto_approved_percentage": round(auto_result.percentage or 0, 1),
        "avg_response_time": round(response_result.avg_hours or 0, 1),
        "peak_leave_day": peak_result.start_date.isoformat() if peak_result else None,
        "peak_leave_count": peak_result.count if peak_result else 0,
        "most_overloaded_employee": overload_result.full_name if overload_result else "N/A",
        "overload_task_count": overload_result.task_count if overload_result else 0
    }
