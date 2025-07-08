# seed_albums.py or create_tables.py

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.rating import Rating  # ← MUST import this before Album
from app.models.album import Album    # ← Comes after because it depends on Rating

# Create tables (if you haven't already)
Base.metadata.create_all(bind=engine)

# Seed albums
sample_albums = [
    Album(title="OK Computer", artist="Radiohead", year=1997, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"),
    Album(title="To Pimp a Butterfly", artist="Kendrick Lamar", year=2015, cover_url="https://upload.wikimedia.org/wikipedia/en/9/9e/To_Pimp_a_Butterfly_cover.jpeg"),
    Album(title="In the Aeroplane Over the Sea", artist="Neutral Milk Hotel", year=1998, cover_url="https://upload.wikimedia.org/wikipedia/en/2/2e/NMH-Aeroplane.jpg"),
    Album(title="Rumours", artist="Fleetwood Mac", year=1977, cover_url="https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"),
    Album(title="Blonde", artist="Frank Ocean", year=2016, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg")
]

db = SessionLocal()

try:
    if not db.query(Album).first():
        db.add_all(sample_albums)
        db.commit()
        print("Sample albums seeded.")
    else:
        print("Albums already exist — skipping.")
finally:
    db.close()
