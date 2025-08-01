from fastapi import FastAPI, Depends,HTTPException,APIRouter,Header,status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.db import database
from app.models import album 
from app.models.rating import Rating
from app.utils.hash import hash_password, verify_password
from app.utils.security import create_token, SECRET_KEY, ALGORITHM
from app.models.user import User
from pydantic import BaseModel
from typing import List
from app.models.album_response import AlbumResponse  # see note below
from app.db.get_db import get_db
from app.utils.albumSchema import AlbumAdd
from typing import Optional
import os
from models import Album

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


@app.on_event("startup")
def create_admin():
    db: Session = next(get_db())
    admin_username = "admin"
    admin_email = "admin@admin.com"
    plain_password = "admin123321"

    existing = db.query(User).filter(User.username == admin_username).first()
    if not existing:
        hashed = hash_password(plain_password)
        admin_user = User(
            username=admin_username,
            email=admin_email,
            hashed_password=hashed,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("Admin created")
    else:
        print("Admin already exists")
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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.post("/signup", response_model=RegUser)
def registration(data: RegUser,db: Session=Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = hash_password(data.password)
    new_user = User(username=data.username,hashed_password=hashed_password,email=data.email,is_admin=False)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username":data.username ,"password":hashed_password, "email":data.email}

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token({"sub":str(user.id)})
    return {"access_token":token, "message": "Login successful", "username": user.username, "user_id": user.id}


class UserStuff(BaseModel):
    id: int
    username: str
    email: str
    class Config:
        orm_mode = True
@app.get("/api/users", response_model=List[UserStuff])
def get_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    users = db.query(User).all()
    return users
@app.delete("/api/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_admin:
        raise HTTPException(status_code=403, detail="Admin can't delete Admin")

    db.delete(user)
    db.commit()
    return {"message": f"User {user_id} deleted successfully"}

@app.post("/api/albums")
def create_album(album: AlbumAdd,current_user: User = Depends(get_admin_user),db: Session = Depends(get_db)):
    album = Album(**album.dict())
    db.add(album)
    db.commit()
    db.refresh(album)
    return album
app.include_router(router)