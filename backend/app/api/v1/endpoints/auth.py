from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(
    signup_data: SignupRequest,
    db: Client = Depends(get_db)
):
    """Register a new user"""
    try:
        response = db.auth.sign_up({
            "email": signup_data.email,
            "password": signup_data.password,
            "options": {
                "data": {
                    "full_name": signup_data.full_name,
                    "role": signup_data.role or "employee"
                }
            }
        })
        
        if response.user:
            return UserResponse(
                id=response.user.id,
                email=response.user.email,
                full_name=signup_data.full_name,
                role=signup_data.role or "employee"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user account"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error for email: {signup_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to create account"
        )


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Client = Depends(get_db)
):
    """Authenticate user and return tokens"""
    # Demo account bypass
    if login_data.email == "manager@demo.com" and login_data.password == "demo123":
        return TokenResponse(
            access_token="demo_token_manager_12345",
            refresh_token="demo_refresh_token",
            token_type="bearer",
            expires_in=3600
        )
    
    # Skip Supabase if not configured
    if not db:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not configured. Use demo account."
        )
    
    try:
        response = db.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if response.session:
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                token_type="bearer",
                expires_in=response.session.expires_in
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    except HTTPException:
        raise
    except Exception:
        logger.warning(f"Login attempt failed for email: {login_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    refresh_token: str,
    db: Client = Depends(get_db)
):
    """Refresh access token"""
    try:
        response = db.auth.refresh_session(refresh_token)
        
        if response.session:
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                token_type="bearer",
                expires_in=response.session.expires_in
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
    except HTTPException:
        raise
    except Exception:
        logger.warning("Token refresh failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.post("/logout")
def logout(
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Logout current user"""
    try:
        db.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception:
        logger.warning(f"Logout failed for user: {current_user.get('id')}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Logout failed"
        )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    """Get current user information"""
    # Demo account bypass
    if current_user.get("email") == "demo" or current_user.get("id") == "demo":
        return UserResponse(
            id="demo_user_id",
            email="manager@demo.com",
            full_name="Demo Manager",
            role="manager"
        )
    
    user_metadata = current_user.get("user_metadata", {})
    
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=user_metadata.get("full_name", ""),
        role=user_metadata.get("role", "employee")
    )
