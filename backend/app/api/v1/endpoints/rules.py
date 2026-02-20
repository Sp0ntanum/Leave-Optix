from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from datetime import datetime

router = APIRouter()


@router.get("/")
async def get_auto_approval_rules(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Get all auto-approval rules"""
    try:
        response = db.table("auto_approval_rules").select("*").eq("is_active", True).order("priority").execute()
        return {"rules": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_auto_approval_rule(
    rule_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Create a new auto-approval rule (manager only)"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(status_code=403, detail="Only managers can create rules")
    
    try:
        rule = {
            "name": rule_data["name"],
            "description": rule_data.get("description"),
            "leave_type": rule_data.get("leave_type"),
            "max_duration_days": rule_data.get("max_duration_days"),
            "min_notice_days": rule_data.get("min_notice_days"),
            "max_team_absence_percent": rule_data.get("max_team_absence_percent"),
            "min_leave_balance": rule_data.get("min_leave_balance"),
            "priority": rule_data.get("priority", 1),
            "is_active": True,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = db.table("auto_approval_rules").insert(rule).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{rule_id}")
async def update_auto_approval_rule(
    rule_id: str,
    rule_data: dict,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Update an auto-approval rule"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(status_code=403, detail="Only managers can update rules")
    
    try:
        response = db.table("auto_approval_rules").update(rule_data).eq("id", rule_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Rule not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{rule_id}")
async def delete_auto_approval_rule(
    rule_id: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Delete an auto-approval rule"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(status_code=403, detail="Only managers can delete rules")
    
    try:
        db.table("auto_approval_rules").update({"is_active": False}).eq("id", rule_id).execute()
        return {"message": "Rule deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate_leave_request(
    leave_request: dict,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Evaluate if a leave request should be auto-approved"""
    try:
        # Get active rules
        rules_response = db.table("auto_approval_rules").select("*").eq("is_active", True).order("priority").execute()
        rules = rules_response.data
        
        # Get leave request details
        start_date = datetime.fromisoformat(leave_request["start_date"])
        end_date = datetime.fromisoformat(leave_request["end_date"])
        duration = (end_date - start_date).days + 1
        notice_days = (start_date - datetime.now()).days
        
        # Get user leave balance
        balance_response = db.table("leave_balances").select("*").eq("user_id", leave_request["user_id"]).execute()
        leave_balance = balance_response.data[0]["balance"] if balance_response.data else 0
        
        # Get team absence percentage
        team_response = db.rpc("calculate_team_absence", {
            "start_date": leave_request["start_date"],
            "end_date": leave_request["end_date"]
        }).execute()
        team_absence_percent = team_response.data if team_response.data else 0
        
        # Evaluate rules
        for rule in rules:
            matches = True
            reasons = []
            
            if rule["leave_type"] and rule["leave_type"] != leave_request["leave_type"]:
                matches = False
            
            if rule["max_duration_days"] and duration > rule["max_duration_days"]:
                matches = False
                reasons.append(f"Duration exceeds {rule['max_duration_days']} days")
            
            if rule["min_notice_days"] and notice_days < rule["min_notice_days"]:
                matches = False
                reasons.append(f"Notice period less than {rule['min_notice_days']} days")
            
            if rule["max_team_absence_percent"] and team_absence_percent > rule["max_team_absence_percent"]:
                matches = False
                reasons.append(f"Team absence exceeds {rule['max_team_absence_percent']}%")
            
            if rule["min_leave_balance"] and leave_balance < rule["min_leave_balance"]:
                matches = False
                reasons.append(f"Leave balance below {rule['min_leave_balance']} days")
            
            if matches:
                return {
                    "auto_approved": True,
                    "rule_matched": rule["name"],
                    "rule_id": rule["id"]
                }
        
        return {
            "auto_approved": False,
            "reasons": reasons if reasons else ["No matching auto-approval rule found"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
