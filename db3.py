# Tests large number of users and reviews for album_id = 0

from app.db.database import Base, engine, SessionLocal
from app.models.album import Album
from app.models.rating import Rating
from app.models.user import User
from sqlalchemy import func

from utils.security import hash_password

# Drop all tables (wipes existing data)
Base.metadata.drop_all(bind=engine)

# Recreate tables with updated schema (including id field)
Base.metadata.create_all(bind=engine)
print("Tables dropped and recreated.")

sample_albums = [
    Album(id=1, title="OK Computer", artist="Radiohead", year=1997, cover_url="https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png"),
    Album(id=2, title="To Pimp a Butterfly", artist="Kendrick Lamar", year=2015, cover_url="https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png"),
    Album(id=3, title="Aeroplane Over the Sea", artist="Neutral Milk Hotel", year=1998, cover_url="https://upload.wikimedia.org/wikipedia/en/8/83/In_the_aeroplane_over_the_sea_album_cover_copy.jpg"),
    Album(id=4, title="Rumours", artist="Fleetwood Mac", year=1977, cover_url="https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"),
    Album(id=5, title="Blonde", artist="Frank Ocean", year=2016, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg")
]

def generate_test_users(n=1000):
    return [
        User(
            id=i + 1,
            username=f"test_user_{i + 1}",
            email=f"user{i + 1}@example.com",
            hashed_password=hash_password("password123")
        )
        for i in range(n)
    ]

def generate_test_ratings(n=1000):
    return [
        Rating(
            id=i + 1,
            user_id=i + 1,
            album_id=1,
            score=(i % 5) + 1,
            review=f"This is review #{i + 1}"
        )
        for i in range(n)
    ]

db = SessionLocal()
try:
    db.add_all(sample_albums)
    db.add_all(generate_test_users())
    db.add_all(generate_test_ratings())
    db.commit()
    print("Sample albums seeded with IDs.")

    for album in db.query(Album).all():
        avg = db.query(func.avg(Rating.score)).filter(Rating.album_id == album.id).scalar()
        album.average_score = round(avg, 2) if avg is not None else None
    db.commit()
    print("Backfilled average scores.")

finally:
    db.close()
