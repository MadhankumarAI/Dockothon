import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite file path
DATABASE_URL = "sqlite:///./app.db"  # Relative path
# DATABASE_URL = "sqlite:////absolute/path/to/app.db"  # Absolute path if you prefer

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite + SQLAlchemy
)

# Session and Base
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("SQLite database and tables created successfully!")
