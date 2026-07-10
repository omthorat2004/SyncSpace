from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.server.models.space_member_model import SpaceMember
from src.server.models.space_models import Content, Space


class SearchDAO:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _accessible_space_ids(self, user_id: int) -> set[int]:
        owned = await self.db.execute(select(Space.id).where(Space.owner_id == user_id))
        shared = await self.db.execute(select(SpaceMember.space_id).where(SpaceMember.user_id == user_id))
        return set(owned.scalars().all()) | set(shared.scalars().all())

    async def search(
        self,
        user_id: int,
        query: str,
        content_type: str | None = None,
        limit: int = 20,
    ) -> list[dict]:
        space_ids = await self._accessible_space_ids(user_id)
        if not space_ids:
            return []

        like = f"%{query}%"
        results: list[dict] = []

        if content_type is None:
            space_result = await self.db.execute(
                select(Space)
                .where(Space.id.in_(space_ids), Space.name.ilike(like))
                .order_by(Space.updated_at.desc())
                .limit(limit)
            )
            for space in space_result.scalars().all():
                results.append(
                    {
                        "result_type": "space",
                        "id": space.id,
                        "space_id": space.id,
                        "title": space.name,
                        "snippet": space.description,
                        "url": None,
                        "content_type": None,
                    }
                )

        content_query = select(Content).where(
            Content.space_id.in_(space_ids),
            or_(
                Content.title.ilike(like),
                Content.content.ilike(like),
                Content.url.ilike(like),
            ),
        )
        if content_type:
            content_query = content_query.where(Content.type == content_type)

        content_result = await self.db.execute(
            content_query.order_by(Content.created_at.desc()).limit(limit)
        )
        for content in content_result.scalars().all():
            snippet = (content.content[:140] + "…") if content.content and len(content.content) > 140 else content.content
            results.append(
                {
                    "result_type": "content",
                    "id": content.id,
                    "space_id": content.space_id,
                    "title": content.title,
                    "snippet": snippet,
                    "url": content.url,
                    "content_type": content.type.value if hasattr(content.type, "value") else content.type,
                }
            )

        return results[:limit]
