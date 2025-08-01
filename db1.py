from app.db.database import Base, engine, SessionLocal
from app.models.album import Album
from app.models.rating import Rating
from app.models.user import User
from sqlalchemy import func
from app.utils.hash import hash_password

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
    Album(id=5, title="Blonde", artist="Frank Ocean", year=2016, cover_url="https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"),
    Album(id=6, title="Purple Rain", artist="Prince & The Revolution", year=1984, cover_url="https://upload.wikimedia.org/wikipedia/en/9/9c/Princepurplerain.jpg"),
    Album(id=7, title="Hysteria", artist="Def Leppard", year=1987, cover_url="https://upload.wikimedia.org/wikipedia/en/4/40/Def_Leppard_-_Hysteria_%28vinyl_version%29.jpg"),
    Album(id=8, title="Imaginal Disk", artist="Magdelena Bay", year=2024, cover_url="https://upload.wikimedia.org/wikipedia/en/4/4b/Magdalena_Bay_-_Imaginal_Disk.png"),
    Album(id=9, title="Tragic Kingdom", artist="No Doubt", year=1995,cover_url="https://upload.wikimedia.org/wikipedia/en/9/9d/No_Doubt_-_Tragic_Kingdom.png"),
    Album(id=10, title="The Dark Side of the Moon", artist="Pink Floyd", year=1973,cover_url="https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"),
    Album(id=11, title="Swimming", artist="Mac Miller", year=2018,cover_url="https://upload.wikimedia.org/wikipedia/en/5/5e/Mac_Miller_-_Swimming.png"),
    Album(id=12, title="Thriller", artist="Michael Jackson", year=1982,cover_url="https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"),

]

sample_users = [
    User(username="shanthony_mantano99", email="wifeleft70@hotmail.gov", hashed_password=hash_password("fantano420")),
    User(username="particlegardener", email="daplantman@proton.me", hashed_password=hash_password("jalapeno12")),
    User(username="paul_mcartney", email="notaclone@british.tea", hashed_password=hash_password("herethereand")),
    User(username="jessemoras", email="goofy@goober.me", hashed_password=hash_password("schwartzschwartzschwartz")),
]

sample_ratings = [
    Rating(user_id=1, album_id=1, score=1, review = "This is garbage"),
    Rating(user_id=2, album_id=1, score=5, review = "I clicked 5 on accident. This sucks"),
    Rating(user_id=3, album_id=1, score=2, review = "I only gave it a 2 in honor of Radiohead 2, the band that that someone should start so that I can forget about this insult to music"),
    Rating(user_id=4, album_id=1, score=4, review = "This was pretty good. Love the John Cage influence. Had it on mute though"),

    Rating(user_id=3, album_id=3, score=1, review = "This guy doesn't make any sense."),
    Rating(user_id=4, album_id=3, score=5, review = "This guy doesn't make any sense."),
]

db = SessionLocal()
try:
    db.add_all(sample_albums)
    db.add_all(sample_users)
    db.add_all(sample_ratings)
    db.commit()
    print("Sample albums seeded with IDs.")

    for album in db.query(Album).all():
        avg = db.query(func.avg(Rating.score)).filter(Rating.album_id == album.id).scalar()
        album.average_score = round(avg, 2) if avg is not None else None
    db.commit()
    print("Backfilled average scores.")

finally:
    db.close()
