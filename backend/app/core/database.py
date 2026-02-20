from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client singleton"""
        if cls._instance is None:
            try:
                cls._instance = create_client(
                    settings.SUPABASE_URL,
                    settings.SUPABASE_KEY
                )
                logger.info("Supabase client initialized")
            except Exception as e:
                logger.warning(f"Supabase not configured: {e}")
                cls._instance = None
        return cls._instance
    
    @classmethod
    def get_admin_client(cls) -> Client:
        """Get Supabase client with service role key for admin operations"""
        try:
            return create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
        except:
            return None


def get_db() -> Client:
    """Dependency for database access"""
    return SupabaseClient.get_client()
