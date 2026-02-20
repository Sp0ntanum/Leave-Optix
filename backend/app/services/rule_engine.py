"""
Auto-Approval Rule Engine
Evaluates leave requests against configurable approval rules
Works with existing approval_rules table without schema modifications
"""
from supabase import Client
from datetime import date
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)


class RuleEngine:
    """
    Rule engine for auto-approval decisions
    
    Evaluates leave requests against approval rules with support for:
    - Multiple conditions per rule
    - Operators: <=, >=, ==, in
    - Priority-based rule ordering
    """
    
    def __init__(self, db: Client):
        self.db = db
    
    def evaluate(self, leave_request: Dict, user_id: str) -> Dict:
        """
        Evaluate if leave request should be auto-approved
        
        Args:
            leave_request: Leave request data (must include leave_type, days_count, start_date)
            user_id: User ID for team-based rules
        
        Returns:
            {
                "auto_approved": bool,
                "rule_triggered": str | None,
                "reason": str
            }
        """
        logger.info(f"Evaluating auto-approval for leave request")
        
        try:
            # Fetch applicable rules
            rules = self._get_applicable_rules(user_id)
            
            if not rules:
                return {
                    "auto_approved": False,
                    "rule_triggered": None,
                    "reason": "No applicable rules found"
                }
            
            # Sort by priority (higher priority first)
            rules.sort(key=lambda r: r.get('priority', 0), reverse=True)
            
            # Evaluate each rule
            for rule in rules:
                if not rule.get('is_active', True):
                    continue
                
                if self._evaluate_rule(leave_request, rule):
                    logger.info(f"Rule {rule['id']} triggered auto-approval")
                    return {
                        "auto_approved": True,
                        "rule_triggered": rule['id'],
                        "reason": f"Auto-approved by rule: {rule.get('name', 'Unnamed')}"
                    }
            
            return {
                "auto_approved": False,
                "rule_triggered": None,
                "reason": "No matching rules"
            }
            
        except Exception as e:
            logger.error(f"Error evaluating rules: {str(e)}")
            return {
                "auto_approved": False,
                "rule_triggered": None,
                "reason": "Rule evaluation error"
            }
    
    def _get_applicable_rules(self, user_id: str) -> List[Dict]:
        """
        Fetch applicable rules for user
        
        Returns rules that are:
        - Active (is_active = true)
        - Either global (team_id is null) or for user's team
        """
        try:
            # Get user's team
            user_result = self.db.table('users').select('team_id').eq('id', user_id).execute()
            
            if not user_result.data:
                return []
            
            team_id = user_result.data[0].get('team_id')
            
            # Fetch rules (global or team-specific)
            query = self.db.table('approval_rules').select('*').eq('is_active', True)
            
            if team_id:
                # Get both global rules and team-specific rules
                query = query.or_(f'team_id.is.null,team_id.eq.{team_id}')
            else:
                # Only global rules
                query = query.is_('team_id', 'null')
            
            result = query.execute()
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error fetching rules: {str(e)}")
            return []
    
    def _evaluate_rule(self, leave_request: Dict, rule: Dict) -> bool:
        """
        Evaluate a single rule against leave request
        
        All conditions in the rule must be satisfied (AND logic)
        """
        conditions = rule.get('conditions', {})
        
        if not conditions:
            return False
        
        # Evaluate each condition
        for field, condition_spec in conditions.items():
            if not self._evaluate_condition(leave_request, field, condition_spec):
                return False
        
        return True
    
    def _evaluate_condition(self, leave_request: Dict, field: str, condition_spec: Any) -> bool:
        """
        Evaluate a single condition
        
        Condition spec can be:
        - Simple value: {"operator": "<=", "value": 5}
        - Direct value for equality: 5 (implies ==)
        """
        # Get field value from leave request
        field_value = self._get_field_value(leave_request, field)
        
        if field_value is None:
            return False
        
        # Handle condition spec format
        if isinstance(condition_spec, dict):
            operator = condition_spec.get('operator', '==')
            expected_value = condition_spec.get('value')
        else:
            # Direct value implies equality
            operator = '=='
            expected_value = condition_spec
        
        # Evaluate based on operator
        return self._apply_operator(field_value, operator, expected_value)
    
    def _get_field_value(self, leave_request: Dict, field: str) -> Any:
        """Extract field value from leave request"""
        
        if field == 'leave_days' or field == 'days_count':
            return leave_request.get('days_count', 0)
        
        elif field == 'advance_notice_days':
            start_date_str = leave_request.get('start_date')
            if start_date_str:
                start_date = date.fromisoformat(start_date_str) if isinstance(start_date_str, str) else start_date_str
                return (start_date - date.today()).days
            return 0
        
        elif field == 'leave_type':
            return leave_request.get('leave_type')
        
        elif field == 'is_half_day':
            return leave_request.get('is_half_day', False)
        
        else:
            # Generic field access
            return leave_request.get(field)
    
    def _apply_operator(self, field_value: Any, operator: str, expected_value: Any) -> bool:
        """Apply comparison operator"""
        
        try:
            if operator == '<=':
                return field_value <= expected_value
            
            elif operator == '>=':
                return field_value >= expected_value
            
            elif operator == '==':
                return field_value == expected_value
            
            elif operator == '!=':
                return field_value != expected_value
            
            elif operator == 'in':
                if isinstance(expected_value, list):
                    return field_value in expected_value
                return False
            
            elif operator == 'not_in':
                if isinstance(expected_value, list):
                    return field_value not in expected_value
                return True
            
            else:
                logger.warning(f"Unknown operator: {operator}")
                return False
                
        except Exception as e:
            logger.error(f"Error applying operator {operator}: {str(e)}")
            return False
