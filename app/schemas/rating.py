# app/schemas/rating.py
# Schemas for Rating and Review-related data structures

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RatingInput(BaseModel):
    score: float
    review: Optional[str]

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    score: float
    review: str
    created_at: datetime

    class Config:
        orm_mode = True

class RecentReviewResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    score: float
    review: str
    created_at: datetime
    album_id: int
    album_title: str
    album_cover_url: str

    class Config:
        orm_mode = True