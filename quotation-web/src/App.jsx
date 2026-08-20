import { useEffect, useMemo, useState } from "react";
import { ParsingStage } from "./components/ParsingStage.jsx";
import { QuoteResult } from "./components/QuoteResult.jsx";
import { RulesDrawer } from "./components/RulesDrawer.jsx";
import { SinglePageShell } from "./components/SinglePageShell.jsx";
import { UploadStage } from "./components/UploadStage.jsx";
import { analyzeDemoFiles, defaultRules, drawingExtensions, modelExtensions } from "./data/demoProfiles.js";
import { calculateQuote, exportQuote } from "./utils/quoteEngine.js";

const cloneDefaultRules = () => structuredClone(defaultRules);

export function App() {
  const [stage, setStage] = useState("upload");
  const [files, setFiles] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [resolvedMaterial, setResolvedMaterial] = useState(null);
  const [rules, setRules] = useState(cloneDefaultRules);
  const [rulesOpen, setRulesOpen] = useState(false);

  const quote = useMemo(
    () => calculateQuote(analysis, rules, quantity, resolvedMaterial),
    [analysis, rules, quantity, resolvedMaterial],
  );

  useEffect(() => {
    if (stage !== "parsing") return undefined;
    setActiveStep(0);
    let nextStep = 0;
    const timer = window.setInterval(() => {
      nextStep += 1;
      if (nextStep >= 5) {
        window.clearInterval(timer);
        const parsed = analyzeDemoFiles(files);
        setAnalysis(parsed);
        setResolvedMaterial(null);
        setStage("result");
      } else {
        setActiveStep(nextStep);
      }
    }, 760);
    return () => window.clearInterval(timer);
  }, [stage, files]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setRulesOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function updateFiles(nextFiles) {
    setFiles(nextFiles);
    setError("");
    setStage("upload");
  }

  function validateAndStart() {
    if (!files.length) {
      setError("请先上传至少一个 2D 或 3D 图纸文件。");
      setStage("error");
      return;
    }
    if (!Number(quantity) || Number(quantity) < 1) {
      setError("报价数量必须大于 0。");
      setStage("error");
      return;
    }
    const has2d = files.some((file) => drawingExtensions.has(file.name.split(".").pop()?.toLowerCase()));
    const has3d = files.some((file) => modelExtensions.has(file.name.split(".").pop()?.toLowerCase()));
    if (has2d && has3d) {
      const baseNames = new Set(files.map((file) => file.name.replace(/\.[^.]+$/, "").trim().toLowerCase()));
      if (baseNames.size > 1) {
        setError("2D 与 3D 图纸名称不一致，请确保同一零件使用相同文件名。");
        setStage("error");
        return;
      }
    }
    setError("");
    setStage("parsing");
  }

  function restart() {
    setStage("upload");
    setFiles([]);
    setQuantity(1);
    setError("");
    setAnalysis(null);
    setResolvedMaterial(null);
    setActiveStep(0);
  }

  function patchRule(key, value) {
    setRules((current) => ({ ...current, [key]: value === "" ? 0 : Number(value) }));
  }

  function patchMaterial(material, value) {
    setRules((current) => ({
      ...current,
      materialPrices: { ...current.materialPrices, [material]: value === "" ? 0 : Number(value) },
    }));
  }

  const materialForRules = resolvedMaterial || analysis?.material || "6061-T6铝合金";

  return (
    <SinglePageShell stage={stage} rules={rules} onOpenRules={() => setRulesOpen(true)}>
      {(stage === "upload" || stage === "error") && (
        <UploadStage
          files={files}
          quantity={quantity}
          error={error}
          onFilesChange={updateFiles}
          onQuantityChange={(value) => { setQuantity(value); setError(""); setStage("upload"); }}
          onFileError={(message) => { setError(message); setStage("error"); }}
          onStart={validateAndStart}
        />
      )}
      {stage === "parsing" && <ParsingStage activeStep={activeStep} files={files} />}
      {stage === "result" && analysis && (
        <QuoteResult
          analysis={analysis}
          quote={quote}
          quantity={Math.max(1, Number(quantity) || 1)}
          rules={rules}
          resolvedMaterial={resolvedMaterial}
          onResolveMaterial={setResolvedMaterial}
          onReset={restart}
          onExport={() => exportQuote(quote, analysis, rules)}
          onOpenRules={() => setRulesOpen(true)}
        />
      )}
      <RulesDrawer
        open={rulesOpen}
        rules={rules}
        material={materialForRules}
        onClose={() => setRulesOpen(false)}
        onPatchRule={patchRule}
        onPatchMaterial={patchMaterial}
        onReset={() => setRules(cloneDefaultRules())}
      />
    </SinglePageShell>
  );
}
