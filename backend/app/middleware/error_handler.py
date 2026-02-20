"""Structured error response middleware"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.exceptions import (
    LeaveOptixException,
    InsufficientLeaveBalanceError,
    OverlappingLeaveError,
    UnauthorizedApprovalError,
    InvalidLeaveStatusError,
    LeaveRequestNotFoundError,
    TeamNotFoundError,
    UserNotFoundError
)
import logging

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next):
    """Handle exceptions and return structured error responses"""
    try:
        response = await call_next(request)
        return response
    
    except InsufficientLeaveBalanceError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "insufficient_leave_balance",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except OverlappingLeaveError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "overlapping_leave",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except UnauthorizedApprovalError as e:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "error": "unauthorized",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except InvalidLeaveStatusError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "invalid_status",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except (LeaveRequestNotFoundError, TeamNotFoundError, UserNotFoundError) as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "error": "not_found",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except LeaveOptixException as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "application_error",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except ValueError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "validation_error",
                "message": str(e),
                "request_id": getattr(request.state, "request_id", None)
            }
        )
    
    except Exception as e:
        logger.exception("Unhandled exception", extra={
            "request_id": getattr(request.state, "request_id", None),
            "path": request.url.path
        })
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred",
                "request_id": getattr(request.state, "request_id", None)
            }
        )
