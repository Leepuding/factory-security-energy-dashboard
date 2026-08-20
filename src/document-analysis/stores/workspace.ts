import { defineStore } from "pinia";
import { ref } from "vue";

export type AnalysisScope = "all" | "selected";

export const useWorkspaceStore = defineStore("document-analysis-workspace", () => {
  const scope = ref<AnalysisScope>("all");
  const selectedDocumentId = ref<string | null>(null);
  const apiOnline = ref(false);
  function selectAll() { scope.value = "all"; selectedDocumentId.value = null; }
  function selectDocument(id: string) { scope.value = "selected"; selectedDocumentId.value = id; }
  return { scope, selectedDocumentId, apiOnline, selectAll, selectDocument };
});
