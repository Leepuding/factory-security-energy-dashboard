from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from .config import get_settings
from .db import SessionLocal, get_db
from .models import Document, ParseTask
from .schemas import ChatRequest, ChatResponse, DailyUsageResponse, DocumentResponse, ModelConfigRequest, ModelConfigResponse, ParseTaskResponse, UploadResponse
from .services.admin import ConfigurationError, DailyLimitExceeded, config_payload, daily_usage, normalize_model_config, reserve_daily_usage, save_model_config, test_model_config
from .services.chat import answer_question
from .services.ingestion import create_document_from_stage, delete_document, reparse_document, stage_upload, submit_parse
from .services.parsing import ParseError

router = APIRouter(prefix="/api", tags=["documents"])


def require_database() -> None:
    if SessionLocal is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="数据库尚未配置")


def to_document_response(document: Document) -> DocumentResponse:
    return DocumentResponse(
        id=document.id, original_name=document.original_name, file_type=document.file_type, file_size=document.file_size,
        sha256=document.sha256, status=document.status, error_message=document.error_message,
        created_at=document.created_at, parsed_at=document.parsed_at,
    )


@router.get("/documents", response_model=list[DocumentResponse])
def list_documents(_ready: None = Depends(require_database), db: Session = Depends(get_db)) -> list[DocumentResponse]:
    return [to_document_response(item) for item in db.query(Document).order_by(Document.created_at.desc()).all()]


@router.post("/documents", response_model=UploadResponse, status_code=status.HTTP_202_ACCEPTED)
def upload_documents(files: list[UploadFile] = File(...), _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> UploadResponse:
    settings = get_settings()
    if not files or len(files) > settings.max_upload_files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"单次最多上传 {settings.max_upload_files} 个文件")
    staged = []
    try:
        for upload in files:
            try:
                staged.append(stage_upload(upload, settings))
            finally:
                upload.file.close()
    except ParseError as error:
        for item in staged:
            item.path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error

    existing = {item.sha256: item for item in db.query(Document).filter(Document.sha256.in_([item.checksum for item in staged])).all()}
    documents: list[Document] = []
    duplicates: list[str] = []
    new_documents: list[Document] = []
    new_paths = []
    for item in staged:
        duplicate = existing.get(item.checksum)
        if duplicate:
            item.path.unlink(missing_ok=True)
            documents.append(duplicate)
            duplicates.append(duplicate.id)
            continue
        document = create_document_from_stage(db, item)
        existing[item.checksum] = document
        documents.append(document)
        new_documents.append(document)
        new_paths.append(item.path)
    if db.query(Document).count() + len(new_documents) > settings.max_knowledge_documents:
        db.rollback()
        for path in new_paths:
            path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"临时知识库最多保存 {settings.max_knowledge_documents} 个文档")
    try:
        reserve_daily_usage(db, settings, len(new_documents))
        db.commit()
    except DailyLimitExceeded as error:
        db.rollback()
        for path in new_paths:
            path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(error), headers={"X-Daily-Remaining": str(error.remaining)}) from error
    except Exception:
        db.rollback()
        for path in new_paths:
            path.unlink(missing_ok=True)
        raise

    queued: list[tuple[str, str]] = []
    for document in new_documents:
        db.refresh(document)
        queued.append((document.id, document.tasks[-1].id))
    for document_id, task_id in queued:
        submit_parse(document_id, task_id, settings)
    return UploadResponse(documents=[to_document_response(item) for item in documents], duplicate_document_ids=duplicates)


@router.get("/usage/daily", response_model=DailyUsageResponse)
def get_daily_usage(_ready: None = Depends(require_database), db: Session = Depends(get_db)) -> dict:
    result = daily_usage(db, get_settings())
    result["date"] = result["date"].isoformat()
    return result


@router.get("/admin/model-config", response_model=ModelConfigResponse)
def get_model_config(_ready: None = Depends(require_database), db: Session = Depends(get_db)) -> dict:
    return config_payload(db, get_settings())


@router.post("/admin/model-config/test")
def test_config(request: ModelConfigRequest, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> dict[str, str]:
    try:
        config = normalize_model_config(db, get_settings(), request.provider, request.model, request.api_base, request.api_key)
        test_model_config(config, get_settings())
    except Exception as error:
        detail = str(error) or "模型连接测试失败"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail) from error
    return {"status": "ok", "message": "模型连接测试成功"}


@router.put("/admin/model-config", response_model=ModelConfigResponse)
def update_model_config(request: ModelConfigRequest, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> dict:
    try:
        config = normalize_model_config(db, get_settings(), request.provider, request.model, request.api_base, request.api_key)
        save_model_config(db, config)
    except ConfigurationError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    return config_payload(db, get_settings())


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_document(document_id: str, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> None:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文档不存在")
    delete_document(db, document)


@router.post("/documents/{document_id}/reparse", response_model=ParseTaskResponse, status_code=status.HTTP_202_ACCEPTED)
def request_reparse(document_id: str, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> ParseTaskResponse:
    document = db.get(Document, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="文档不存在")
    task = reparse_document(db, document, get_settings())
    return ParseTaskResponse.model_validate(task, from_attributes=True)


@router.get("/parse-tasks/{task_id}", response_model=ParseTaskResponse)
def get_parse_task(task_id: str, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> ParseTaskResponse:
    task = db.get(ParseTask, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="解析任务不存在")
    return ParseTaskResponse.model_validate(task, from_attributes=True)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, _ready: None = Depends(require_database), db: Session = Depends(get_db)) -> ChatResponse:
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="问题不能为空")
    return answer_question(db, question, request.document_id)
