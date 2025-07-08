from pydantic import BaseModel

class AlbumResponse(BaseModel):
    id: int
    title: str
    artist: str
    year: int | None = None
    cover_url: str | None = None

    model_config = {
        "from_attributes": True
    }