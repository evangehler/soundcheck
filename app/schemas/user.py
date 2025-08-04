from pydantic import BaseModel
from typing import List

class RegUser(BaseModel):
    username: str
    password: str
    email: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserStuff(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

class UserProfileReview(BaseModel):
    album_id: int  
    album_title: str
    score: float
    review: str

    class Config:
        orm_mode = True

class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    reviews: List[UserProfileReview]

    class Config:
        orm_mode = True
