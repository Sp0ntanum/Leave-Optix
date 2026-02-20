from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
from threading import Lock
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    _instance: Optional[Client] = None
    _admin_instance: Optional[Client] = None
    _lock = Lock()
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client singleton (thread-safe)"""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    try:
                        cls._instance = create_client(
                            settings.SUPABASE_URL,
                            settings.SUPABASE_KEY
                        )
                        logger.info("Supabase client initialized")
                    except Exception as e:
                        logger.error(f"Failed to initialize Supabase client")
                        raise
        return cls._instance
    
    @classmethod
    def get_admin_client(cls) -> Client:
        """Get Supabase client with service role key for admin operations (thread-safe)"""
        if cls._admin_instance is None:
            with cls._lock:
                if cls._admin_instance is None:
                    try:
                        cls._admin_instance = create_client(
                            settings.SUPABASE_URL,
                            settings.SUPABASE_SERVICE_KEY
                        )
                        logger.info("Supabase admin client initialized")
                    except Exception as e:
                        logger.error(f"Failed to initialize Supabase admin client")
                        raise
        return cls._admin_instance


def get_db() -> Client:
    """Dependency for database access"""
    return SupabaseClient.get_client()
