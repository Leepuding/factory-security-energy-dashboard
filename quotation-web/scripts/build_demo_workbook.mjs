import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "demo-package", "06_规则与基础数据");
const previewDir = path.join(projectRoot, "tmp", "spreadsheet-previews");
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const wb = Workbook.create();
const overview = wb.worksheets.add("规则总览");
const resources = wb.worksheets.add("材料与设备");
const processes = wb.worksheets.add("工序与外协");
const calculator = wb.worksheets.add("报价计算示例");
const history = wb.worksheets.add("历史报价样例");

const C = {
  navy: "#172A38",
  teal: "#0F766E",
  tealLight: "#E6F5F2",
  border: "#D8E1E5",
  text: "#27343B",
  muted: "#6B7A83",
  input: "#FFF7E6",
  good: "#DCFCE7",
  warn: "#FEF3C7",
  danger: "#FEE2E2",
};

function title(sheet, range, text, subtitleRange, subtitle) {
  sheet.getRange(range).merge();
  sheet.getRange(range).values = [[text]];
  sheet.getRange(range).format = {
    fill: C.navy,
    font: { bold: true, color: "#FFFFFF", size: 16 },
    verticalAlignment: "center",
  };
  sheet.getRange(range).format.rowHeight = 34;
  if (subtitleRange) {
    sheet.getRange(subtitleRange).merge();
    sheet.getRange(subtitleRange).values = [[subtitle]];
    sheet.getRange(subtitleRange).format = {
      fill: "#F4F7F8",
      font: { color: C.muted, size: 9 },
      verticalAlignment: "center",
    };
    sheet.getRange(subtitleRange).format.rowHeight = 24;
  }
  sheet.showGridLines = false;
}

function header(range) {
  range.format = {
    fill: C.teal,
    font: { bold: true, color: "#FFFFFF" },
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: C.border },
  };
  range.format.rowHeight = 26;
}

function body(range) {
  range.format = {
    font: { color: C.text, size: 9 },
    verticalAlignment: "center",
    borders: { insideHorizontal: { style: "thin", color: C.border } },
  };
  range.format.rowHeight = 22;
}

function section(range, text) {
  range.merge();
  range.values = [[text]];
  range.format = {
    fill: C.tealLight,
    font: { bold: true, color: C.teal },
    verticalAlignment: "center",
  };
  range.format.rowHeight = 26;
}

title(overview, "A1:H1", "非标件自动报价规则演示包", "A2:H2", "演示版本 RQ-2026.07.2 | 所有金额为含税或未税示例值，非真实经营数据");
section(overview.getRange("A4:H4"), "规则版本");
overview.getRange("A5:H5").values = [["版本号", "状态", "生效日期", "材料价版本", "设备费率版本", "公式版本", "创建人", "说明"]];
header(overview.getRange("A5:H5"));
overview.getRange("A6:H7").values = [
  ["RQ-2026.07.2", "当前生效", new Date("2026-07-18"), "MAT-2026.07", "RATE-2026.07", "FORMULA-V1.3", "系统管理员", "新报价默认使用"],
  ["RQ-2026.06.1", "历史冻结", new Date("2026-06-01"), "MAT-2026.06", "RATE-2026.06", "FORMULA-V1.2", "系统管理员", "仅用于历史复算"],
];
body(overview.getRange("A6:H7"));
overview.getRange("C6:C7").format.numberFormat = "yyyy-mm-dd";

section(overview.getRange("A9:H9"), "商务与风险规则");
overview.getRange("A10:H10").values = [["规则编码", "规则名称", "默认值", "单位", "最低值", "最高值", "触发动作", "备注"]];
header(overview.getRange("A10:H10"));
overview.getRange("A11:H16").values = [
  ["BIZ-MARGIN", "目标毛利率", 0.28, "%", 0.18, 0.6, "低于最低值预警", "销售可调整"],
  ["BIZ-TAX", "增值税率", 0.13, "%", 0, 0.13, "重新计算含税价", "演示默认 13%"],
  ["BIZ-VALID", "报价有效期", 15, "天", 1, 60, "写入正式报价", ""],
  ["RISK-SCRAP", "常规报废风险系数", 0.03, "%", 0, 0.2, "计入制造成本", "复杂件可人工上调"],
  ["RISK-LOWCONF", "低置信度阈值", 0.8, "%", 0.5, 1, "转人工确认", "字段级判断"],
  ["RISK-PRICE", "异常价格偏差阈值", 0.15, "%", 0.05, 0.5, "提示工程复核", "相对历史相似件"],
];
body(overview.getRange("A11:H16"));
overview.getRange("C11:C12").setNumberFormat("0.0%");
overview.getRange("C13").setNumberFormat("0");
overview.getRange("C14:C16").setNumberFormat("0.0%");
overview.getRange("E11:F12").setNumberFormat("0.0%");
overview.getRange("E13:F13").setNumberFormat("0");
overview.getRange("E14:F16").setNumberFormat("0.0%");

section(overview.getRange("A18:H18"), "企业加工能力边界");
overview.getRange("A19:H19").values = [["能力编码", "零件类型", "尺寸/能力边界", "最高精度", "粗糙度", "最大重量", "超限动作", "负责部门"]];
header(overview.getRange("A19:H19"));
overview.getRange("A20:H23").values = [
  ["CAP-CNC-BLOCK", "方件 CNC", "L≤750, W≤450, H≤120 mm", "±0.01 mm", "Ra0.8", 80, "禁止自动确认", "机加工部"],
  ["CAP-CNC-SHAFT", "圆件车削", "D≤200, L≤500 mm", "±0.01 mm", "Ra0.8", 120, "转人工评估", "机加工部"],
  ["CAP-SHEET", "钣金", "板厚 0.5-12 mm, L≤3000", "±0.20 mm", "Ra3.2", 200, "转外协评估", "钣金部"],
  ["CAP-HARDNESS", "热处理后精加工", "硬度≤50HRC", "±0.02 mm", "Ra0.8", 50, "转人工评估", "工程部"],
];
body(overview.getRange("A20:H23"));
overview.getRange("F20:F23").format.numberFormat = "0.0";
overview.freezePanes.freezeRows(2);
for (const [col, width] of [["A:A",16],["B:B",17],["C:C",26],["D:D",16],["E:E",13],["F:F",13],["G:G",20],["H:H",18]]) overview.getRange(col).format.columnWidth = width;

title(resources, "A1:N1", "材料价格与设备费率", "A2:N2", "基础价格按版本生效；黄色单元格为演示时可修改输入");
section(resources.getRange("A4:G4"), "材料价格库");
resources.getRange("A5:G5").values = [["材料编码", "材料名称", "密度 kg/m³", "含税单价 元/kg", "默认利用率", "价格版本", "更新时间"]];
header(resources.getRange("A5:G5"));
resources.getRange("A6:G11").values = [
  ["MAT-AL-6061", "6061-T6铝合金", 2700, 36.8, 0.84, "MAT-2026.07", new Date("2026-07-18")],
  ["MAT-AL-7075", "7075-T6铝合金", 2810, 62.5, 0.82, "MAT-2026.07", new Date("2026-07-18")],
  ["MAT-SS-304", "SUS304", 7930, 24.6, 0.8, "MAT-2026.07", new Date("2026-07-16")],
  ["MAT-ST-40CR", "40Cr", 7850, 8.9, 0.78, "MAT-2026.07", new Date("2026-07-15")],
  ["MAT-ST-Q235", "Q235B", 7850, 5.6, 0.8, "MAT-2026.07", new Date("2026-07-15")],
  ["MAT-TI-TC4", "TC4钛合金", 4510, 218, 0.72, "MAT-2026.07", new Date("2026-07-12")],
];
body(resources.getRange("A6:G11"));
resources.getRange("C6:C11").setNumberFormat("#,##0");
resources.getRange("D6:D11").setNumberFormat("¥#,##0.00");
resources.getRange("E6:E11").setNumberFormat("0.0%");
resources.getRange("G6:G11").setNumberFormat("yyyy-mm-dd");
resources.getRange("D6:E11").format.fill = C.input;

section(resources.getRange("I4:N4"), "设备与工时费率");
resources.getRange("I5:N5").values = [["设备编码", "设备名称", "能力参数", "准备费率 元/h", "加工费率 元/h", "费率版本"]];
header(resources.getRange("I5:N5"));
resources.getRange("I6:N11").values = [
  ["EQ-VMC850", "VMC-850加工中心", "850×500×500", 90, 120, "RATE-2026.07"],
  ["EQ-VMC650", "VMC-650加工中心", "650×450×450", 80, 98, "RATE-2026.07"],
  ["EQ-CNC-L", "数控车床", "D≤320, L≤500", 85, 110, "RATE-2026.07"],
  ["EQ-WEDM", "中走丝线切割", "400×500×300", 70, 150, "RATE-2026.07"],
  ["EQ-GRIND", "平面磨床", "600×300", 75, 105, "RATE-2026.07"],
  ["EQ-LASER", "激光切割机", "3kW, 3000×1500", 65, 130, "RATE-2026.07"],
];
body(resources.getRange("I6:N11"));
resources.getRange("L6:M11").setNumberFormat("¥#,##0.00");
resources.getRange("L6:M11").format.fill = C.input;
resources.freezePanes.freezeRows(2);
for (const [col, width] of [["A:A",17],["B:B",19],["C:C",16],["D:D",17],["E:E",15],["F:F",17],["G:G",15],["H:H",3],["I:I",15],["J:J",18],["K:K",22],["L:M",17],["N:N",17]]) resources.getRange(col).format.columnWidth = width;

title(processes, "A1:O1", "工序、刀具磨损与外协价格", "A2:O2", "正式成本由可解释规则计算；模型只提供识别字段和工艺建议");
section(processes.getRange("A4:H4"), "标准工序规则");
processes.getRange("A5:H5").values = [["工序编码", "工序名称", "类别", "默认设备", "准备时间 min", "计价公式", "刀具磨损率", "适用说明"]];
header(processes.getRange("A5:H5"));
processes.getRange("A6:H14").values = [
  ["OP-CNC-R", "CNC粗铣", "机加工", "EQ-VMC850", 20, "准备时间/60×准备费率 + 加工时间/60×加工费率", 0.06, "铝合金/钢件粗加工"],
  ["OP-CNC-F", "CNC精铣", "机加工", "EQ-VMC850", 12, "加工时间/60×加工费率", 0.08, "关键面与型腔"],
  ["OP-DRILL", "钻孔/攻丝", "机加工", "EQ-VMC650", 8, "加工时间/60×加工费率 + 丝锥磨损", 0.05, "通孔、螺纹孔"],
  ["OP-TURN", "数控车削", "机加工", "EQ-CNC-L", 15, "准备时间/60×准备费率 + 加工时间/60×加工费率", 0.07, "轴类与回转件"],
  ["OP-WEDM", "中走丝线切割", "特种加工", "EQ-WEDM", 10, "切割面积×单价 + 穿丝费", 0.03, "窄槽与异形孔"],
  ["OP-GRIND", "平面磨削", "磨削", "EQ-GRIND", 15, "加工时间/60×加工费率", 0.04, "精密平面"],
  ["OP-LASER", "激光下料", "钣金", "EQ-LASER", 8, "切割长度×单价 + 穿孔数×单价", 0.02, "板材展开件"],
  ["OP-BEND", "折弯", "钣金", "折弯机", 12, "折弯次数×单次价格 + 准备费", 0.01, "按折弯刀数"],
  ["OP-WELD", "氩弧焊", "焊接", "焊接工位", 15, "焊缝长度×单价 + 装夹费", 0.03, "SUS/铝合金焊接"],
];
body(processes.getRange("A6:H14"));
processes.getRange("E6:E14").setNumberFormat("0");
processes.getRange("G6:G14").setNumberFormat("0.0%");

section(processes.getRange("J4:O4"), "外协与附加费用");
processes.getRange("J5:O5").values = [["项目编码", "项目名称", "计价单位", "单价", "最低收费", "备注"]];
header(processes.getRange("J5:O5"));
processes.getRange("J6:O13").values = [
  ["OUT-ANO", "本色阳极氧化", "dm²", 4.8, 120, "膜厚 10-15μm"],
  ["OUT-BLACK", "发黑", "kg", 6.5, 80, "常规防锈"],
  ["OUT-HT", "调质 28-32HRC", "kg", 9.5, 300, "含硬度报告"],
  ["OUT-PASS", "不锈钢钝化", "dm²", 7.2, 150, "ASTM A967参考"],
  ["OUT-PLATE", "镀硬铬", "dm²", 18, 350, "厚度 20-30μm"],
  ["QA-CMM", "三坐标检测", "件", 24, 120, "关键尺寸 6项"],
  ["PKG-STD", "标准防护包装", "件", 8, 0, "防锈袋+标签"],
  ["PKG-VAC", "真空洁净包装", "件", 35, 200, "双层洁净袋"],
];
body(processes.getRange("J6:O13"));
processes.getRange("M6:N13").setNumberFormat("¥#,##0.00");
processes.getRange("M6:N13").format.fill = C.input;
processes.freezePanes.freezeRows(2);
for (const [col, width] of [["A:A",15],["B:B",17],["C:C",13],["D:D",15],["E:E",16],["F:F",42],["G:G",15],["H:H",22],["I:I",3],["J:J",15],["K:K",20],["L:L",13],["M:N",14],["O:O",22]]) processes.getRange(col).format.columnWidth = width;

title(calculator, "A1:H1", "报价计算示例 - 伺服电机安装座", "A2:H2", "黄色为输入项，蓝绿色为跨表引用，所有金额均为单件未税示例");
section(calculator.getRange("A4:D4"), "基础输入");
calculator.getRange("A5:B12").values = [
  ["参数", "数值"],
  ["报价数量", 20],
  ["净重 kg", 1.86],
  ["毛坯重量 kg", 2.31],
  ["材料利用率", 0.84],
  ["粗铣时间 min", 38],
  ["精铣时间 min", 46],
  ["钻孔攻丝 min", 18],
];
header(calculator.getRange("A5:B5"));
body(calculator.getRange("A6:B12"));
calculator.getRange("B6:B12").format.fill = C.input;
calculator.getRange("B9:B9").setNumberFormat("0.0%");

section(calculator.getRange("D4:H4"), "规则引用与成本结果");
calculator.getRange("D5:H5").values = [["成本项", "规则/来源", "数量", "单价/费率", "金额"]];
header(calculator.getRange("D5:H5"));
calculator.getRange("D6:F15").values = [
  ["材料费", "6061-T6 / 利用率", 1],
  ["CNC粗铣", "VMC-850", 1],
  ["CNC精铣", "VMC-850", 1],
  ["钻孔/攻丝", "VMC-650", 1],
  ["阳极氧化", "最低炉费分摊", 1],
  ["三坐标检测", "关键尺寸6项", 1],
  ["刀具与工装磨损", "机加工费×8%", 1],
  ["包装", "标准防护", 1],
  ["报废风险", "直接成本×3%", 1],
  ["制造成本合计", "规则版本 RQ-2026.07.2", 1],
];
calculator.getRange("G6:G15").formulas = [
  ["='材料与设备'!D6"],
  ["='材料与设备'!M6"],
  ["='材料与设备'!M6"],
  ["='材料与设备'!M7"],
  ["='工序与外协'!N6/20"],
  ["='工序与外协'!M11"],
  ["=8%"],
  ["='工序与外协'!M12"],
  ["=3%"],
  ["=0"],
];
calculator.getRange("H6:H15").formulas = [
  ["=ROUND($B$8*G6/$B$9,2)"],
  ["=ROUND($B$10/60*G7+20/60*'材料与设备'!L6,2)"],
  ["=ROUND($B$11/60*G8,2)"],
  ["=ROUND($B$12/60*G9,2)"],
  ["=ROUND(G10,2)"],
  ["=ROUND(G11,2)"],
  ["=ROUND(SUM(H7:H9)*G12,2)"],
  ["=ROUND(G13,2)"],
  ["=ROUND(SUM(H6:H13)*G14,2)"],
  ["=ROUND(SUM(H6:H14),2)"],
];
body(calculator.getRange("D6:H15"));
calculator.getRange("G6:G11").format.fill = C.tealLight;
calculator.getRange("G6:G11").setNumberFormat("¥#,##0.00");
calculator.getRange("G12:G12").setNumberFormat("0.0%");
calculator.getRange("G13:G13").setNumberFormat("¥#,##0.00");
calculator.getRange("G14:G14").setNumberFormat("0.0%");
calculator.getRange("H6:H15").setNumberFormat("¥#,##0.00");
calculator.getRange("D15:H15").format = { fill: C.tealLight, font: { bold: true, color: C.teal }, borders: { preset: "outside", style: "thin", color: C.teal } };

section(calculator.getRange("A17:H17"), "销售定价");
calculator.getRange("A18:D18").values = [["目标毛利率", "税率", "未税建议单价", "含税建议单价"]];
header(calculator.getRange("A18:D18"));
calculator.getRange("A19:B19").values = [[0.28, 0.13]];
calculator.getRange("A19:B19").format.fill = C.input;
calculator.getRange("A19:B19").setNumberFormat("0.0%");
calculator.getRange("C19:D19").formulas = [["=ROUND($H$15/(1-A19),2)", "=ROUND(C19*(1+B19),2)"]];
calculator.getRange("C19:D19").setNumberFormat("¥#,##0.00");
calculator.getRange("A21:D21").values = [["数量", "含税总价", "预计毛利额", "预计毛利率"]];
header(calculator.getRange("A21:D21"));
calculator.getRange("A22:D22").formulas = [["=$B$6", "=ROUND(A22*$D$19,2)", "=ROUND((C19-$H$15)*A22,2)", "=(C19-$H$15)/C19"]];
calculator.getRange("A22:A22").setNumberFormat("#,##0");
calculator.getRange("B22:C22").setNumberFormat("¥#,##0.00");
calculator.getRange("D22:D22").setNumberFormat("0.0%");
body(calculator.getRange("A19:D19"));
body(calculator.getRange("A22:D22"));
calculator.freezePanes.freezeRows(2);
for (const [col, width] of [["A:A",20],["B:B",17],["C:C",16],["D:D",20],["E:E",24],["F:F",12],["G:H",18]]) calculator.getRange(col).format.columnWidth = width;

title(history, "A1:N1", "历史报价样例 - 12条", "A2:N2", "覆盖车、铣、磨、线切割、钣金、焊接、热处理、表面处理与外协组合工艺");
history.getRange("A4:D4").values = [["样本数", "初稿10%内数量", "初稿10%内占比", "平均初稿偏差"]];
header(history.getRange("A4:D4"));
history.getRange("A5:D5").formulas = [["=COUNTA(A8:A19)", "=COUNTIF(L8:L19,\"是\")", "=B5/A5", "=AVERAGE(J8:J19)"]];
history.getRange("A5:B5").setNumberFormat("#,##0");
history.getRange("C5:D5").setNumberFormat("0.0%");
history.getRange("A7:N7").values = [["历史编号", "零件名称", "主要工艺", "材料", "数量", "工程成本", "初稿单价", "人工审核价", "实际成本", "初稿偏差率", "实际成本偏差率", "初稿≤10%", "规则版本", "报价日期"]];
header(history.getRange("A7:N7"));
const historyRows = [
  ["HIS-0001", "伺服电机安装座", "铣/钻/阳极", "6061-T6", 20, 414.1, 575.1, 568, 421.5, null, null, null, "RQ-2026.07.2", new Date("2026-07-18")],
  ["HIS-0002", "分度盘连接轴", "车/磨/调质", "40Cr", 50, 182.4, 253.3, 260, 187.2, null, null, null, "RQ-2026.07.2", new Date("2026-07-17")],
  ["HIS-0003", "钣金折弯支架", "激光/折弯/拉丝", "SUS304", 100, 48.6, 67.5, 66, 50.1, null, null, null, "RQ-2026.07.2", new Date("2026-07-16")],
  ["HIS-0004", "导轨压块", "铣/线切割", "7075-T6", 30, 96.2, 133.6, 142, 101.8, null, null, null, "RQ-2026.07.2", new Date("2026-07-15")],
  ["HIS-0005", "焊接机架连接板", "激光/焊接/喷粉", "Q235B", 40, 88.5, 122.9, 128, 92.4, null, null, null, "RQ-2026.07.2", new Date("2026-07-14")],
  ["HIS-0006", "真空传感器法兰", "车/铣/钝化", "SUS304", 12, 328.2, 455.8, 468, 335.6, null, null, null, "RQ-2026.07.2", new Date("2026-07-13")],
  ["HIS-0007", "齿轮箱端盖", "车/铣/调质/发黑", "40Cr", 16, 512.7, 712.1, 735, 528.4, null, null, null, "RQ-2026.07.2", new Date("2026-07-12")],
  ["HIS-0008", "精密定位块", "铣/磨/CMM", "SKD11", 24, 268.9, 373.5, 365, 274.6, null, null, null, "RQ-2026.06.1", new Date("2026-06-28")],
  ["HIS-0009", "钛合金压板", "铣/线切割/喷砂", "TC4", 8, 826.3, 1147.6, 1210, 854.2, null, null, null, "RQ-2026.06.1", new Date("2026-06-24")],
  ["HIS-0010", "气缸安装法兰", "车/铣/阳极", "6061-T6", 60, 76.8, 106.7, 105, 78.1, null, null, null, "RQ-2026.06.1", new Date("2026-06-20")],
  ["HIS-0011", "不锈钢料斗支架", "钣金/焊接/钝化", "SUS304", 20, 386.5, 536.8, 560, 397.9, null, null, null, "RQ-2026.06.1", new Date("2026-06-18")],
  ["HIS-0012", "电机过渡轴", "车/磨/镀硬铬", "40Cr", 35, 224.1, 311.3, 318, 229.8, null, null, null, "RQ-2026.06.1", new Date("2026-06-15")],
];
history.getRange("A8:N19").values = historyRows;
for (let row = 8; row <= 19; row += 1) {
  history.getRange(`J${row}:L${row}`).formulas = [[`=ABS(G${row}-H${row})/H${row}`, `=ABS(F${row}-I${row})/I${row}`, `=IF(J${row}<=10%,\"是\",\"否\")`]];
}
body(history.getRange("A8:N19"));
history.getRange("E8:E19").setNumberFormat("#,##0");
history.getRange("F8:I19").setNumberFormat("¥#,##0.00");
history.getRange("J8:K19").setNumberFormat("0.0%");
history.getRange("N8:N19").setNumberFormat("yyyy-mm-dd");
history.getRange("J8:J19").conditionalFormats.add("cellIs", { operator: "lessThanOrEqual", formula: 0.1, format: { fill: C.good, font: { color: "#166534" } } });
history.getRange("J8:J19").conditionalFormats.add("cellIs", { operator: "greaterThan", formula: 0.1, format: { fill: C.danger, font: { color: "#991B1B" } } });
history.freezePanes.freezeRows(7);
for (const [col, width] of [["A:A",15],["B:B",20],["C:C",24],["D:D",15],["E:E",10],["F:I",14],["J:K",16],["L:L",12],["M:M",17],["N:N",15]]) history.getRange(col).format.columnWidth = width;

const previews = [
  ["规则总览", "A1:H23"],
  ["材料与设备", "A1:N12"],
  ["工序与外协", "A1:O15"],
  ["报价计算示例", "A1:H22"],
  ["历史报价样例", "A1:N19"],
];

for (const [sheetName, range] of previews) {
  const preview = await wb.render({ sheetName, range, scale: 1, format: "png" });
  const bytes = new Uint8Array(await preview.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `${sheetName}.png`), bytes);
}

const inspect = await wb.inspect({ kind: "table", range: "报价计算示例!A4:H22", include: "values,formulas", tableMaxRows: 24, tableMaxCols: 10, maxChars: 12000 });
console.log(inspect.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" });
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(path.join(outputDir, "非标件自动报价_规则与历史数据演示包.xlsx"));
