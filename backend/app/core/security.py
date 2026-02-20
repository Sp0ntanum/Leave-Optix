from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase_client)
) -> dict:
    """
    Validate JWT token and return current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        
        if not user:
            raise credentials_exception
            
        return user.user
        
    except JWTError as e:
        logger.error(f"JWT validation error: {e}")
        raise credentials_exception
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise credentials_exception


async def get_current_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Get current active user (additional checks can be added)"""
    # Add additional checks like email verification, account status, etc.
    return current_user


def require_role(required_role: str):
    """
    Dependency to check if user has required role
    Usage: dependencies=[Depends(require_role("manager"))]
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("user_metadata", {}).get("role", "employee")
        
        if user_role != required_role and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {required_role}"
            )
        return current_user
    
    return role_checker
