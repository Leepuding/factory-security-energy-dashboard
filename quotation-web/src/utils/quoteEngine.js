export function calculateQuote(analysis, rules, quantity, resolvedMaterial) {
  if (!analysis) return null;
  const material = resolvedMaterial || analysis.material;
  if (analysis.materialConflict && !resolvedMaterial) return null;

  const materialPrice = Number(rules.materialPrices[material] ?? 36.8);
  const materialCost = analysis.grossWeight * materialPrice / analysis.utilization;
  const setupCost = analysis.setupMinutes / 60 * Number(rules.setupRate);
  const machiningCost = analysis.machiningMinutes / 60 * Number(rules.deviceRate);
  const toolWear = machiningCost * Number(rules.toolWearRate) / 100;
  const directCost = materialCost + setupCost + machiningCost + toolWear + analysis.externalCost + analysis.inspectionCost + analysis.packagingCost;
  const riskCost = directCost * Number(rules.riskRate) / 100;
  const unitCost = directCost + riskCost;
  const margin = Math.min(85, Math.max(0, Number(rules.marginRate))) / 100;
  const tax = Math.max(0, Number(rules.taxRate)) / 100;
  const unitNet = unitCost / (1 - margin);
  const unitTaxed = unitNet * (1 + tax);
  const normalizedQuantity = Math.max(1, Number(quantity) || 1);

  return {
    material,
    unitCost,
    unitNet,
    unitTaxed,
    totalTaxed: unitTaxed * normalizedQuantity,
    quantity: normalizedQuantity,
    leadDays: Math.max(1, Number(rules.leadDays) + Number(analysis.leadOffset || 0)),
    costRows: [
      { category: "材料费", item: `${material}毛坯`, basis: `${analysis.grossWeight}kg × ¥${materialPrice.toFixed(2)}/kg ÷ ${(analysis.utilization * 100).toFixed(0)}%`, amount: materialCost },
      { category: "加工费", item: analysis.processRoute.slice(0, 3).join("、"), basis: `${analysis.setupMinutes}min准备 + ${analysis.machiningMinutes}min加工`, amount: setupCost + machiningCost },
      { category: "刀具磨损", item: "刀具与工装分摊", basis: `加工费 × ${Number(rules.toolWearRate).toFixed(1)}%`, amount: toolWear },
      { category: "外协费", item: analysis.processRoute.filter((item) => /阳极|发黑|调质|拉丝|清洗/.test(item)).join("、") || "标准表面处理", basis: "外协价格规则与最低批次费分摊", amount: analysis.externalCost },
      { category: "检测费", item: "尺寸与关键特征检测", basis: "检测项目与设备费率", amount: analysis.inspectionCost },
      { category: "包装费", item: "成品防护包装", basis: "单件包装分摊", amount: analysis.packagingCost },
      { category: "风险费用", item: "复杂度与报废风险", basis: `直接成本 × ${Number(rules.riskRate).toFixed(1)}%`, amount: riskCost },
    ],
  };
}

export const money = (value) => new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 2,
}).format(Number(value || 0));

export function exportQuote(result, analysis, rules) {
  if (!result) return;
  const rows = [
    ["非标件 AI 自动报价演示单", ""],
    ["零件名称", analysis.partName],
    ["规则版本", rules.version],
    ["材料", result.material],
    ["数量", result.quantity],
    ["预计交期", `${result.leadDays}个工作日`],
    ["制造成本", result.unitCost.toFixed(2)],
    ["未税单价", result.unitNet.toFixed(2)],
    ["含税单价", result.unitTaxed.toFixed(2)],
    ["含税总价", result.totalTaxed.toFixed(2)],
    ...result.costRows.map((row) => [row.category, `${row.item}｜${row.basis}｜${row.amount.toFixed(2)}`]),
  ];
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? "")}</td>`).join("")}</tr>`).join("")}</table></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${analysis.partName}-AI报价演示.xls`;
  link.click();
  URL.revokeObjectURL(link.href);
}

