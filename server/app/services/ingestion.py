import hashlib
import shutil
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy import delete
from sqlalchemy.orm import Session

from ..config import Settings
from ..db import SessionLocal
from ..models import Document, DocumentChunk, ParseStatus, ParseTask
from .parsing import ParseError, detect_file_type, parse_document


parse_executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="document-parser")


@dataclass(frozen=True)
class StagedUpload:
    original_name: str
    path: Path
    file_type: str
    size: int
    checksum: str


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        while block := source.read(1024 * 1024):
            digest.update(block)
    return digest.hexdigest()


def store_upload(upload: UploadFile, settings: Settings) -> tuple[Path, str, int, str]:
    filename = upload.filename or "unnamed"
    file_type = detect_file_type(filename)
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid4().hex}.{file_type}"
    destination = settings.upload_dir / stored_name
    size = 0
    try:
        with destination.open("wb") as target:
            while block := upload.file.read(1024 * 1024):
                size += len(block)
                if size > settings.max_file_size_bytes:
                    raise ParseError("单文件不能超过 20MB")
                target.write(block)
        return destination, file_type, size, sha256_file(destination)
    except Exception:
        destination.unlink(missing_ok=True)
        raise


def stage_upload(upload: UploadFile, settings: Settings) -> StagedUpload:
    path, file_type, size, checksum = store_upload(upload, settings)
    return StagedUpload(upload.filename or "unnamed", path, file_type, size, checksum)


def create_document_from_stage(session: Session, staged: StagedUpload) -> Document:
    document = Document(
        id=str(uuid4()),
        original_name=staged.original_name,
        stored_name=staged.path.name,
        file_type=staged.file_type,
        file_size=staged.size,
        sha256=staged.checksum,
        storage_path=str(staged.path),
        status=ParseStatus.QUEUED,
    )
    task = ParseTask(id=str(uuid4()), document_id=document.id, status=ParseStatus.QUEUED, progress=0, message="等待解析")
    session.add_all([document, task])
    return document


def create_document_record(session: Session, upload: UploadFile, settings: Settings) -> tuple[Document, bool]:
    staged = stage_upload(upload, settings)
    duplicate = session.query(Document).filter(Document.sha256 == staged.checksum).one_or_none()
    if duplicate:
        staged.path.unlink(missing_ok=True)
        return duplicate, True
    document = create_document_from_stage(session, staged)
    session.commit()
    session.refresh(document)
    return document, False


def submit_parse(document_id: str, task_id: str, settings: Settings) -> None:
    parse_executor.submit(_parse_in_background, document_id, task_id, settings)


def _parse_in_background(document_id: str, task_id: str, settings: Settings) -> None:
    if SessionLocal is None:
        return
    with SessionLocal() as session:
        document = session.get(Document, document_id)
        task = session.get(ParseTask, task_id)
        if document is None or task is None:
            return
        document.status = ParseStatus.PARSING
        task.status = ParseStatus.PARSING
        task.progress = 5
        task.message = "正在准备解析"
        task.started_at = datetime.utcnow()
        session.commit()

        def update_progress(progress: int, message: str) -> None:
            task.progress = min(progress, 95)
            task.message = message
            session.commit()

        try:
            chunks = parse_document(Path(document.storage_path), document.file_type, settings, update_progress)
            if not chunks:
                raise ParseError("未提取到可检索文本")
            session.execute(delete(DocumentChunk).where(DocumentChunk.document_id == document.id))
            session.add_all([
                DocumentChunk(id=str(uuid4()), document_id=document.id, sequence=chunk.sequence, page_number=chunk.page_number,
                              sheet_name=chunk.sheet_name, row_start=chunk.row_start, row_end=chunk.row_end,
                              char_start=chunk.char_start, char_end=chunk.char_end, content=chunk.content)
                for chunk in chunks
            ])
            document.status = ParseStatus.SUCCESS
            document.error_message = None
            document.parsed_at = datetime.utcnow()
            task.status = ParseStatus.SUCCESS
            task.progress = 100
            task.message = f"解析完成，共 {len(chunks)} 个片段"
            task.finished_at = datetime.utcnow()
            session.commit()
        except Exception as error:
            document.status = ParseStatus.FAILED
            document.error_message = str(error)[:4000]
            task.status = ParseStatus.FAILED
            task.message = "解析失败"
            task.finished_at = datetime.utcnow()
            session.commit()


def reparse_document(session: Session, document: Document, settings: Settings) -> ParseTask:
    task = ParseTask(id=str(uuid4()), document_id=document.id, status=ParseStatus.QUEUED, progress=0, message="等待重新解析")
    document.status = ParseStatus.QUEUED
    document.error_message = None
    session.add(task)
    session.commit()
    submit_parse(document.id, task.id, settings)
    return task


def delete_document(session: Session, document: Document) -> None:
    path = Path(document.storage_path)
    session.delete(document)
    session.commit()
    path.unlink(missing_ok=True)
