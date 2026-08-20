import { IconBook2, IconCalculator, IconCheck, IconChevronRight } from "@tabler/icons-react";

const steps = [
  { key: "upload", label: "上传图纸" },
  { key: "parsing", label: "AI 识别解析" },
  { key: "result", label: "查看报价" },
];

const stageIndex = { upload: 0, error: 0, parsing: 1, result: 2 };

export function SinglePageShell({ stage, rules, onOpenRules, children }) {
  const activeIndex = stageIndex[stage] ?? 0;
  return (
    <div className="single-app">
      <header className="simple-header">
        <div className="simple-brand">
          <span><IconCalculator size={23} stroke={1.8} /></span>
          <div><strong>智报价</strong><small>非标件 AI 自动报价</small></div>
        </div>
        <button className="rule-entry" type="button" onClick={onOpenRules}>
          <IconBook2 size={18} />
          <span><small>当前报价规则</small><strong>{rules.version}</strong></span>
          <IconChevronRight size={17} />
        </button>
      </header>

      <main className="single-main">
        <section className="single-intro">
          <div>
            <h1>上传图纸，快速获得可解释报价</h1>
          </div>
          <div className="simple-flow" aria-label="报价流程">
            {steps.map((item, index) => (
              <div key={item.key} className={index < activeIndex ? "done" : index === activeIndex ? "active" : ""}>
                <span>{index < activeIndex ? <IconCheck size={15} stroke={2.2} /> : index + 1}</span>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        </section>
        {children}
      </main>

    </div>
  );
}
