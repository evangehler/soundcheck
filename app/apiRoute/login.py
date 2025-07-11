from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.user import User
from sqlalchemy.orm import Session
from app.db.get_db import get_db
router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.hashed_password != data.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful"}