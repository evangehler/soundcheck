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
