"""Optional Redis caching layer for performance optimization"""
from typing import Optional, Any
import json
import logging

logger = logging.getLogger(__name__)

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logger.warning("Redis not installed. Caching disabled.")


class CacheService:
    """Simple Redis-based caching service"""
    
    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0):
        self.enabled = REDIS_AVAILABLE
        self.client = None
        
        if self.enabled:
            try:
                self.client = redis.Redis(
                    host=host,
                    port=port,
                    db=db,
                    decode_responses=True,
                    socket_connect_timeout=2
                )
                self.client.ping()
                logger.info("Redis cache connected")
            except Exception as e:
                logger.warning(f"Redis connection failed: {e}. Caching disabled.")
                self.enabled = False
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.enabled:
            return None
        
        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            logger.error(f"Cache get error: {e}")
        
        return None
    
    def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Set value in cache with TTL (seconds)"""
        if not self.enabled:
            return False
        
        try:
            self.client.setex(key, ttl, json.dumps(value, default=str))
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.enabled:
            return False
        
        try:
            self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False
    
    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching pattern"""
        if not self.enabled:
            return 0
        
        try:
            keys = self.client.keys(pattern)
            if keys:
                return self.client.delete(*keys)
        except Exception as e:
            logger.error(f"Cache invalidate error: {e}")
        
        return 0


# Singleton instance
_cache_instance: Optional[CacheService] = None


def get_cache() -> CacheService:
    """Get cache service instance"""
    global _cache_instance
    
    if _cache_instance is None:
        from app.core.config import settings
        _cache_instance = CacheService(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB
        )
    
    return _cache_instance


def cache_key(*args) -> str:
    """Generate cache key from arguments"""
    return ':'.join(str(arg) for arg in args)
