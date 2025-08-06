# app/models/list_item.py
# ListItem model definition

from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base
from sqlalchemy.orm import relationship

class ListItem(Base):
    __tablename__ = "list_items"

    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey("lists.id"), nullable=False)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=False)

    list = relationship("List", back_populates="items")
    album = relationship("Album")
