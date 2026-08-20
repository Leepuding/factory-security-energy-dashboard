from datetime import datetime

from pydantic import BaseModel

from .models import ParseStatus


class DocumentResponse(BaseModel):
    id: str
    original_name: str
    file_type: str
    file_size: int
    sha256: str
    status: ParseStatus
    error_message: str | None
    created_at: datetime
    parsed_at: datetime | None


class UploadResponse(BaseModel):
    documents: list[DocumentResponse]
    duplicate_document_ids: list[str]


class ParseTaskResponse(BaseModel):
    id: str
    document_id: str
    status: ParseStatus
    progress: int
    message: str
    created_at: datetime
    started_at: datetime | None
    finished_at: datetime | None


class ChatRequest(BaseModel):
    question: str
    document_id: str | None = None


class ChatSection(BaseModel):
    title: str
    content: str


class CitationResponse(BaseModel):
    document_name: str
    location: str
    content: str


class MetricResponse(BaseModel):
    name: str
    value: str | float | int
    unit: str = ""
    source: str = ""


class ChartSeries(BaseModel):
    name: str
    data: list[float]


class ChartResponse(BaseModel):
    type: str
    title: str
    x_axis: list[str]
    series: list[ChartSeries]
    unit: str = ""
    conclusion: str = ""
    source: str = ""


class RiskResponse(BaseModel):
    level: str
    title: str
    description: str
    source: str = ""


class DecisionResponse(BaseModel):
    priority: str
    title: str
    description: str
    basis: str = ""
    source: str = ""


class ChatResponse(BaseModel):
    title: str
    summary: str
    sections: list[ChatSection]
    citations: list[CitationResponse]
    metrics: list[MetricResponse] = []
    charts: list[ChartResponse] = []
    risks: list[RiskResponse] = []
    decisions: list[DecisionResponse] = []


class ModelConfigRequest(BaseModel):
    provider: str
    model: str
    api_base: str = ""
    api_key: str | None = None


class ModelConfigResponse(BaseModel):
    provider: str
    model: str
    api_base: str
    api_key_configured: bool
    api_key_mask: str


class DailyUsageResponse(BaseModel):
    date: str
    used: int
    limit: int
    remaining: int
