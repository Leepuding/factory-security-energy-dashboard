import re
from collections.abc import Iterable
from dataclasses import dataclass

from rank_bm25 import BM25Okapi

from ..models import DocumentChunk


QUERY_EXPANSIONS = {
    "生产数据": ("月度", "产量", "计划产量", "实际产量", "计划达成率", "合格率", "交付率"),
    "生产情况": ("产量", "实际产量", "计划达成率", "订单准时交付率"),
    "产能": ("产量", "计划产量", "实际产量", "计划达成率"),
    "月度": ("月份", "1月", "2月", "3月", "4月", "5月", "6月"),
    "上半年": ("1月", "2月", "3月", "4月", "5月", "6月", "合计", "平均"),
    "能耗": ("单位产值电耗", "用电量", "能源"),
    "质量": ("一次交检合格率", "合格品", "质量异常"),
    "交付": ("订单准时交付率", "订单", "延期"),
}
TABLE_INTENT_WORDS = ("数据", "指标", "产量", "产能", "趋势", "变化", "图", "对比", "多少", "率", "1月", "2月", "3月", "4月", "5月", "6月", "上半年")


@dataclass(frozen=True)
class RetrievedChunk:
    chunk: DocumentChunk
    score: float


def tokenize(text: str) -> list[str]:
    words = re.findall(r"[A-Za-z0-9_]+|[\u4e00-\u9fff]", text.lower())
    chinese = "".join(token for token in words if len(token) == 1 and "\u4e00" <= token <= "\u9fff")
    bigrams = [chinese[index:index + 2] for index in range(max(len(chinese) - 1, 0))]
    return words + bigrams


def expand_query(question: str) -> list[str]:
    expanded = question
    normalized = question.replace("—", "-").replace("至", "到")
    for trigger, related in QUERY_EXPANSIONS.items():
        if trigger in normalized:
            expanded += " " + " ".join(related)
    if re.search(r"[1-6]月.*(?:到|-|至).*[1-6]月", normalized):
        expanded += " 月度 月份 计划产量 实际产量 计划达成率 合格率 交付率"
    return tokenize(expanded)


def retrieve_chunks(question: str, chunks: Iterable[DocumentChunk], limit: int = 6) -> list[RetrievedChunk]:
    candidates = list(chunks)
    query_tokens = expand_query(question)
    if not candidates or not query_tokens:
        return []
    corpus = [tokenize(chunk.content) for chunk in candidates]
    raw_scores = BM25Okapi(corpus).get_scores(query_tokens)
    prefers_tables = any(word in question for word in TABLE_INTENT_WORDS)
    ranked = []
    for candidate, score, tokens in zip(candidates, raw_scores, corpus):
        adjusted = float(score)
        sheet_name = getattr(candidate, "sheet_name", None)
        is_table = bool(sheet_name and "表格" in sheet_name)
        if prefers_tables and is_table:
            adjusted += 2.5
        if prefers_tables and is_table and any(month in candidate.content for month in ("1月", "2月", "3月", "4月", "5月", "6月")):
            adjusted += 1.5
        if score <= 0:
            adjusted += len(set(query_tokens).intersection(tokens))
        if adjusted > 0:
            ranked.append(RetrievedChunk(chunk=candidate, score=adjusted))
    ranked.sort(key=lambda item: item.score, reverse=True)
    return _diversify(ranked, limit)


def _diversify(ranked: list[RetrievedChunk], limit: int) -> list[RetrievedChunk]:
    """Keep strong evidence while avoiding six near-identical chunks from one document."""
    result: list[RetrievedChunk] = []
    per_document: dict[str, int] = {}
    for item in ranked:
        document_id = getattr(item.chunk, "document_id", "")
        if per_document.get(document_id, 0) >= 4:
            continue
        result.append(item)
        per_document[document_id] = per_document.get(document_id, 0) + 1
        if len(result) >= limit:
            break
    return result
