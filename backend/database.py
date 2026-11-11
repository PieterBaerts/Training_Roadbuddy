import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# On Vercel the project directory is read-only; only /tmp is writable (and ephemeral).
_default_db = "sqlite:////tmp/carpool.db" if os.environ.get("VERCEL") else "sqlite:///./carpool.db"
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", _default_db)

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
