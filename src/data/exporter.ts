import * as XLSX from "xlsx";
import type { PlanoData } from "./types";
import { generateFloorPlanSvg } from "./floorPlan";

export function buildWorkbook(data: PlanoData): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  const storageRows = data.storageUnits.map((unit) => ({
    storage_id: unit.storageId,
    zone: unit.zone,
    template_id: unit.templateId,
    x: unit.x,
    y: unit.y,
    rotation: unit.rotation,
    clean_only: unit.rules?.cleanOnly ?? false,
    esd: unit.rules?.esd ?? false,
    locked: unit.rules?.locked ?? false,
    max_load: unit.rules?.maxLoad ?? "",
  }));

  const slotRows = data.slots.map((slot) => ({
    slot_id: slot.slotId,
    storage_id: slot.storageId,
    slot_kind: slot.slotKind,
    usable_w: slot.usableWidth,
    usable_d: slot.usableDepth,
    usable_h: slot.usableHeight,
    usable_cube: slot.usableCube,
    max_weight: slot.maxWeight,
  }));

  const itemRows = data.items.map((item) => ({
    item_id: item.itemId,
    description: item.description,
    unit_cube: item.unitCube,
    handling_class: item.handlingClass,
    family: item.family,
    station_affinity: item.stationAffinity ?? "",
    zone_affinity: item.zoneAffinity ?? "",
  }));

  const assignmentRows = data.assignments.map((assignment) => ({
    item_id: assignment.itemId,
    slot_id: assignment.slotId,
    min: assignment.min,
    max: assignment.max,
    reorder_point: assignment.reorderPoint ?? "",
    pick_face: assignment.pickFace ?? false,
    notes: assignment.notes ?? "",
  }));

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(storageRows), "StorageUnits");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(slotRows), "Slots");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(itemRows), "Items");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(assignmentRows), "Assignments");

  return workbook;
}

export function downloadWorkbook(data: PlanoData): void {
  const workbook = buildWorkbook(data);
  XLSX.writeFile(workbook, "spaghetti-export.xlsx");
}

export function downloadFloorPlanSvg(data: PlanoData): void {
  const svg = generateFloorPlanSvg(data.storageUnits);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "floor-plan.svg";
  link.click();
  URL.revokeObjectURL(url);
}
