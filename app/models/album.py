from sqlalchemy import Column, Integer, String, DateTime, Float, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Ensure auto-incrementing IDs
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    year = Column(Integer)
    genre = Column(String)  # New genre field
    average_score = Column(Float, nullable=True)
    cover_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ratings = relationship("Rating", back_populates="album")
