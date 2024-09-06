import type { DefineEvents } from "caido:plugin";
import type { AnalysisResult, Template } from "shared";

export type BackendEvents = DefineEvents<{
  "templates:created": (template: Template) => void;
  "templates:updated": (template: Template) => void;
  "results:created": (result: AnalysisResult) => void;
  "results:clear": () => void;
}>;
