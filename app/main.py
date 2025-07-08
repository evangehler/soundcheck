from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db import database  # adjust if your structure is different
from app.models import album  # make sure this matches your model path
from typing import List
from app.models.album_response import AlbumResponse  # see note below
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
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/")
def serve_react_app():
    return FileResponse("frontend/dist/index.html")

@app.get("/api/albums", response_model=List[AlbumResponse])
def get_albums(db: Session = Depends(database.SessionLocal)):
    return db.query(album.Album).all()
