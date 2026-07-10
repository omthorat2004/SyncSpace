from src.server.dao.search_dao import SearchDAO


class SearchService:
    def __init__(self, dao: SearchDAO):
        self.dao = dao

    async def search(self, user_id: int, query: str, content_type: str | None = None):
        query = query.strip()
        if len(query) < 2:
            return []
        return await self.dao.search(user_id=user_id, query=query, content_type=content_type)
