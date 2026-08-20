export const defaultRules = {
  version: "RQ-2026.07.2",
  materialPrices: {
    "6061-T6铝合金": 36.8,
    "7075-T6铝合金": 62.5,
    "SUS304": 24.6,
    "40Cr": 8.9,
    "Q235B": 5.6,
    "TC4钛合金": 218,
  },
  setupRate: 90,
  deviceRate: 120,
  toolWearRate: 8,
  riskRate: 3,
  marginRate: 28,
  taxRate: 13,
  leadDays: 8,
};

const profiles = [
  {
    match: ["伺服电机安装座"],
    partName: "伺服电机安装座",
    material: "6061-T6铝合金",
    dimensions: "168 × 112 × 36 mm",
    weight: 1.86,
    grossWeight: 2.31,
    utilization: 0.84,
    tolerance: "关键孔 Φ52 H7，位置度 Φ0.05",
    roughness: "关键孔 Ra1.6，其余 Ra3.2",
    surface: "本色阳极氧化，膜厚 10-15μm",
    confidence: 94,
    features: ["深腔 ×2", "通孔 ×8", "螺纹孔 ×4", "台阶面 ×3"],
    warnings: ["Φ52 H7 孔位置度建议生产前人工复核"],
    processRoute: ["型材下料", "CNC粗铣", "CNC精铣", "钻孔/攻丝", "阳极氧化", "三坐标检测"],
    setupMinutes: 20,
    machiningMinutes: 102,
    externalCost: 38,
    inspectionCost: 24,
    packagingCost: 8,
    leadOffset: 0,
  },
  {
    match: ["分度盘连接轴"],
    partName: "分度盘连接轴",
    material: "40Cr",
    dimensions: "Φ45 × 220 mm",
    weight: 2.78,
    grossWeight: 3.35,
    utilization: 0.82,
    tolerance: "轴径 -0.015/-0.028 mm",
    roughness: "配合外圆 Ra0.8",
    surface: "调质 28-32HRC，发黑",
    confidence: 88,
    features: ["外圆 ×4", "轴肩 ×3", "键槽 ×1", "中心孔 ×2"],
    warnings: [],
    processRoute: ["圆钢下料", "数控车削", "铣键槽", "调质", "外圆磨削", "发黑"],
    setupMinutes: 18,
    machiningMinutes: 76,
    externalCost: 37,
    inspectionCost: 16,
    packagingCost: 6,
    leadOffset: 2,
  },
  {
    match: ["钣金折弯支架"],
    partName: "钣金折弯支架",
    material: "SUS304",
    dimensions: "展开 150 × 90 × 2 mm",
    weight: 0.22,
    grossWeight: 0.31,
    utilization: 0.78,
    tolerance: "未注线性尺寸 ±0.20 mm",
    roughness: "表面拉丝",
    surface: "去毛刺，拉丝纹路沿长边",
    confidence: 86,
    features: ["激光切割", "通孔 ×4", "折弯 ×2", "内R2"],
    warnings: [],
    processRoute: ["板材套料", "激光下料", "去毛刺", "数控折弯", "表面拉丝"],
    setupMinutes: 10,
    machiningMinutes: 16,
    externalCost: 8,
    inspectionCost: 5,
    packagingCost: 3,
    leadOffset: -1,
  },
  {
    match: ["传感器法兰"],
    partName: "传感器法兰",
    material: "TC4钛合金",
    dimensions: "Φ160 × 18 mm",
    weight: 1.42,
    grossWeight: 1.78,
    utilization: 0.75,
    tolerance: "中心孔 Φ58 H7，同轴度 Φ0.03",
    roughness: "密封面 Ra0.8",
    surface: "真空清洗后独立包装",
    confidence: 71,
    features: ["中心孔 ×1", "均布孔 ×4", "密封面 ×1"],
    warnings: ["2D 标注 TC4钛合金，3D 属性标注 6061-T6，材料信息冲突"],
    processRoute: ["圆料下料", "数控车削", "精铣孔系", "密封面精加工", "真空清洗", "洁净包装"],
    setupMinutes: 22,
    machiningMinutes: 84,
    externalCost: 35,
    inspectionCost: 28,
    packagingCost: 35,
    leadOffset: 4,
    materialConflict: ["TC4钛合金", "6061-T6铝合金"],
  },
  {
    match: ["齿轮箱端盖"],
    partName: "齿轮箱端盖",
    material: "40Cr",
    dimensions: "Φ180 × 42 mm",
    weight: 5.18,
    grossWeight: 6.4,
    utilization: 0.76,
    tolerance: "轴承孔 Φ72 H6，端面跳动 0.02",
    roughness: "轴承孔 Ra0.8，端面 Ra1.6",
    surface: "调质 28-32HRC，发黑",
    confidence: 92,
    features: ["轴承孔 ×1", "均布螺纹孔 ×8", "环形台阶 ×2"],
    warnings: [],
    processRoute: ["锻料下料", "粗车", "CNC铣削", "调质", "精车", "内圆磨", "发黑", "三坐标检测"],
    setupMinutes: 28,
    machiningMinutes: 148,
    externalCost: 74,
    inspectionCost: 36,
    packagingCost: 12,
    leadOffset: 4,
  },
];

const genericProfile = {
  partName: "未命名机械零件",
  material: "6061-T6铝合金",
  dimensions: "142 × 86 × 28 mm",
  weight: 1.42,
  grossWeight: 1.85,
  utilization: 0.82,
  tolerance: "关键尺寸 ±0.03 mm",
  roughness: "Ra1.6",
  surface: "本色阳极氧化",
  confidence: 82,
  features: ["型腔 ×1", "通孔 ×6", "螺纹孔 ×4"],
  warnings: ["当前文件未匹配演示样例，已采用通用 CNC 规则估算"],
  processRoute: ["毛坯下料", "CNC粗加工", "CNC精加工", "钻孔/攻丝", "表面处理", "尺寸检测"],
  setupMinutes: 18,
  machiningMinutes: 88,
  externalCost: 32,
  inspectionCost: 20,
  packagingCost: 8,
  leadOffset: 0,
};

const drawingExtensions = new Set(["pdf", "dwg", "dxf"]);
const modelExtensions = new Set(["step", "stp", "igs", "iges"]);

export function analyzeDemoFiles(files) {
  const names = files.map((file) => file.name);
  const joinedNames = names.join(" ");
  const matched = profiles.find((profile) => profile.match.some((keyword) => joinedNames.includes(keyword)));
  const profile = structuredClone(matched || genericProfile);
  const has2d = files.some((file) => drawingExtensions.has(file.name.split(".").pop()?.toLowerCase()));
  const has3d = files.some((file) => modelExtensions.has(file.name.split(".").pop()?.toLowerCase()));

  if (!matched) {
    const inferredName = names[0]?.replace(/\.[^.]+$/, "").trim();
    if (inferredName) profile.partName = inferredName;
  }
  if (!has2d) {
    profile.confidence = Math.min(profile.confidence, 68);
    profile.warnings = [...profile.warnings, "缺少 2D 图纸，材料、公差和表面要求采用默认参数"];
  }
  if (!has3d) {
    profile.confidence = Math.min(profile.confidence, 66);
    profile.warnings = [...profile.warnings, "缺少 3D 图纸，体积、重量和加工特征由 AI 估算"];
  }

  return { ...profile, files: names, has2d, has3d };
}

export const parsingSteps = [
  { title: "文件完整性检查", detail: "校验格式、同名配对与图纸可读性" },
  { title: "3D 几何特征识别", detail: "提取尺寸、重量、孔槽、台阶与型腔" },
  { title: "2D 技术要求识别", detail: "识别材料、公差、粗糙度与表面处理" },
  { title: "生成建议工艺路线", detail: "匹配设备能力、工序顺序和外协项目" },
  { title: "执行报价规则", detail: "计算材料、加工、损耗、风险和销售价格" },
];

export const acceptedExtensions = new Set([...drawingExtensions, ...modelExtensions]);
export { drawingExtensions, modelExtensions };

