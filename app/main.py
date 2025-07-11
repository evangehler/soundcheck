from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db import database
from app.models import album 
from typing import List
from app.models.album_response import AlbumResponse  # see note below
from app.apiRoute.login import router as login_router
from app.db.get_db import get_db
from app.apiRoute.register import router as register_router
import os

app = FastAPI()

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



app.include_router(login_router)
app.include_router(register_router)
@app.get("/")
def serve_react_app():
    return FileResponse("frontend/dist/index.html")

@app.get("/api/albums", response_model=List[AlbumResponse])
def get_albums(db: Session = Depends(get_db)):
    return db.query(album.Album).all()

#IM DEFINING MORE COMPLICATED ROUTERS IN THE apiRoute FOLDER TO
#KEEP EVERYTHING EASIER TO READ AND EDIT