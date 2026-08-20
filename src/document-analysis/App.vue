<template>
  <main class="analysis-page">
    <header class="analysis-header">
      <a class="back-link" href="/" title="返回智慧工厂驾驶舱">⌂</a>
      <div class="brand-block"><span class="brand-orbit">✦</span><div><h1>AI 文档分析与辅助决策</h1><p>DOCUMENT INTELLIGENCE / DECISION CONSOLE</p></div></div>
      <div class="header-status"><span class="online-dot" :class="{ muted: !workspace.apiOnline }"></span>{{ workspace.apiOnline ? "分析服务已连接" : "演示模式" }}<span class="header-divider"></span><span>临时知识库</span></div>
    </header>
    <section class="analysis-layout">
      <aside class="side-panel knowledge-panel">
        <div class="panel-heading"><div><span class="eyebrow">KNOWLEDGE BASE</span><h2>文档知识库</h2></div><span class="count-badge">{{ documents.length }} / 30</span></div>
        <div class="daily-usage"><span>今日解析额度</span><strong>{{ usage ? `${usage.used} / ${usage.limit}` : "加载中" }}</strong><small v-if="usage">还可解析 {{ usage.remaining }} 份</small></div>
        <el-upload class="upload-zone" drag action="#" :auto-upload="false" :limit="uploadLimit" :disabled="usage?.remaining === 0" accept=".pdf,.docx,.xlsx,.txt,.csv" multiple :show-file-list="false" :on-change="handleFileChange" :on-exceed="handleFileLimit"><div class="upload-icon">↑</div><strong>上传待分析资料</strong><span>PDF、DOCX、XLSX、TXT、CSV</span><small>单文件不超过 20MB，单次最多 {{ uploadLimit }} 个</small></el-upload>
        <div v-if="pendingFiles.length" class="pending-files"><div class="pending-files__title">已选择 {{ pendingFiles.length }} 个文件</div><div v-for="file in pendingFiles" :key="file.uid" class="pending-file"><span>{{ file.name }}</span><small>{{ formatFileSize(file.size) }}</small></div><el-button type="primary" size="small" :loading="uploading" :disabled="usage?.remaining === 0" @click="submitFiles">开始上传并解析</el-button></div>
        <el-alert v-if="uploadError" class="upload-error" :title="uploadError" type="warning" :closable="false" show-icon />
        <div class="scope-card"><span>当前分析范围</span><el-radio-group v-model="workspace.scope" size="small"><el-radio-button value="all" @click="workspace.selectAll">全部知识库</el-radio-button><el-radio-button value="selected">单份文档</el-radio-button></el-radio-group></div>
        <div v-if="!documents.length" class="empty-library"><div class="empty-orb">⌘</div><strong>等待资料接入</strong></div>
        <div v-else class="document-list"><div v-for="document in documents" :key="document.id" class="document-entry" :class="{ 'is-selected': workspace.selectedDocumentId === document.id }"><button class="document-item" type="button" @click="workspace.selectDocument(document.id)"><span class="document-icon">{{ document.file_type.toUpperCase() }}</span><span class="document-copy"><strong>{{ document.original_name }}</strong><small><i class="document-state" :class="`is-${document.status}`"></i>{{ documentStatusText(document.status) }}</small></span></button><el-button text size="small" :loading="reparsingId === document.id" @click="reparse(document)">重新解析</el-button></div></div>
      </aside>
      <section class="assistant-panel">
        <div class="assistant-topbar"><div class="assistant-identity"><div><strong>文档分析</strong></div></div><div class="analysis-phase" :class="{ 'is-ready': answer }"><span></span>{{ answer ? "结论已形成" : "等待资料" }}</div><el-button plain class="admin-button" @click="settingsVisible = true">⚙ 管理设置</el-button><el-button type="primary" plain @click="generateReport">生成报告</el-button></div>
        <div class="conversation-area"><div v-if="!answer" class="welcome-card"><div class="ai-avatar"><span>AI</span></div><div class="welcome-copy"><span class="eyebrow">READY FOR ANALYSIS</span><h2>上传资料后，我会帮你提炼依据并形成决策建议。</h2></div></div><div v-if="answer" class="answer-card"><span class="eyebrow">DOCUMENT-BASED ANSWER</span><h2>{{ answer.title }}</h2><p class="answer-summary">{{ answer.summary }}</p><div v-if="answer.metrics.length" class="metric-grid"><article v-for="metric in answer.metrics" :key="metric.name"><span>{{ metric.name }}</span><strong>{{ metric.value }}{{ metric.unit }}</strong><small>{{ metric.source }}</small></article></div><section v-for="section in answer.sections" :key="section.title" class="answer-section"><h3>{{ section.title }}</h3><p>{{ section.content }}</p></section><AnswerChart v-for="(chart,index) in answer.charts" :key="chart.title + index" :chart="chart" /><section v-if="answer.risks.length" class="insight-list risks"><h3>风险提示</h3><article v-for="risk in answer.risks" :key="risk.title"><strong>{{ risk.title }}</strong><p>{{ risk.description }}</p><small>{{ risk.source }}</small></article></section><section v-if="answer.decisions.length" class="insight-list decisions"><h3>决策建议</h3><article v-for="decision in answer.decisions" :key="decision.title"><strong>{{ decision.title }}</strong><p>{{ decision.description }}</p><small v-if="decision.basis">依据：{{ decision.basis }}</small><small>{{ decision.source }}</small></article></section><section v-if="answer.citations.length" class="citation-section"><h3>引用来源</h3><article v-for="citation in answer.citations" :key="citation.document_name + citation.location"><strong>{{ citation.document_name }} · {{ citation.location }}</strong><p>{{ citation.content }}</p></article></section></div><div class="suggestion-grid"><button v-for="question in suggestedQuestions" :key="question" type="button" @click="draft = question">{{ question }} <span>↗</span></button></div></div>
        <div class="prompt-area"><el-input v-model="draft" type="textarea" :rows="2" resize="none" placeholder="例如：总结当前资料中的重点问题，并给出可执行建议" @keydown.enter.exact.prevent="sendDraft" /><div class="prompt-footer"><span>仅依据当前上传的文档与知识库回答</span><el-button type="primary" :loading="asking" :disabled="!draft.trim()" @click="sendDraft">开始分析 <span>➜</span></el-button></div></div>
      </section>
      <aside class="side-panel report-panel"><div class="panel-heading"><div><span class="eyebrow">DECISION BOARD</span><h2>决策摘要</h2></div><span class="report-status" :class="{ 'is-ready': reportGenerated }">{{ reportGenerated ? "报告已就绪" : "等待结论" }}</span></div><div class="report-scope"><span>当前研判范围</span><strong>{{ workspace.scope === "selected" ? "单份文档" : "全部知识库" }}</strong></div><div class="report-metrics"><div><strong>{{ answer?.metrics.length || 0 }}</strong><span>关键指标</span></div><div><strong>{{ answer?.risks.length || 0 }}</strong><span>待关注风险</span></div><div><strong>{{ answer?.citations.length || 0 }}</strong><span>证据来源</span></div></div><div class="decision-status"><span>证据完整度</span><strong>{{ answer?.citations.length ? "已建立来源链路" : "等待文档证据" }}</strong><i :class="{ 'is-complete': Boolean(answer?.citations.length) }"></i></div><div class="report-preview" :class="{ 'report-preview--ready': reportGenerated }"><template v-if="reportGenerated && answer"><span class="preview-icon">▤</span><strong>{{ answer.title }}</strong><p>{{ answer.summary }}</p></template><template v-else><div class="preview-glow"></div><span class="preview-icon">▤</span><strong>决策报告待生成</strong></template></div><el-button class="export-button" :disabled="!reportGenerated" @click="exportReport">导出 PDF 报告</el-button></aside>
    </section>
    <el-drawer v-model="settingsVisible" title="模型与服务设置" size="420px" class="admin-drawer" @open="loadModelConfig">
      <p class="admin-intro">该设置会立即应用到本演示系统的文档问答。已保存的 API Key 不会明文展示。</p>
      <el-form label-position="top">
        <el-form-item label="模型厂商"><el-select v-model="modelForm.provider" @change="applyProviderDefaults"><el-option v-for="item in providerOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item>
        <el-form-item label="模型名称"><el-input v-model="modelForm.model" placeholder="例如 deepseek-chat" /></el-form-item>
        <el-form-item v-if="modelForm.provider === 'compatible'" label="兼容 API Base URL"><el-input v-model="modelForm.api_base" placeholder="https://example.com/v1" /></el-form-item>
        <el-form-item :label="modelConfig?.api_key_configured ? `API Key（${modelConfig.api_key_mask}）` : 'API Key'"><el-input v-model="modelForm.api_key" type="password" show-password :placeholder="modelConfig?.api_key_configured ? '留空则继续使用已保存 Key' : '请输入 API Key'" autocomplete="new-password" /></el-form-item>
      </el-form>
      <el-alert v-if="modelTestMessage" :title="modelTestMessage" :type="modelTestPassed ? 'success' : 'warning'" :closable="false" show-icon />
      <template #footer><el-button :loading="testingModel" @click="testCurrentModel">测试连接</el-button><el-button type="primary" :loading="savingModel" :disabled="!modelTestPassed" @click="saveCurrentModel">保存并生效</el-button></template>
    </el-drawer>
  </main>
</template>

<script setup lang="ts">
import { computed, h, nextTick, onMounted, ref, render } from "vue";
import { ElMessage } from "element-plus";
import { DataAnalysis, DocumentChecked, Download, MagicStick, Promotion, Reading, Setting, UploadFilled, WarningFilled } from "@element-plus/icons-vue";
import type { UploadFile, UploadFiles, UploadProps } from "element-plus";
import { askQuestion, checkApiHealth, getDailyUsage, getDocuments, getModelConfig, reparseDocument, saveModelConfig, testModelConfig, uploadDocuments, type ChatAnswer, type DailyUsage, type DocumentRecord, type ModelConfig, type ModelConfigInput, type ModelProvider } from "./api/client";
import { useWorkspaceStore } from "./stores/workspace";
import AnswerChart from "./components/AnswerChart.vue";
const workspace = useWorkspaceStore();
const draft = ref("");
const pendingFiles = ref<UploadFile[]>([]);
const documents = ref<DocumentRecord[]>([]);
const uploadError = ref("");
const uploading = ref(false);
const answer = ref<ChatAnswer | null>(null);
const asking = ref(false);
const reparsingId = ref<string | null>(null);
const reportGenerated = ref(false);
const usage = ref<DailyUsage | null>(null);
const settingsVisible = ref(false);
const modelConfig = ref<ModelConfig | null>(null);
const modelForm = ref<ModelConfigInput>({ provider: "deepseek", model: "deepseek-chat", api_base: "https://api.deepseek.com/v1", api_key: "" });
const testingModel = ref(false);
const savingModel = ref(false);
const modelTestPassed = ref(false);
const modelTestMessage = ref("");
const providerOptions: Array<{ value: ModelProvider; label: string; model: string; apiBase: string }> = [
  { value: "openai", label: "OpenAI", model: "gpt-4o-mini", apiBase: "https://api.openai.com/v1" },
  { value: "deepseek", label: "DeepSeek", model: "deepseek-chat", apiBase: "https://api.deepseek.com/v1" },
  { value: "qwen", label: "通义千问", model: "qwen-plus", apiBase: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  { value: "compatible", label: "兼容 API", model: "", apiBase: "" },
];
const uploadLimit = computed(() => usage.value ? Math.max(1, Math.min(5, usage.value.remaining)) : 5);
const suggestedQuestions = ["请概括这批资料的核心结论", "提取关键指标并说明数据来源", "识别潜在风险与影响", "生成一份完整分析报告"];
function documentStatusText(status: DocumentRecord["status"]) { return status === "success" ? "解析完成" : status === "failed" ? "解析失败" : status === "queued" ? "等待解析" : "正在解析"; }
async function sendDraft() {
  if (!documents.value.length) {
    ElMessage.warning("请先上传并完成文档解析。");
    return;
  }
  asking.value = true;
  try {
    answer.value = await askQuestion(draft.value.trim(), workspace.selectedDocumentId);
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.detail || "问答服务暂不可用，请稍后重试。");
  } finally { asking.value = false; }
}
function generateReport() {
  if (!documents.value.some((document) => document.status === "success")) { ElMessage.warning("请先完成文档解析后再生成报告。"); return; }
  if (!answer.value) { ElMessage.info("请先提交一个分析问题，报告会复用本次的指标、图表和引用。 "); return; }
  reportGenerated.value = true;
  ElMessage.success("分析报告已生成，可在右侧预览并导出。");
}
function exportReport() {
  if (!answer.value) return;
  const report = window.open("", "_blank");
  if (!report) { ElMessage.warning("浏览器拦截了报告窗口，请允许弹窗后重试。"); return; }
  const citations = answer.value.citations.map((item) => `<li><b>${escapeHtml(item.document_name)} · ${escapeHtml(item.location)}</b><br>${escapeHtml(item.content)}</li>`).join("");
  const metrics = answer.value.metrics.map((item) => `<li><b>${escapeHtml(item.name)}：</b>${escapeHtml(String(item.value))}${escapeHtml(item.unit)}</li>`).join("");
  report.document.write(`<html><head><title>${escapeHtml(answer.value.title)}</title><style>body{font-family:Arial,"Microsoft YaHei",sans-serif;color:#173b68;padding:36px;line-height:1.7}h1{color:#175fc5}h2{margin-top:28px;border-bottom:1px solid #dceafb;padding-bottom:8px}li{margin:8px 0}.note{color:#6683a6}</style></head><body><h1>${escapeHtml(answer.value.title)}</h1><p class="note">生成时间：${new Date().toLocaleString("zh-CN")}；资料范围：当前临时知识库</p><h2>报告概述</h2><p>${escapeHtml(answer.value.summary)}</p><h2>核心指标</h2><ul>${metrics}</ul><h2>分析正文</h2>${answer.value.sections.map((item) => `<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.content)}</p>`).join("")}<h2>数据来源</h2><ul>${citations}</ul></body></html>`);
  report.document.close(); report.focus(); window.setTimeout(() => report.print(), 300);
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] || char); }
const handleFileChange: UploadProps["onChange"] = (file: UploadFile, files: UploadFiles) => {
  const selected = files.filter((item) => item.raw);
  if (usage.value && selected.length > usage.value.remaining) {
    pendingFiles.value = selected.slice(0, usage.value.remaining);
    uploadError.value = `今日还可解析 ${usage.value.remaining} 份文件，请减少本次选择数量。`;
    return;
  }
  pendingFiles.value = selected;
  uploadError.value = "";
  if (file.size && file.size > 20 * 1024 * 1024) uploadError.value = "文件超过 20MB 限制，请重新选择。";
};
function handleFileLimit() { ElMessage.warning(`本次最多选择 ${uploadLimit.value} 个文件。`); }
function formatFileSize(size?: number) { return ((size || 0) / 1024 / 1024).toFixed(2) + " MB"; }
async function refreshDocuments() { documents.value = await getDocuments(); }
async function refreshUsage() { usage.value = await getDailyUsage(); }
async function waitForParsing() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    await refreshDocuments();
    if (documents.value.every((document) => document.status === "success" || document.status === "failed")) return;
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
  }
}
async function submitFiles() {
  const files = pendingFiles.value.map((item) => item.raw).filter((item): item is File => Boolean(item));
  if (!files.length || uploading.value) return;
  uploading.value = true;
  uploadError.value = "";
  try {
    await uploadDocuments(files);
    pendingFiles.value = [];
    await refreshUsage();
    await refreshDocuments();
    await waitForParsing();
    ElMessage.success("文件解析已完成。");
  } catch (error: any) {
    uploadError.value = error?.response?.data?.detail || "分析服务尚未部署或暂不可用，文件未上传。";
    await refreshUsage().catch(() => undefined);
  } finally { uploading.value = false; }
}
function applyProviderDefaults(provider: ModelProvider) {
  const preset = providerOptions.find((item) => item.value === provider);
  if (!preset) return;
  modelForm.value.model = preset.model;
  modelForm.value.api_base = preset.apiBase;
  modelTestPassed.value = false;
  modelTestMessage.value = "";
}
async function loadModelConfig() {
  modelTestPassed.value = false;
  modelTestMessage.value = "";
  try {
    modelConfig.value = await getModelConfig();
    modelForm.value = { provider: modelConfig.value.provider, model: modelConfig.value.model, api_base: modelConfig.value.api_base, api_key: "" };
  } catch (error: any) { ElMessage.error(error?.response?.data?.detail || "无法读取模型设置。"); }
}
function modelPayload(): ModelConfigInput {
  return { ...modelForm.value, api_key: modelForm.value.api_key?.trim() || undefined };
}
async function testCurrentModel() {
  testingModel.value = true;
  modelTestPassed.value = false;
  modelTestMessage.value = "";
  try { const result = await testModelConfig(modelPayload()); modelTestPassed.value = true; modelTestMessage.value = result.message; }
  catch (error: any) { modelTestMessage.value = error?.response?.data?.detail || "模型连接测试失败。"; }
  finally { testingModel.value = false; }
}
async function saveCurrentModel() {
  savingModel.value = true;
  try { modelConfig.value = await saveModelConfig(modelPayload()); modelForm.value.api_key = ""; modelTestMessage.value = "设置已保存并立即生效。"; ElMessage.success("模型设置已生效。"); }
  catch (error: any) { ElMessage.error(error?.response?.data?.detail || "保存模型设置失败。"); }
  finally { savingModel.value = false; }
}
async function reparse(document: DocumentRecord) {
  if (reparsingId.value) return;
  reparsingId.value = document.id;
  try {
    await reparseDocument(document.id);
    await waitForParsing();
    ElMessage.success(`${document.original_name} 已按最新规则重新解析。`);
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.detail || "重新解析失败，请稍后重试。");
  } finally { reparsingId.value = null; }
}
function mountIcon(selector: string, icon: object, index = 0) {
  const element = document.querySelectorAll<HTMLElement>(selector)[index];
  if (!element || element.querySelector(".workspace-action-icon")) return;
  const target = document.createElement("span");
  target.className = "workspace-action-icon";
  element.prepend(target);
  render(h(icon), target);
}

function mountWorkspaceIcons() {
  mountIcon(".upload-icon", UploadFilled);
  mountIcon(".empty-orb", MagicStick);
  mountIcon(".admin-button", Setting);
  mountIcon(".assistant-topbar .el-button--primary", DocumentChecked);
  mountIcon(".suggestion-grid button", Reading, 0);
  mountIcon(".suggestion-grid button", DataAnalysis, 1);
  mountIcon(".suggestion-grid button", WarningFilled, 2);
  mountIcon(".suggestion-grid button", DocumentChecked, 3);
  mountIcon(".prompt-footer .el-button", Promotion);
  mountIcon(".export-button", Download);
}

onMounted(async () => {
  try { await checkApiHealth(); workspace.apiOnline = true; await Promise.all([refreshDocuments(), refreshUsage()]); } catch { workspace.apiOnline = false; }
  await nextTick();
  mountWorkspaceIcons();
});
</script>
