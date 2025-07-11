from pydantic import BaseModel

class AlbumResponse(BaseModel):
    id: int
    title: str
    artist: str
    average_score: float | None = None
    year: int | None = None
    cover_url: str | None = None

    model_config = {
        "from_attributes": True
    }