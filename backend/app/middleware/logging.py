"""Request ID and logging middleware"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import uuid
import time
import logging

logger = logging.getLogger(__name__)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Add unique request ID to each request"""
    
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        
        return response


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log requests without sensitive information"""
    
    SENSITIVE_PATHS = ['/api/v1/auth/login', '/api/v1/auth/signup', '/api/v1/auth/refresh']
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        request_id = getattr(request.state, "request_id", "unknown")
        
        # Log request (no body for sensitive endpoints)
        log_data = {
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host if request.client else "unknown"
        }
        
        if request.url.path not in self.SENSITIVE_PATHS:
            logger.info(f"Request started", extra=log_data)
        else:
            logger.info(f"Auth request started", extra=log_data)
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        log_data.update({
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2)
        })
        
        logger.info(f"Request completed", extra=log_data)
        
        return response
