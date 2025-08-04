from pydantic import BaseModel
from typing import List
from app.schemas.album import AlbumResponse

class ListItemResponse(BaseModel):
    id: int
    album_id: int
    album: AlbumResponse
    class Config:
        orm_mode = True

class UserListResponse(BaseModel):
    id: int
    name: str
    items: List[ListItemResponse]
    class Config:
        orm_mode = True

class CreateList(BaseModel):
    name: str

class AddAlbumToList(BaseModel):
    album_id: int

class CompactList(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True
