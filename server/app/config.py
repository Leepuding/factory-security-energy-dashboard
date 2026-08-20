from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="server/.env", extra="ignore")

    database_url: str = ""
    upload_dir: Path = Path("server/data/uploads")
    report_dir: Path = Path("server/data/reports")
    max_file_size_bytes: int = 20 * 1024 * 1024
    max_upload_files: int = 5
    daily_parse_limit: int = 20
    max_knowledge_documents: int = 30
    max_pdf_pages: int = 200
    max_excel_rows: int = 50_000
    parse_concurrency: int = 2
    ai_provider: str = "mock"
    ai_api_base: str = ""
    ai_api_key: str = ""
    ai_model: str = ""
    ai_timeout_seconds: int = 60
    ai_retry_count: int = 1
    cors_origins: str = "http://127.0.0.1:5174,http://localhost:5174"


@lru_cache
def get_settings() -> Settings:
    return Settings()
