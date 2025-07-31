from pydantic import BaseModel, HttpUrl
from typing import Optional

class AlbumAdd(BaseModel):
    title: str
    artist: str
    year: Optional[int] = None
    cover: Optional[HttpUrl] = None