from fastapi import FastAPI, Depends,HTTPException,APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.db import database
from app.models import album 
from app.models.rating import Rating
from app.models.user import User
from pydantic import BaseModel
from typing import List
from app.models.album_response import AlbumResponse  # see note below
from app.db.get_db import get_db
from typing import Optional
import os

app = FastAPI()
router = APIRouter()

# Allow Vite frontend to talk to FastAPI backend in dev mode
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static assets for production
app.mount("/assets", StaticFiles(directory="frontend/src/assets"), name="assets")

# Get Database
# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


app.include_router(router)
@app.get("/")
def serve_react_app():
    return FileResponse("frontend/dist/index.html")

@app.get("/api/albums", response_model=List[AlbumResponse])
def get_albums(db: Session = Depends(get_db)):
    return db.query(album.Album).all()

@app.get("/api/albums/{album_id}", response_model=AlbumResponse)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album_obj = db.query(album.Album).filter(album.Album.id == album_id).first()
    if not album_obj:
        return {"error": "Album not found"}
    return album_obj

class ReviewResponse(BaseModel):
    id: int
    user_name: str
    score: int
    review: str

    class Config:
        orm_mode = True


@app.get("/api/albums/{album_id}/reviews", response_model=List[ReviewResponse])
def get_album_reviews(album_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Rating)
        .join(User)
        .filter(
            Rating.album_id == album_id,
            Rating.review != None,
            Rating.review != "",
            User.id == Rating.user_id  # ensure join worked
        )
        .all()
    )
    for rev in results:
        print (rev.user.username)
    return [
    ReviewResponse(
        id=r.id,
        user_name=r.user.username,  # fix here
        score=r.score,
        review=r.review
    )
    for r in results
    ]

class RegUser(BaseModel):
    username: str
    password: str
    email: str

@router.post("/signup", response_model=RegUser)
def resgistration(data: RegUser,db: Session=Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=data.username,hashed_password=data.password,email=data.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username":data.username ,"password":data.password, "email":data.email}

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.hashed_password != data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful", "username": user.username, "user_id": user.id}
app.include_router(router)
