"""Custom exceptions for Leave-Optix application"""


class LeaveOptixException(Exception):
    """Base exception for Leave-Optix"""
    pass


class InsufficientLeaveBalanceError(LeaveOptixException):
    """Raised when user doesn't have enough leave balance"""
    pass


class OverlappingLeaveError(LeaveOptixException):
    """Raised when leave request overlaps with existing leave"""
    pass


class UnauthorizedApprovalError(LeaveOptixException):
    """Raised when user tries to approve leave without authority"""
    pass


class InvalidLeaveStatusError(LeaveOptixException):
    """Raised when trying to perform action on leave in invalid status"""
    pass


class LeaveRequestNotFoundError(LeaveOptixException):
    """Raised when leave request is not found"""
    pass


class TeamNotFoundError(LeaveOptixException):
    """Raised when team is not found"""
    pass


class UserNotFoundError(LeaveOptixException):
    """Raised when user is not found"""
    pass
