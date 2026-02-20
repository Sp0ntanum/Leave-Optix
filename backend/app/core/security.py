from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from supabase import Client
from app.core.database import get_db
from enum import Enum
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Client = Depends(get_db)
) -> dict:
    """Validate JWT token and return current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        user = db.auth.get_user(token)
        
        if not user or not user.user:
            raise credentials_exception
            
        return user.user
        
    except JWTError:
        logger.warning("JWT validation failed")
        raise credentials_exception
    except Exception:
        logger.warning("Authentication failed")
        raise credentials_exception


def get_current_active_user(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Get current active user"""
    return current_user


def require_role(*allowed_roles: UserRole):
    """
    Dependency to check if user has required role
    Usage: dependencies=[Depends(require_role(UserRole.MANAGER))]
    """
    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("user_metadata", {}).get("role", "employee")
        
        try:
            role_enum = UserRole(user_role)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid user role"
            )
        
        if role_enum not in allowed_roles and role_enum != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    
    return role_checker
