import { IconCheck, IconLoader2, IconSparkles } from "@tabler/icons-react";
import { parsingSteps } from "../data/demoProfiles.js";

export function ParsingStage({ activeStep, files }) {
  const progress = Math.min(100, Math.round(((activeStep + 1) / parsingSteps.length) * 100));
  return (
    <section className="parsing-stage stage-surface" aria-live="polite">
      <div className="ai-orbit"><IconSparkles size={34} /><i><IconLoader2 size={64} /></i></div>
      <h2>AI 正在识别图纸并计算报价</h2>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <strong className="progress-value">{progress}%</strong>

      <div className="parsing-list">
        {parsingSteps.map((item, index) => (
          <div key={item.title} className={index < activeStep ? "done" : index === activeStep ? "active" : ""}>
            <span>{index < activeStep ? <IconCheck size={16} /> : index === activeStep ? <IconLoader2 className="spin" size={17} /> : index + 1}</span>
            <div><strong>{item.title}</strong><small>{item.detail}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
}
