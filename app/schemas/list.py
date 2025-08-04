from pydantic import BaseModel
from typing import List

class ListItemResponse(BaseModel):
    id: int
    album_id: int
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
