# create_tables.py

from app.db.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.album import Album
from app.models.rating import Rating

# Step 1: Create tables
Base.metadata.create_all(bind=engine)
print("✅ Tables created.")

# Step 2: Seed sample albums
sample_albums = [
    Album(title="OK Computer", artist="Radiohead", year=1997, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"),
    Album(title="To Pimp a Butterfly", artist="Kendrick Lamar", year=2015, cover_url="https://upload.wikimedia.org/wikipedia/en/9/9e/To_Pimp_a_Butterfly_cover.jpeg"),
    Album(title="In the Aeroplane Over the Sea", artist="Neutral Milk Hotel", year=1998, cover_url="https://upload.wikimedia.org/wikipedia/en/2/2e/NMH-Aeroplane.jpg"),
    Album(title="Rumours", artist="Fleetwood Mac", year=1977, cover_url="https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"),
    Album(title="Blonde", artist="Frank Ocean", year=2016, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg")
]

db = SessionLocal()

try:
    existing = db.query(Album).first()
    if not existing:
        db.add_all(sample_albums)
        db.commit()
        print("✅ Sample albums seeded.")
    else:
        print("ℹ️  Albums already exist — skipping seeding.")
finally:
    db.close()
