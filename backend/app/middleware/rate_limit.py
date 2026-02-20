"""Rate limiting middleware for API endpoints"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiter"""
    
    def __init__(self, app):
        super().__init__(app)
        self.requests: Dict[str, Dict[str, list]] = defaultdict(lambda: defaultdict(list))
        self.limits = {
            '/api/v1/auth/login': (5, 60),
            '/api/v1/auth/signup': (3, 300),
            '/api/v1/leaves/': (10, 60),
        }
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path
        
        limit_config = self._get_limit_config(path, request.method)
        
        if limit_config:
            max_requests, window_seconds = limit_config
            
            if not self._check_rate_limit(client_ip, path, max_requests, window_seconds):
                logger.warning(f"Rate limit exceeded for {client_ip} on {path}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later."
                )
        
        response = await call_next(request)
        return response
    
    def _get_limit_config(self, path: str, method: str) -> Tuple[int, int] | None:
        if method == "POST":
            for limit_path, config in self.limits.items():
                if path.startswith(limit_path):
                    return config
        return None
    
    def _check_rate_limit(self, client_ip: str, path: str, max_requests: int, window_seconds: int) -> bool:
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=window_seconds)
        
        self.requests[client_ip][path] = [
            req_time for req_time in self.requests[client_ip][path]
            if req_time > window_start
        ]
        
        if len(self.requests[client_ip][path]) >= max_requests:
            return False
        
        self.requests[client_ip][path].append(now)
        return True
