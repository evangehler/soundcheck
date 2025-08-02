import json
from app.db.database import Base, engine, SessionLocal
from app.models.album import Album
from app.models.rating import Rating
from app.models.user import User
from sqlalchemy import func

# Drop and recreate tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Tables dropped and recreated.")

# Load scraped albums
with open("scraped_albums.json", "r", encoding="utf-8") as f:
    scraped_data = json.load(f)

# Convert JSON to Album instances
albums_to_add = [
    Album(
        title=item["title"],
        artist=item["artist"],
        year=item["year"],
        genre=item.get("genre"),  # if you've added genre to the model
        cover_url=item["cover_url"]
    )
    for item in scraped_data
]

# Commit to database
db = SessionLocal()
try:
    db.add_all(albums_to_add)
    db.commit()
    print(f"✅ Inserted {len(albums_to_add)} albums from scraped_albums.json")

    # Backfill average scores to None (explicitly)
    for album in db.query(Album).all():
        avg = db.query(func.avg(Rating.score)).filter(Rating.album_id == album.id).scalar()
        album.average_score = round(avg, 2) if avg is not None else None
    db.commit()
    print("✅ Backfilled average scores.")
finally:
    db.close()
