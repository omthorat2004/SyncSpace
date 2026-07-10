from pydantic import BaseModel


class SearchResult(BaseModel):
    result_type: str  # "space" | "content"
    id: int
    space_id: int
    title: str
    snippet: str | None = None
    url: str | None = None
    content_type: str | None = None
