#Tests large number of albums

from app.db.database import Base, engine, SessionLocal
from app.models.album import Album
from app.models.rating import Rating
from app.models.user import User
from sqlalchemy import func

# Drop all tables (wipes existing data)
Base.metadata.drop_all(bind=engine)

# Recreate tables with updated schema (including id field)
Base.metadata.create_all(bind=engine)
print("Tables dropped and recreated.")

def generate_test_albums(n=1000):
    return [
        Album(
            id=i + 1,
            title=f"Test Album #{i + 1}",
            artist=f"Test Artist #{i + 1}",
            year=1990,
            cover_url="https://evek.one/4432-large_default/test.jpg"
        )
        for i in range(n)
    ]

db = SessionLocal()
try:
    db.add_all(generate_test_albums())
    db.commit()
    print("Sample albums seeded with IDs.")
finally:
    db.close()
