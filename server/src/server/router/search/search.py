from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.server.dao.search_dao import SearchDAO
from src.server.database.database import get_db
from src.server.dependencies.auth import get_current_user
from src.server.schemas.search import SearchResult
from src.server.schemas.user import User
from src.server.services.search.search_service import SearchService

router = APIRouter(prefix="/search", tags=["search"])


def get_search_service(db: AsyncSession = Depends(get_db)) -> SearchService:
    return SearchService(SearchDAO(db))


@router.get("", response_model=list[SearchResult], status_code=status.HTTP_200_OK, summary="Search spaces and content")
async def search(
    current_user: Annotated[User, Depends(get_current_user)],
    search_service: Annotated[SearchService, Depends(get_search_service)],
    q: str = Query(default=""),
    type: str | None = Query(default=None, description="Filter content results by type (note, link, code)"),
):
    return await search_service.search(user_id=current_user.id, query=q, content_type=type)
