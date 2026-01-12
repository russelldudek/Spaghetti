import * as XLSX from "xlsx";
import type { Assignment, Item, PlanoData, Slot, StorageUnit } from "./types";

const requiredItemColumns = ["item_id", "description", "unit_cube", "handling_class", "family"];
const requiredStorageColumns = ["storage_id", "zone", "template_id", "x", "y", "rotation"];

const normalize = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

const toNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const parseSheet = (sheet: XLSX.Sheet) => XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

export function parseWorkbook(data: ArrayBuffer): { data: PlanoData; errors: string[] } {
  const workbook = XLSX.read(data, { type: "array" });
  const errors: string[] = [];

  const storageRows = workbook.Sheets.StorageUnits
    ? parseSheet(workbook.Sheets.StorageUnits)
    : [];
  const itemRows = workbook.Sheets.Items ? parseSheet(workbook.Sheets.Items) : [];
  const assignmentRows = workbook.Sheets.Assignments
    ? parseSheet(workbook.Sheets.Assignments)
    : [];
  const slotRows = workbook.Sheets.Slots ? parseSheet(workbook.Sheets.Slots) : [];

  if (storageRows.length === 0) {
    errors.push("StorageUnits sheet is missing or empty.");
  }
  if (itemRows.length === 0) {
    errors.push("Items sheet is missing or empty.");
  }

  const storageColumns = storageRows[0] ? Object.keys(storageRows[0]) : [];
  requiredStorageColumns.forEach((col) => {
    if (!storageColumns.includes(col)) {
      errors.push(`StorageUnits missing required column: ${col}`);
    }
  });

  const itemColumns = itemRows[0] ? Object.keys(itemRows[0]) : [];
  requiredItemColumns.forEach((col) => {
    if (!itemColumns.includes(col)) {
      errors.push(`Items missing required column: ${col}`);
    }
  });

  const storageUnits: StorageUnit[] = storageRows.map((row) => ({
    storageId: String(row.storage_id ?? ""),
    zone: String(row.zone ?? ""),
    templateId: String(row.template_id ?? ""),
    x: toNumber(row.x),
    y: toNumber(row.y),
    rotation: toNumber(row.rotation),
    rules: {
      cleanOnly: Boolean(row.clean_only),
      esd: Boolean(row.esd),
      locked: Boolean(row.locked),
      maxLoad: row.max_load ? toNumber(row.max_load) : undefined,
    },
  }));

  const items: Item[] = itemRows.map((row) => ({
    itemId: String(row.item_id ?? ""),
    description: String(row.description ?? ""),
    unitCube: toNumber(row.unit_cube),
    handlingClass: (normalize(row.handling_class) as Item["handlingClass"]) ?? "general",
    family: String(row.family ?? ""),
    stationAffinity: row.station_affinity ? String(row.station_affinity) : undefined,
    zoneAffinity: row.zone_affinity ? String(row.zone_affinity) : undefined,
  }));

  const assignments: Assignment[] = assignmentRows.map((row) => ({
    itemId: String(row.item_id ?? ""),
    slotId: String(row.slot_id ?? ""),
    min: toNumber(row.min),
    max: toNumber(row.max),
    reorderPoint: row.reorder_point ? toNumber(row.reorder_point) : undefined,
    pickFace: Boolean(row.pick_face),
    notes: row.notes ? String(row.notes) : undefined,
  }));

  const slots: Slot[] = slotRows.map((row) => ({
    slotId: String(row.slot_id ?? ""),
    storageId: String(row.storage_id ?? ""),
    slotKind: String(row.slot_kind ?? ""),
    usableWidth: toNumber(row.usable_w),
    usableDepth: toNumber(row.usable_d),
    usableHeight: toNumber(row.usable_h),
    usableCube: toNumber(row.usable_cube),
    maxWeight: toNumber(row.max_weight),
  }));

  return {
    data: { storageUnits, items, assignments, slots },
    errors,
  };
}
