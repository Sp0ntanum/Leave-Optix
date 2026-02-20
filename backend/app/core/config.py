from pydantic_settings import BaseSettings
from pydantic import field_validator, HttpUrl
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "Workload360"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = False  # Secure default
    
    # CORS
    ALLOWED_ORIGINS: List[str]
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # Database
    DATABASE_URL: str
    
    # Security
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # Email (for notifications)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Workload Analysis
    WORKLOAD_THRESHOLD_HIGH: float = 0.8
    WORKLOAD_THRESHOLD_MEDIUM: float = 0.6
    
    # Leave Settings
    DEFAULT_LEAVE_BALANCE_DAYS: int = 20
    MAX_ADVANCE_BOOKING_DAYS: int = 365
    MIN_ADVANCE_NOTICE_DAYS: int = 7
    
    @field_validator('ALLOWED_ORIGINS')
    @classmethod
    def validate_origins(cls, v):
        if not v:
            raise ValueError("ALLOWED_ORIGINS cannot be empty")
        return v
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
