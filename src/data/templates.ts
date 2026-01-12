import rawTemplates from "../../templates/storageTemplates.json";
import type { TemplateDefinition } from "./types";

export const templates = rawTemplates as Record<string, TemplateDefinition>;

export const templateOptions = Object.entries(templates).map(([id, def]) => ({
  id,
  label: def.label,
}));
