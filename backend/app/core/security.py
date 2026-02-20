from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


class UserRole(str, Enum):
    """User role enumeration"""
    EMPLOYEE = "employee"
    MANAGER = "manager"
    ADMIN = "admin"


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
        
        # Demo account bypass
        if token == "demo_token_manager_12345":
            return {
                "id": "demo",
                "email": "demo",
                "user_metadata": {
                    "full_name": "Demo Manager",
                    "role": "manager"
                }
            }
        
        # Skip Supabase if not configured
        if not supabase:
            raise credentials_exception
        
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


def require_role(required_role: UserRole):
    """
    Dependency to check if user has required role
    Usage: dependencies=[Depends(require_role(UserRole.MANAGER))]
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("user_metadata", {}).get("role", "employee")
        
        if user_role != required_role.value and user_role != UserRole.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {required_role.value}"
            )
        return current_user
    
    return role_checker
