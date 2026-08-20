from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    pass


def build_session_factory() -> sessionmaker[Session] | None:
    settings = get_settings()
    if not settings.database_url:
        return None
    if settings.database_url.startswith("sqlite"):
        engine = create_engine(settings.database_url, connect_args={"check_same_thread": False}, future=True)
        return sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
    engine = create_engine(
        settings.database_url,
        pool_size=5,
        max_overflow=5,
        pool_pre_ping=True,
        future=True,
    )
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


SessionLocal = build_session_factory()


def initialize_database() -> None:
    if SessionLocal is None:
        return
    from . import models  # noqa: F401 - registers ORM models before metadata creation

    Base.metadata.create_all(SessionLocal.kw["bind"])


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured")
    with SessionLocal() as session:
        yield session
