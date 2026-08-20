import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconDownload,
  IconFile3d,
  IconFileTypePdf,
  IconRefresh,
  IconRoute,
  IconSettings,
} from "@tabler/icons-react";
import { modelExtensions } from "../data/demoProfiles.js";
import { money } from "../utils/quoteEngine.js";

export function QuoteResult({ analysis, quote, quantity, rules, resolvedMaterial, onResolveMaterial, onReset, onExport, onOpenRules }) {
  const conflictPending = Boolean(analysis.materialConflict && !resolvedMaterial);
  const fields = [
    ["材料", resolvedMaterial || analysis.material],
    ["外形尺寸", analysis.dimensions],
    ["成品重量", `${analysis.weight.toFixed(2)} kg`],
    ["尺寸与形位公差", analysis.tolerance],
    ["表面粗糙度", analysis.roughness],
    ["表面处理", analysis.surface],
  ];

  return (
    <section className="result-stage stage-surface">
      <header className="result-heading">
        <div className="result-title">
          <span className={conflictPending ? "result-icon warning" : "result-icon"}>{conflictPending ? <IconAlertTriangle size={23} /> : <IconCircleCheck size={23} />}</span>
          <div>
            <h2>{conflictPending ? "识别完成，等待确认材料" : "AI 报价已生成"}</h2>
            <p>{analysis.partName} · 规则 {rules.version} · 演示估算价</p>
          </div>
        </div>
        <div className="result-actions">
          <button className="secondary-action" type="button" onClick={onReset}><IconRefresh size={17} />重新上传</button>
          <button className="secondary-action" type="button" onClick={onOpenRules}><IconSettings size={17} />调整规则</button>
          <button className="primary-action" type="button" onClick={onExport} disabled={!quote}><IconDownload size={17} />导出报价</button>
        </div>
      </header>

      {conflictPending ? (
        <div className="conflict-panel" role="alert">
          <IconAlertTriangle size={23} />
          <div><strong>2D 与 3D 图纸材料信息冲突，报价金额已暂停生成</strong><p>请选择本次报价使用的正确材料。确认后将立即按照当前规则计算，无需重新识别图纸。</p>
            <div className="material-choices">
              {analysis.materialConflict.map((material) => <button type="button" key={material} onClick={() => onResolveMaterial(material)}>{material}</button>)}
            </div>
          </div>
        </div>
      ) : null}

      <div className="quote-kpis">
        <div><small>含税单价</small><strong>{quote ? money(quote.unitTaxed) : "待确认"}</strong><span>税率 {rules.taxRate}%</span></div>
        <div><small>报价数量</small><strong>{quantity}<em> 件</em></strong></div>
        <div className="highlight"><small>含税总价</small><strong>{quote ? money(quote.totalTaxed) : "—"}</strong><span>演示报价，仅供评估</span></div>
        <div><small>预计交期</small><strong>{quote ? quote.leadDays : rules.leadDays}<em> 个工作日</em></strong><span>从资料确认后起算</span></div>
      </div>

      <div className="result-grid">
        <div className="result-left">
          <section className="result-card recognition-card">
            <div className="card-title"><div><h3>AI 识别结果</h3></div><span className={`confidence-badge ${analysis.confidence < 75 ? "low" : ""}`}>置信度 {analysis.confidence}%</span></div>
            <div className="source-files">
              {analysis.files.map((name) => {
                const isModel = modelExtensions.has(name.split(".").pop()?.toLowerCase());
                return <span key={name}>{isModel ? <IconFile3d size={16} /> : <IconFileTypePdf size={16} />}{name}</span>;
              })}
            </div>
            <dl className="recognition-fields">
              {fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <div className="feature-block"><h4>加工特征</h4><div>{analysis.features.map((feature) => <span key={feature}>{feature}</span>)}</div></div>
          </section>

          <section className="result-card route-card">
            <div className="card-title"><div><h3>建议工艺路线</h3></div><IconRoute size={22} /></div>
            <div className="route-list">
              {analysis.processRoute.map((step, index) => <div key={`${step}-${index}`}><span>{index + 1}</span><strong>{step}</strong>{index < analysis.processRoute.length - 1 ? <i /> : null}</div>)}
            </div>
          </section>

          {analysis.warnings.length ? (
            <section className="risk-list">
              <div><IconAlertTriangle size={19} /><strong>识别与报价提示</strong></div>
              {analysis.warnings.map((warning) => <p key={warning}>{warning}</p>)}
            </section>
          ) : null}
        </div>

        <section className="result-card cost-card">
          <div className="card-title"><div><h3>报价明细</h3></div><button type="button" onClick={onOpenRules}><IconSettings size={16} />查看规则</button></div>
          {quote ? (
            <>
              <div className="cost-table-wrap">
                <table className="quote-cost-table">
                  <thead><tr><th>费用类别</th><th>计算内容</th><th>计算依据</th><th>金额</th></tr></thead>
                  <tbody>{quote.costRows.map((row) => <tr key={row.category}><td><IconCheck size={14} />{row.category}</td><td>{row.item}</td><td>{row.basis}</td><td>{money(row.amount)}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="quote-summary">
                <dl>
                  <div><dt>制造成本</dt><dd>{money(quote.unitCost)}</dd></div>
                  <div><dt>目标毛利率</dt><dd>{rules.marginRate}%</dd></div>
                  <div><dt>未税单价</dt><dd>{money(quote.unitNet)}</dd></div>
                </dl>
                <div className="summary-total"><span>含税单价</span><strong>{money(quote.unitTaxed)}</strong><small>含 {rules.taxRate}% 增值税</small></div>
              </div>
            </>
          ) : <div className="cost-paused"><IconAlertTriangle size={25} /><strong>价格计算已暂停</strong><p>确认冲突材料后，此处将显示完整费用明细。</p></div>}
        </section>
      </div>
    </section>
  );
}
