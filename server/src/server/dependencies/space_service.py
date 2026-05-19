"""
Dependency injection for space-related services.

Provides factory functions for creating service instances with proper
dependency resolution following FastAPI patterns.
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.server.dao.space_dao import SpaceDAO
from src.server.database.database import get_db
from src.server.services.space.space_service import SpaceService


def get_space_service(db: AsyncSession = Depends(get_db)) -> SpaceService:
    """
    Factory function to create SpaceService instance.

    Dependency chain: get_db() → SpaceDAO(db) → SpaceService(dao)

    Args:
        db: AsyncSession instance from database dependency

    Returns:
        SpaceService: Configured service instance ready for use
    """
    dao = SpaceDAO(db)
    return SpaceService(dao)
