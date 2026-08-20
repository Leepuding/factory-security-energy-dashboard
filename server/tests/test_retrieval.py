import unittest
from types import SimpleNamespace

from app.services.retrieval import retrieve_chunks, tokenize


class RetrievalTests(unittest.TestCase):
    def test_chinese_tokens_include_bigrams(self) -> None:
        self.assertIn("风险", tokenize("风险提示"))

    def test_prefers_related_chunk(self) -> None:
        chunks = [
            SimpleNamespace(content="生产计划和产量数据", sequence=0),
            SimpleNamespace(content="安全风险提示和整改建议", sequence=1),
        ]
        matches = retrieve_chunks("有哪些安全风险", chunks, limit=1)
        self.assertEqual(matches[0].chunk.sequence, 1)

    def test_monthly_production_question_prefers_table(self) -> None:
        chunks = [
            SimpleNamespace(content="五、月度生产数据\n表头：月份 | 计划产量 | 实际产量\n第 2 行：1月 | 205000 | 201500\n第 3 行：2月 | 168000 | 160000", sequence=0, sheet_name="五、月度生产数据 · 表格", document_id="one"),
            SimpleNamespace(content="生产部门负责排产、产能协调和生产进度", sequence=1, sheet_name=None, document_id="one"),
        ]
        matches = retrieve_chunks("1月到6月的生产数据给我看看", chunks, limit=1)
        self.assertEqual(matches[0].chunk.sequence, 0)
