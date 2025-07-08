from pydantic import BaseModel
from datetime import datetime

class AlbumResponse(BaseModel):
    id: int
    title: str
    artist: str
    year: int | None = None
    cover_url: str | None = None
    created_at: datetime

    class Config:
        orm_mode = True
