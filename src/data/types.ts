export type HandlingClass = "clean" | "esd" | "fragile" | "heavy" | "general";

export interface StorageUnit {
  storageId: string;
  zone: string;
  templateId: string;
  x: number;
  y: number;
  rotation: number;
  rules?: {
    cleanOnly?: boolean;
    esd?: boolean;
    locked?: boolean;
    maxLoad?: number;
  };
}

export interface Slot {
  slotId: string;
  storageId: string;
  slotKind: string;
  usableWidth: number;
  usableDepth: number;
  usableHeight: number;
  usableCube: number;
  maxWeight: number;
}

export interface Item {
  itemId: string;
  description: string;
  unitCube: number;
  handlingClass: HandlingClass;
  family: string;
  stationAffinity?: string;
  zoneAffinity?: string;
}

export interface Assignment {
  itemId: string;
  slotId: string;
  min: number;
  max: number;
  reorderPoint?: number;
  pickFace?: boolean;
  notes?: string;
}

export interface Conflict {
  itemId: string;
  slotId: string;
  reason: string;
}

export interface TemplateDefinition {
  label: string;
  geometry: { width: number; depth: number; height: number };
  structure: Record<string, number>;
  slotKind: string;
  rules: { maxLoad: number; handling: HandlingClass[] };
}

export interface PlanoData {
  storageUnits: StorageUnit[];
  slots: Slot[];
  items: Item[];
  assignments: Assignment[];
}
