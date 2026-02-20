from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import SupabaseClient
from app.middleware import (
    RateLimitMiddleware,
    error_handler_middleware,
    RequestIDMiddleware,
    LoggingMiddleware,
    SecurityHeadersMiddleware
)
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Workload360 API...")
    try:
        db = SupabaseClient.get_client()
        logger.info("✓ Database connected")
    except Exception as e:
        logger.error("✗ Database connection failed")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Workload360 API...")
    logger.info("Shutdown complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Workload360 - Intelligent Leave & Workforce Optimization System",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Security: Trusted Host Middleware (prevent host header attacks)
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.workload360.com", "workload360.com"]
    )

# Security: CORS (environment-driven)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"]
)

# Security: Rate Limiting
app.add_middleware(RateLimitMiddleware)

# Security: Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Logging: Request ID
app.add_middleware(RequestIDMiddleware)

# Logging: Request/Response Logging
app.add_middleware(LoggingMiddleware)

# Error Handling: Structured Errors
app.middleware("http")(error_handler_middleware)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "Welcome to Workload360 API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }


@app.get("/health")
def health_check():
    health_status = {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "checks": {}
    }
    
    # Check database
    try:
        db = SupabaseClient.get_client()
        db.table('users').select('id').limit(1).execute()
        health_status["checks"]["database"] = "ok"
    except Exception:
        health_status["checks"]["database"] = "error"
        health_status["status"] = "unhealthy"
    
    return health_status
