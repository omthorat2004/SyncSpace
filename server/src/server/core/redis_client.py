"""
Redis client configuration and utilities.

Provides Redis connection management and caching utilities for the application.
"""

import json
import logging
from typing import Any, Generic, TypeVar

import redis.asyncio as redis
from src.server.core._settings import settings

logger = logging.getLogger(__name__)

T = TypeVar("T")


class RedisClient:
    """Redis client wrapper for async operations."""

    _instance: redis.Redis | None = None

    @classmethod
    async def get_client(cls) -> redis.Redis:
        """
        Get or create Redis client instance.

        Returns:
            redis.Redis: Redis client instance
        """
        if cls._instance is None:
            try:
                cls._instance = await redis.from_url(
                    settings.redis.rediscloud_url.unicode_string(),
                    encoding="utf8",
                    decode_responses=True,
                )
                # Test connection
                await cls._instance.ping()
                logger.info("Redis connection established")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}")
                raise

        return cls._instance

    @classmethod
    async def close(cls) -> None:
        """Close Redis connection."""
        if cls._instance:
            await cls._instance.close()
            cls._instance = None
            logger.info("Redis connection closed")


class CacheManager(Generic[T]):
    """Manager for Redis caching operations."""

    def __init__(self, ttl: int = 3600):
        """
        Initialize cache manager.

        Args:
            ttl: Time to live in seconds (default: 1 hour)
        """
        self.ttl = ttl

    async def get(self, key: str) -> T | None:
        """
        Get value from cache.

        Args:
            key: Cache key

        Returns:
            T | None: Cached value or None if not found
        """
        try:
            client = await RedisClient.get_client()
            value = await client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.warning(f"Cache get failed for key {key}: {e}")
            return None

    async def set(self, key: str, value: T, ttl: int | None = None) -> bool:
        """
        Set value in cache.

        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (uses default if not provided)

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            client = await RedisClient.get_client()
            await client.setex(
                key,
                ttl or self.ttl,
                json.dumps(value, default=str),
            )
            return True
        except Exception as e:
            logger.warning(f"Cache set failed for key {key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """
        Delete value from cache.

        Args:
            key: Cache key

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            client = await RedisClient.get_client()
            await client.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Cache delete failed for key {key}: {e}")
            return False

    async def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching a pattern.

        Args:
            pattern: Key pattern (e.g., "space:123:*")

        Returns:
            int: Number of keys deleted
        """
        try:
            client = await RedisClient.get_client()
            keys = await client.keys(pattern)
            if keys:
                return await client.delete(*keys)
            return 0
        except Exception as e:
            logger.warning(f"Cache delete pattern failed for pattern {pattern}: {e}")
            return 0

    async def exists(self, key: str) -> bool:
        """
        Check if key exists in cache.

        Args:
            key: Cache key

        Returns:
            bool: True if key exists, False otherwise
        """
        try:
            client = await RedisClient.get_client()
            return await client.exists(key) > 0
        except Exception as e:
            logger.warning(f"Cache exists check failed for key {key}: {e}")
            return False


# Cache key generators
def get_space_contents_cache_key(space_id: int) -> str:
    """Generate cache key for space contents."""
    return f"space:{space_id}:contents"


def get_content_cache_key(content_id: int) -> str:
    """Generate cache key for specific content."""
    return f"content:{content_id}"


def get_space_contents_by_type_cache_key(space_id: int, content_type: str) -> str:
    """Generate cache key for space contents by type."""
    return f"space:{space_id}:contents:type:{content_type}"


def get_space_stats_cache_key(space_id: int) -> str:
    """Generate cache key for space statistics."""
    return f"space:{space_id}:stats"
