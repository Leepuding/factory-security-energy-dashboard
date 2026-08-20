from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "demo-package"
PAGE = landscape(A4)
FONT = "HiraginoSansGB"

pdfmetrics.registerFont(TTFont(FONT, "/System/Library/Fonts/STHeiti Light.ttc", subfontIndex=0))


def line(c, x1, y1, x2, y2, width=0.8, dash=None):
    c.setLineWidth(width)
    c.setDash(dash or [])
    c.line(x1, y1, x2, y2)
    c.setDash([])


def dim_h(c, x1, x2, y, label):
    line(c, x1, y, x2, y, 0.45)
    line(c, x1, y - 4, x1, y + 4, 0.45)
    line(c, x2, y - 4, x2, y + 4, 0.45)
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 8)
    c.drawCentredString((x1 + x2) / 2, y + 4, label)


def dim_v(c, x, y1, y2, label):
    line(c, x, y1, x, y2, 0.45)
    line(c, x - 4, y1, x + 4, y1, 0.45)
    line(c, x - 4, y2, x + 4, y2, 0.45)
    c.saveState()
    c.setFillColor(colors.HexColor("#27343b"))
    c.translate(x - 5, (y1 + y2) / 2)
    c.rotate(90)
    c.setFont(FONT, 8)
    c.drawCentredString(0, 0, label)
    c.restoreState()


def frame(c, title, drawing_no, material, scale="1:1"):
    w, h = PAGE
    c.setStrokeColor(colors.HexColor("#27343b"))
    c.setFillColor(colors.white)
    c.rect(18, 18, w - 36, h - 36, fill=1, stroke=1)
    c.setFillColor(colors.HexColor("#172a38"))
    c.rect(18, h - 56, w - 36, 38, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont(FONT, 16)
    c.drawString(30, h - 43, f"西博思精密制造 - 演示工程图 | {title}")
    c.setFont(FONT, 8)
    c.drawRightString(w - 30, h - 42, "DEMO DRAWING - 非生产用途")

    c.setStrokeColor(colors.HexColor("#53616a"))
    c.rect(w - 292, 18, 274, 66, fill=0, stroke=1)
    line(c, w - 292, 51, w - 18, 51, 0.5)
    line(c, w - 292, 34, w - 18, 34, 0.5)
    line(c, w - 170, 18, w - 170, 84, 0.5)
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 8)
    c.drawString(w - 286, 68, f"图号: {drawing_no}")
    c.drawString(w - 164, 68, f"材料: {material}")
    c.drawString(w - 286, 40, f"比例: {scale}")
    c.drawString(w - 164, 40, "版本: A / 2026-07-20")
    c.drawString(w - 286, 23, "制图: Demo")
    c.drawString(w - 164, 23, "单位: mm")
    return w, h


def notes(c, items):
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 8)
    y = 108
    c.drawString(34, y, "技术要求:")
    for i, item in enumerate(items, 1):
        y -= 13
        c.drawString(38, y, f"{i}. {item}")


def draw_mounting_plate(path):
    c = canvas.Canvas(str(path), pagesize=PAGE)
    w, h = frame(c, "伺服电机安装座", "XBS-DEMO-001", "6061-T6")
    c.setStrokeColor(colors.HexColor("#26343b"))
    c.setFillColor(colors.HexColor("#edf5f4"))
    x, y, bw, bh = 220, 205, 330, 220
    c.rect(x, y, bw, bh, fill=1, stroke=1)
    for px in (x + 35, x + bw - 35):
        for py in (y + 35, y + bh - 35):
            c.circle(px, py, 8, fill=0, stroke=1)
            c.circle(px, py, 3, fill=0, stroke=1)
    c.roundRect(x + 120, y + 72, 90, 76, 7, fill=0, stroke=1)
    c.circle(x + 165, y + 110, 27, fill=0, stroke=1)
    line(c, x + 165, y + 58, x + 165, y + 162, 0.4, [4, 3])
    line(c, x + 105, y + 110, x + 225, y + 110, 0.4, [4, 3])
    dim_h(c, x, x + bw, y - 22, "168 ±0.10")
    dim_v(c, x - 22, y, y + bh, "112 ±0.10")
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 9)
    c.drawString(x, y + bh + 14, "俯视图")
    c.drawString(584, 420, "4-Φ9 THRU")
    c.drawString(584, 405, "Φ52 H7  +0.030/0")
    c.drawString(584, 390, "位置度 Φ0.05 | A | B")
    notes(c, ["未注尺寸公差按 GB/T 1804-m。", "表面处理：本色阳极氧化，膜厚 10-15μm。", "关键孔粗糙度 Ra1.6，其余 Ra3.2。", "锐边倒钝 0.2-0.5，不得有毛刺和磕碰。"]) 
    c.save()


def draw_bracket(path):
    c = canvas.Canvas(str(path), pagesize=PAGE)
    frame(c, "钣金折弯支架", "XBS-DEMO-003", "SUS304 / t=2.0")
    c.setStrokeColor(colors.HexColor("#26343b"))
    c.setFillColor(colors.HexColor("#f4f7f8"))
    x, y = 230, 210
    c.rect(x, y, 300, 180, fill=1, stroke=1)
    for px in (x + 45, x + 255):
        for py in (y + 45, y + 135):
            c.circle(px, py, 6, fill=0, stroke=1)
    line(c, x + 95, y, x + 95, y + 180, 0.5, [5, 3])
    line(c, x + 205, y, x + 205, y + 180, 0.5, [5, 3])
    dim_h(c, x, x + 300, y - 22, "150")
    dim_v(c, x - 22, y, y + 180, "90")
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 9)
    c.drawString(x, y + 195, "展开图")
    c.drawString(560, 380, "4-Φ6.5")
    c.drawString(560, 362, "折弯线: 90° R2")
    notes(c, ["激光下料，去除切割毛刺。", "两处折弯 90°，内R=2.0。", "表面拉丝，纹路方向沿 150mm 边。", "未注线性尺寸公差 ±0.20。"]) 
    c.save()


def draw_flange(path, conflict=False):
    c = canvas.Canvas(str(path), pagesize=PAGE)
    material = "TC4钛合金" if conflict else "SUS304"
    frame(c, "传感器法兰", "XBS-DEMO-004", material)
    c.setStrokeColor(colors.HexColor("#26343b"))
    c.setFillColor(colors.HexColor("#eef5f4"))
    cx, cy = 390, 310
    c.circle(cx, cy, 115, fill=1, stroke=1)
    c.circle(cx, cy, 42, fill=0, stroke=1)
    for dx, dy in ((0, 78), (78, 0), (0, -78), (-78, 0)):
        c.circle(cx + dx, cy + dy, 7, fill=0, stroke=1)
    line(c, cx - 140, cy, cx + 140, cy, 0.4, [5, 3])
    line(c, cx, cy - 140, cx, cy + 140, 0.4, [5, 3])
    dim_h(c, cx - 115, cx + 115, cy - 145, "Φ160")
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 9)
    c.drawString(540, 410, "中心孔 Φ58 H7")
    c.drawString(540, 392, "4-Φ8.5 均布 PCD110")
    c.drawString(540, 374, "厚度 18 ±0.05")
    notes(c, [f"材料：{material}。", "外圆与中心孔同轴度 Φ0.03。", "密封面粗糙度 Ra0.8。", "真空清洗后独立包装。"])
    if conflict:
        c.setFillColor(colors.HexColor("#b45309"))
        c.setFont(FONT, 9)
        c.drawString(34, 150, "演示异常：同名 3D 文件的材料属性写为 6061-T6，与本 2D 图纸冲突。")
    c.save()


def draw_cover(path):
    c = canvas.Canvas(str(path), pagesize=PAGE)
    frame(c, "齿轮箱端盖", "XBS-DEMO-005", "40Cr")
    c.setStrokeColor(colors.HexColor("#26343b"))
    c.setFillColor(colors.HexColor("#edf2f4"))
    cx, cy = 395, 310
    c.circle(cx, cy, 120, fill=1, stroke=1)
    c.circle(cx, cy, 70, fill=0, stroke=1)
    c.circle(cx, cy, 35, fill=0, stroke=1)
    for angle in range(0, 360, 45):
        import math
        px = cx + 98 * math.cos(math.radians(angle))
        py = cy + 98 * math.sin(math.radians(angle))
        c.circle(px, py, 5, fill=0, stroke=1)
    dim_h(c, cx - 120, cx + 120, cy - 150, "Φ180")
    c.setFillColor(colors.HexColor("#27343b"))
    c.setFont(FONT, 9)
    c.drawString(550, 412, "8-M6 均布 PCD140")
    c.drawString(550, 394, "轴承孔 Φ72 H6")
    c.drawString(550, 376, "端面跳动 0.02")
    notes(c, ["调质处理 28-32HRC。", "发黑处理，油封面不得残留氧化皮。", "轴承孔 Ra0.8，端面 Ra1.6。", "精加工后进行三坐标全尺寸检测。"]) 
    c.save()


def write_step(path, name, size, material, shape="box"):
    lx, ly, lz = size
    body = f"""ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('XIBOSI DEMO MODEL - NOT FOR PRODUCTION'),'2;1');
FILE_NAME('{path.name}','2026-07-20T14:00:00',('Demo'),('Xibosi Precision'),'Codex','Demo Generator','');
FILE_SCHEMA(('AUTOMOTIVE_DESIGN'));
ENDSEC;
DATA;
#1=PRODUCT('{name}','{name}','DEMO {shape.upper()} MODEL - MATERIAL {material}',());
#2=CARTESIAN_POINT('ORIGIN',(0.0,0.0,0.0));
#3=CARTESIAN_POINT('MAX_POINT',({lx:.3f},{ly:.3f},{lz:.3f}));
#4=DESCRIPTIVE_REPRESENTATION_ITEM('MATERIAL','{material}');
#5=DESCRIPTIVE_REPRESENTATION_ITEM('BOUNDING_BOX','{lx:.3f} x {ly:.3f} x {lz:.3f} mm');
#6=REPRESENTATION('{name}',(#2,#3,#4,#5),$);
ENDSEC;
END-ISO-10303-21;
"""
    path.write_text(body, encoding="utf-8")


def main():
    complete = OUT / "01_完整2D+3D_伺服电机安装座"
    only_3d = OUT / "02_仅3D_分度盘连接轴"
    only_2d = OUT / "03_仅2D_钣金折弯支架"
    conflict = OUT / "04_2D与3D冲突_传感器法兰"
    full_process = OUT / "05_组合工艺_齿轮箱端盖"
    for folder in (complete, only_3d, only_2d, conflict, full_process):
        folder.mkdir(parents=True, exist_ok=True)

    draw_mounting_plate(complete / "伺服电机安装座.pdf")
    write_step(complete / "伺服电机安装座.step", "伺服电机安装座", (168, 112, 36), "6061-T6")

    write_step(only_3d / "分度盘连接轴.step", "分度盘连接轴", (45, 45, 220), "40Cr", "shaft")

    draw_bracket(only_2d / "钣金折弯支架.pdf")

    draw_flange(conflict / "传感器法兰.pdf", conflict=True)
    write_step(conflict / "传感器法兰.step", "传感器法兰", (160, 160, 18), "6061-T6", "flange")

    draw_cover(full_process / "齿轮箱端盖.pdf")
    write_step(full_process / "齿轮箱端盖.step", "齿轮箱端盖", (180, 180, 42), "40Cr", "cover")


if __name__ == "__main__":
    main()
