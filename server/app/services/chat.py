import re
from dataclasses import dataclass

from sqlalchemy.orm import Session, joinedload

from ..config import get_settings
from ..models import AIModelConfig, Document, DocumentChunk, ParseStatus
from ..schemas import (
    ChartResponse,
    ChartSeries,
    CitationResponse,
    ChatResponse,
    ChatSection,
    DecisionResponse,
    MetricResponse,
    RiskResponse,
)
from .ai import AIProviderError, ChatMessage, get_ai_provider, runtime_settings
from .retrieval import RetrievedChunk, retrieve_chunks
from .retrieval import tokenize

NO_EVIDENCE_MESSAGE = "未在当前上传的文档或知识库中找到足够依据。"


@dataclass(frozen=True)
class ChatContext:
    question: str
    sources: list[RetrievedChunk]


def answer_question(db: Session, question: str, document_id: str | None = None) -> ChatResponse:
    query = (
        db.query(DocumentChunk)
        .join(Document)
        .options(joinedload(DocumentChunk.document))
        .filter(Document.status == ParseStatus.SUCCESS)
        .order_by(Document.created_at.desc(), DocumentChunk.sequence.asc())
    )
    if document_id:
        query = query.filter(Document.id == document_id)
    sources = retrieve_chunks(question, query.all(), limit=6)
    if not sources:
        return ChatResponse(title="未找到依据", summary=NO_EVIDENCE_MESSAGE, sections=[], citations=[])

    context = ChatContext(question=question, sources=sources)
    try:
        result = _ask_provider(context, db)
    except AIProviderError as error:
        return ChatResponse(
            title="模型服务暂不可用",
            summary=f"已检索到相关资料，但模型调用失败：{error}",
            sections=[],
            citations=_citations(sources),
        )
    return _normalize_response(result, sources, question)


def _ask_provider(context: ChatContext, db: Session) -> dict:
    source_text = "\n\n".join(
        f"[{index + 1}] 文档：{item.chunk.document.original_name}；位置：{_location(item.chunk)}\n{item.chunk.content}"
        for index, item in enumerate(context.sources)
    )
    system_prompt = (
        "你是企业文档分析助手。只能根据提供的资料回答，不得编造数据。"
        f"如资料不足，summary 必须精确为“{NO_EVIDENCE_MESSAGE}”。"
        "必须返回 JSON 对象，字段为 title、summary、sections、metrics、charts、risks、decisions。"
        "metrics 项为 {name,value,unit,source}；charts 项为 {type,title,x_axis,series,unit,conclusion,source}，"
        "其中 type 只能是 line、bar、pie，series 为 [{name,data}]。只有资料中存在明确的分类和数值时才返回图表，"
        "图表数据必须逐项来自资料，不确定时返回空数组。metrics 的 value 必须能在资料原文中找到；"
        "如果资料中有表格，请按表头解释列含义，并优先返回用户询问的原始表格数值。"
        "不要输出 HTML、Markdown 或代码块。"
    )
    provider = get_ai_provider(runtime_settings(get_settings(), db.get(AIModelConfig, 1)))
    return _run_provider(provider, [ChatMessage("system", system_prompt), ChatMessage("user", f"问题：{context.question}\n\n资料：\n{source_text}")])


def _run_provider(provider, messages: list[ChatMessage]) -> dict:
    import asyncio

    return asyncio.run(provider.complete_json(messages))


def _normalize_response(data: dict, sources: list[RetrievedChunk], question: str) -> ChatResponse:
    title = str(data.get("title") or "文档分析结果")[:100]
    summary = str(data.get("summary") or NO_EVIDENCE_MESSAGE)[:4000]
    sections: list[ChatSection] = []
    for item in data.get("sections") or []:
        if not isinstance(item, dict):
            continue
        content = str(item.get("content") or "").strip()
        if content:
            sections.append(ChatSection(title=str(item.get("title") or "分析说明")[:100], content=content[:6000]))
    metrics: list[MetricResponse] = []
    evidence_text = _evidence_text(sources)
    for item in data.get("metrics") or []:
        if isinstance(item, dict) and item.get("name") and item.get("value") is not None and _supported_value(item["value"], evidence_text):
            metrics.append(MetricResponse(name=str(item["name"])[:50], value=item["value"], unit=str(item.get("unit") or "")[:20], source=_source_label_for_value(item["value"], sources)))
    charts: list[ChartResponse] = []
    for item in data.get("charts") or []:
        chart = _chart(item, evidence_text, _source_label(sources))
        if chart:
            charts.append(chart)
    if not charts:
        fallback = _monthly_chart(question, sources)
        if fallback:
            charts.append(fallback)
    risks = [RiskResponse(level=str(item.get("level") or "medium")[:20], title=str(item.get("title") or "风险提示")[:100], description=str(item.get("description") or "")[:1000], source=_source_label(sources)) for item in (data.get("risks") or []) if isinstance(item, dict) and _supported_claim(str(item.get("title") or "") + str(item.get("description") or ""), evidence_text)][:5]
    decisions = [DecisionResponse(priority=str(item.get("priority") or "medium")[:20], title=str(item.get("title") or "决策建议")[:100], description=str(item.get("description") or "")[:1000], basis=str(item.get("basis") or "")[:500], source=_source_label(sources)) for item in (data.get("decisions") or []) if isinstance(item, dict) and _supported_claim(str(item.get("basis") or item.get("description") or ""), evidence_text)][:5]
    return ChatResponse(title=title, summary=summary, sections=sections[:8], citations=_citations(sources), metrics=metrics[:6], charts=charts[:2], risks=risks, decisions=decisions)


def _monthly_chart(question: str, sources: list[RetrievedChunk]) -> ChartResponse | None:
    """Render a chart only from explicit month-value pairs found in retrieved text."""
    if not any(word in question for word in ("图", "趋势", "变化", "柱状", "折线")):
        return None
    structured = _table_monthly_chart(question, sources)
    if structured:
        return structured
    text = "\n".join(item.chunk.content for item in sources)
    pairs = re.findall(
        r"(?<!\d)([1-9]|1[0-2])月(?:[^\d\n]{0,16}?)([0-9]+(?:\.[0-9]+)?)\s*([\u4e00-\u9fa5%]+)?",
        text,
    )
    if len(pairs) < 3:
        return None
    seen: dict[str, tuple[float, str]] = {}
    for month, value, unit in pairs:
        seen.setdefault(month, (float(value), unit or ""))
    if len(seen) < 3:
        return None
    ordered = sorted(seen.items(), key=lambda item: int(item[0]))
    unit = next((value[1] for _, value in ordered if value[1]), "")
    return ChartResponse(
        type="bar" if "柱状" in question else "line",
        title="月度数据变化趋势",
        x_axis=[f"{month}月" for month, _ in ordered],
        series=[ChartSeries(name="月度数值", data=[value[0] for _, value in ordered])],
        unit=unit,
        conclusion="图表由已检索资料中的明确月度数值生成。",
        source="已检索文档片段",
    )


def _table_monthly_chart(question: str, sources: list[RetrievedChunk]) -> ChartResponse | None:
    for item in sources:
        lines = item.chunk.content.splitlines()
        header_line = next((line for line in lines if line.startswith("表头：") and "月份" in line), None)
        if not header_line:
            continue
        headers = header_line.removeprefix("表头：").split(" | ")
        column = _metric_column(question, headers)
        if column is None:
            continue
        months: list[str] = []
        values: list[float] = []
        for line in lines:
            match = re.search(r"行：([1-9]|1[0-2])月 \| (.+)$", line)
            if not match:
                continue
            cells = [f"{match.group(1)}月", *match.group(2).split(" | ")]
            if len(cells) <= column:
                continue
            try:
                values.append(float(cells[column].replace(",", "").replace("%", "")))
            except ValueError:
                continue
            months.append(f"{match.group(1)}月")
        if len(months) < 3:
            continue
        metric_name = headers[column]
        unit_match = re.search(r"（([^）]+)）", metric_name)
        return ChartResponse(
            type="bar" if "柱状" in question else "line",
            title=f"月度{metric_name}变化",
            x_axis=months,
            series=[ChartSeries(name=metric_name.replace("（", "(").replace("）", ")"), data=values)],
            unit=unit_match.group(1) if unit_match else ("%" if "率" in metric_name else ""),
            conclusion="图表由已检索表格的月份行和指标列生成。",
            source=_source_label([item]),
        )
    return None


def _metric_column(question: str, headers: list[str]) -> int | None:
    preferred = ("实际产量", "计划产量", "计划达成率", "一次交检合格率", "订单准时交付率", "合格品", "单位产值电耗", "用电量")
    for name in preferred:
        if name in question:
            return next((index for index, header in enumerate(headers) if name in header), None)
    if "生产" in question or "产量" in question:
        return next((index for index, header in enumerate(headers) if "实际产量" in header), None)
    return None


def _chart(item: object, evidence_text: str, source_label: str) -> ChartResponse | None:
    if not isinstance(item, dict) or item.get("type") not in {"line", "bar", "pie"}:
        return None
    x_axis = [str(value)[:60] for value in (item.get("x_axis") or [])]
    series: list[ChartSeries] = []
    for source in item.get("series") or []:
        if not isinstance(source, dict) or not isinstance(source.get("data"), list):
            continue
        try:
            values = [float(value) for value in source["data"]]
        except (TypeError, ValueError):
            continue
        if len(values) == len(x_axis) and values and all(_supported_value(value, evidence_text) for value in values):
            series.append(ChartSeries(name=str(source.get("name") or "数值")[:50], data=values))
    if not x_axis or not series:
        return None
    return ChartResponse(type=item["type"], title=str(item.get("title") or "数据图表")[:100], x_axis=x_axis, series=series[:3], unit=str(item.get("unit") or "")[:20], conclusion=str(item.get("conclusion") or "")[:500], source=source_label)


def _evidence_text(sources: list[RetrievedChunk]) -> str:
    return re.sub(r"[\s,，]", "", "".join(item.chunk.content for item in sources))


def _supported_value(value: object, evidence_text: str) -> bool:
    normalized = re.sub(r"[\s,，]", "", str(value))
    if normalized.endswith(".0"):
        normalized = normalized[:-2]
    if not normalized:
        return False
    return normalized in evidence_text


def _source_label(sources: list[RetrievedChunk]) -> str:
    if not sources:
        return ""
    first = sources[0].chunk
    return f"{first.document.original_name} · {_location(first)}"


def _source_label_for_value(value: object, sources: list[RetrievedChunk]) -> str:
    normalized = re.sub(r"[\s,，]", "", str(value)).removesuffix(".0")
    for item in sources:
        if normalized and normalized in _evidence_text([item]):
            return _source_label([item])
    return _source_label(sources)


def _supported_claim(claim: str, evidence_text: str) -> bool:
    claim_tokens = {token for token in tokenize(claim) if len(token) == 2}
    evidence_tokens = {token for token in tokenize(evidence_text) if len(token) == 2}
    return len(claim_tokens.intersection(evidence_tokens)) >= 2


def _location(chunk: DocumentChunk) -> str:
    if chunk.page_number:
        return f"第 {chunk.page_number} 页"
    if chunk.sheet_name:
        rows = f"第 {chunk.row_start}-{chunk.row_end} 行" if chunk.row_start else ""
        return f"{chunk.sheet_name} {rows}".strip()
    return f"片段 {chunk.sequence + 1}"


def _citations(sources: list[RetrievedChunk]) -> list[CitationResponse]:
    return [
        CitationResponse(
            document_name=item.chunk.document.original_name,
            location=_location(item.chunk),
            content=item.chunk.content[:220],
        )
        for item in sources[:4]
    ]
