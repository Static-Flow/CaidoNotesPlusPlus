import {useSDK} from "@/plugins/sdk";
import {useAnalysisRepository} from "@/repositories/analysis";
import {useAnalysisStore} from "@/stores/analysis";
import {useTemplateStore} from "@/stores/templates";

export const useAnalysisService = () => {
  const sdk = useSDK();
  const store = useAnalysisStore();
  const templateStore = useTemplateStore();
  const repository = useAnalysisRepository();

  const runAnalysis = async () => {
    store.jobState.send({ type: "Start" });
    const result = await repository.runAnalysis();

    if (result.type === "Ok") {
      store.jobState.send({ type: "Done" });
    } else {
      sdk.window.showToast(result.error, {
        variant: "error",
      });
    }
  }

  const initialize = async () => {
    store.resultState.send({ type: "Start" });
    const result = await repository.getAnalysisResults();

    if (result.type === "Ok") {
      store.resultState.send({ type: "Success", results: result.results });
    } else {
      store.resultState.send({ type: "Error", error: result.error });
    }
  }

  const selectResult = async (templateId: string, userId: string | undefined) => {
    const resultState = store.resultState.getState();
    const templateState = templateStore.getState();

    if (resultState.type !== "Success" || templateState.type !== "Success") return;

    const analysisResult = resultState.results.find(r => r.templateId === templateId && r.userId === userId);

    if (analysisResult) {
      store.selectionState.send({ type: "Start", templateId, userId });
      const result = await repository.getRequestResponse(analysisResult.requestId);

      if (result.type === "Ok") {
        store.selectionState.send({
          type: "Success",
          templateId,
          userId,
          request: result.request,
          response: result.response
        });
      } else {
        store.selectionState.send({
          type: "Error",
          templateId,
          userId,
          error: result.error
        });
      }

      return;
    }

    const template = templateState.templates.find(t => t.id === templateId);
    if (template && !userId) {
      store.selectionState.send({ type: "Start", templateId, userId });
      const result = await repository.getRequestResponse(template.requestId);

      if (result.type === "Ok") {
        store.selectionState.send({
          type: "Success",
          templateId,
          userId,
          request: result.request,
          response: result.response
        });
      } else {
        store.selectionState.send({
          type: "Error",
          templateId,
          userId,
          error: result.error
        });
      }
    }
  }

  return {
    initialize,
    runAnalysis,
    selectResult
  };
}
