import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

# Safely encode the special character '@' from your 'Ashok@2002' password string
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    raw_url = DATABASE_URL.replace("postgresql://", "", 1)
    if "@" in raw_url:
        auth_part, host_part = raw_url.rsplit("@", 1)
        if ":" in auth_part:
            username, password = auth_part.split(":", 1)
            encoded_password = urllib.parse.quote_plus(password)
            DATABASE_URL = f"postgresql+psycopg://{username}:{encoded_password}@{host_part}"

engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 5})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()