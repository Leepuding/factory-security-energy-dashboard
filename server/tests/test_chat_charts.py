import unittest
from types import SimpleNamespace

from app.services.chat import _monthly_chart


class MonthlyChartTests(unittest.TestCase):
    def test_accepts_month_label_value_format(self):
        chunk = SimpleNamespace(content="1月销售额100万元\n2月销售额130万元\n3月销售额160万元")
        chart = _monthly_chart("请用柱状图展示销售额趋势", [SimpleNamespace(chunk=chunk)])
        self.assertIsNotNone(chart)
        assert chart is not None
        self.assertEqual(chart.type, "bar")
        self.assertEqual(chart.series[0].data, [100.0, 130.0, 160.0])

    def test_table_chart_uses_requested_actual_output_column(self):
        document = SimpleNamespace(original_name="生产资料.docx")
        chunk = SimpleNamespace(
            document=document,
            content="章节：五、月度生产数据\n表头：月份 | 计划产量（件） | 实际产量（件）\n第 2 行：1月 | 205000 | 201500\n第 3 行：2月 | 168000 | 160000\n第 4 行：3月 | 216000 | 214800",
            page_number=None,
            sheet_name="五、月度生产数据 · 表格",
            row_start=2,
            row_end=4,
            sequence=0,
        )
        chart = _monthly_chart("请用柱状图展示1-3月实际产量变化", [SimpleNamespace(chunk=chunk)])
        self.assertIsNotNone(chart)
        assert chart is not None
        self.assertEqual(chart.series[0].data, [201500.0, 160000.0, 214800.0])
