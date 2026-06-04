import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Safely handle special characters in database passwords
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    # Strip prefix, handle user credentials escaping, then re-apply modern driver
    raw_url = DATABASE_URL.replace("postgresql://", "", 1)
    if "@" in raw_url:
        auth_part, host_part = raw_url.rsplit("@", 1)
        if ":" in auth_part:
            username, password = auth_part.split(":", 1)
            # URL-encode the password to escape special characters like '@'
            encoded_password = urllib.parse.quote_plus(password)
            DATABASE_URL = f"postgresql+psycopg://{username}:{encoded_password}@{host_part}"
        else:
            DATABASE_URL = f"postgresql+psycopg://{raw_url}"
    else:
        DATABASE_URL = f"postgresql+psycopg://{raw_url}"

# Engine with strict connection timeout parameters
engine = create_engine(
    DATABASE_URL,
    connect_args={"connect_timeout": 5}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()