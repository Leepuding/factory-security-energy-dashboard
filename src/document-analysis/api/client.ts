import axios from "axios";

export const apiClient = axios.create({ baseURL: "/api", timeout: 65_000 });

export async function checkApiHealth() {
  const response = await apiClient.get<{ status: string; service: string }>("/health");
  return response.data;
}

export interface DocumentRecord {
  id: string;
  original_name: string;
  file_type: string;
  file_size: number;
  status: "queued" | "parsing" | "success" | "failed";
  error_message: string | null;
}

export interface ChatAnswer {
  title: string;
  summary: string;
  sections: Array<{ title: string; content: string }>;
  citations: Array<{ document_name: string; location: string; content: string }>;
  metrics: Array<{ name: string; value: string | number; unit: string; source: string }>;
  charts: Array<{ type: "line" | "bar" | "pie"; title: string; x_axis: string[]; series: Array<{ name: string; data: number[] }>; unit: string; conclusion: string; source: string }>;
  risks: Array<{ level: string; title: string; description: string; source: string }>;
  decisions: Array<{ priority: string; title: string; description: string; basis: string; source: string }>;
}

export type ModelProvider = "openai" | "deepseek" | "qwen" | "compatible";

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  api_base: string;
  api_key_configured: boolean;
  api_key_mask: string;
}

export interface ModelConfigInput {
  provider: ModelProvider;
  model: string;
  api_base: string;
  api_key?: string;
}

export interface DailyUsage { date: string; used: number; limit: number; remaining: number; }

export async function uploadDocuments(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await apiClient.post<{ documents: DocumentRecord[] }>("/documents", formData);
  return response.data;
}

export async function getDocuments() {
  const response = await apiClient.get<DocumentRecord[]>("/documents");
  return response.data;
}

export async function getDailyUsage() {
  const response = await apiClient.get<DailyUsage>("/usage/daily");
  return response.data;
}

export async function getModelConfig() {
  const response = await apiClient.get<ModelConfig>("/admin/model-config");
  return response.data;
}

export async function testModelConfig(config: ModelConfigInput) {
  const response = await apiClient.post<{ status: string; message: string }>("/admin/model-config/test", config);
  return response.data;
}

export async function saveModelConfig(config: ModelConfigInput) {
  const response = await apiClient.put<ModelConfig>("/admin/model-config", config);
  return response.data;
}

export async function reparseDocument(documentId: string) {
  const response = await apiClient.post(`/documents/${documentId}/reparse`);
  return response.data;
}

export async function askQuestion(question: string, documentId: string | null) {
  const response = await apiClient.post<ChatAnswer>("/chat", { question, document_id: documentId });
  return response.data;
}
