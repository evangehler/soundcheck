from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from models.user import User
from sqlalchemy.orm import Session
from app.db.get_db import get_db
from typing import Optional
router = APIRouter()

class RegUser(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

@router.post("/register", response_model=RegUser)
def resgistration(data: RegUser,db: Session=Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=data.username,hashed_password=data.password,email=data.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"username":data.username ,"password":data.password}