import { IconCheck, IconRefresh, IconSettings, IconX } from "@tabler/icons-react";

const fields = [
  { key: "setupRate", label: "准备工时费率", suffix: "元/小时", min: 0, step: 5 },
  { key: "deviceRate", label: "设备综合费率", suffix: "元/小时", min: 0, step: 5 },
  { key: "toolWearRate", label: "刀具磨损率", suffix: "%", min: 0, max: 100, step: 0.5 },
  { key: "riskRate", label: "报废风险率", suffix: "%", min: 0, max: 100, step: 0.5 },
  { key: "marginRate", label: "目标毛利率", suffix: "%", min: 0, max: 85, step: 1 },
  { key: "taxRate", label: "增值税率", suffix: "%", min: 0, max: 100, step: 1 },
  { key: "leadDays", label: "交期基准", suffix: "工作日", min: 1, max: 120, step: 1 },
];

export function RulesDrawer({ open, rules, material, onClose, onPatchRule, onPatchMaterial, onReset }) {
  if (!open) return null;
  const activeMaterial = material || "6061-T6铝合金";

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" type="button" onClick={onClose} aria-label="关闭报价规则" />
      <aside className="rules-drawer" role="dialog" aria-modal="true" aria-labelledby="rules-title">
        <header>
          <div>
            <span><IconSettings size={20} /></span>
            <div><h2 id="rules-title">报价规则</h2><p>{rules.version} · 修改后立即重算</p></div>
          </div>
          <button className="icon-action" type="button" onClick={onClose} aria-label="关闭"><IconX size={20} /></button>
        </header>

        <div className="drawer-body">
          <section>
            <div className="drawer-section-title"><h3>当前材料</h3></div>
            <label className="rule-field">
              <span>{activeMaterial} 单价</span>
              <div><input type="number" min="0" step="0.1" value={rules.materialPrices[activeMaterial] ?? 0} onChange={(event) => onPatchMaterial(activeMaterial, event.target.value)} /><em>元/kg</em></div>
            </label>
          </section>

          <section>
            <div className="drawer-section-title"><h3>制造与商务规则</h3></div>
            <div className="rule-fields">
              {fields.map((field) => (
                <label className="rule-field" key={field.key}>
                  <span>{field.label}</span>
                  <div>
                    <input type="number" min={field.min} max={field.max} step={field.step} value={rules[field.key]} onChange={(event) => onPatchRule(field.key, event.target.value)} />
                    <em>{field.suffix}</em>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <div className="formula-note">
            <strong>售价计算公式</strong>
            <p>制造成本 ÷（1 - 目标毛利率）×（1 + 税率）</p>
          </div>
        </div>

        <footer>
          <button className="secondary-action" type="button" onClick={onReset}><IconRefresh size={17} />恢复默认规则</button>
          <button className="primary-action" type="button" onClick={onClose}><IconCheck size={17} />完成</button>
        </footer>
      </aside>
    </div>
  );
}
