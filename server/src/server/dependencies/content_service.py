"""
Dependency injection for content-related services.

Provides factory functions for creating service instances with proper
dependency resolution following FastAPI patterns.
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.server.dao.content_dao import ContentDAO
from src.server.dao.space_dao import SpaceDAO
from src.server.database.database import get_db
from src.server.services.content.content_service import ContentService


def get_content_service(db: AsyncSession = Depends(get_db)) -> ContentService:
    """
    Factory function to create ContentService instance.

    Dependency chain: get_db() → ContentDAO(db) + SpaceDAO(db) → ContentService(dao, space_dao)

    Args:
        db: AsyncSession instance from database dependency

    Returns:
        ContentService: Configured service instance ready for use
    """
    content_dao = ContentDAO(db)
    space_dao = SpaceDAO(db)
    return ContentService(content_dao, space_dao)
