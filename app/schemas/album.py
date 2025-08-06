# app/schemas/album.py
# Schemas for Album-related data structures

from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class AlbumResponse(BaseModel):
    id: int
    title: str
    artist: str
    year: Optional[int]
    genre: Optional[str]
    average_score: Optional[float]
    cover_url: Optional[str]
    created_at: Optional[datetime]
    class Config:
        from_attributes = True

class AlbumAdd(BaseModel):
    title: str
    artist: str
    year: Optional[int] = None
    cover: Optional[HttpUrl] = None