import type { Assignment, Conflict, Item, Slot, StorageUnit, TemplateDefinition } from "./types";

export function generateConflictReport(
  assignments: Assignment[],
  items: Item[],
  slots: Slot[],
  units: StorageUnit[],
  templates: Record<string, TemplateDefinition>,
): Conflict[] {
  const itemMap = new Map(items.map((item) => [item.itemId, item]));
  const slotMap = new Map(slots.map((slot) => [slot.slotId, slot]));
  const unitMap = new Map(units.map((unit) => [unit.storageId, unit]));

  const conflicts: Conflict[] = [];

  assignments.forEach((assignment) => {
    const item = itemMap.get(assignment.itemId);
    const slot = slotMap.get(assignment.slotId);
    if (!item || !slot) {
      conflicts.push({
        itemId: assignment.itemId,
        slotId: assignment.slotId,
        reason: "Missing item or slot for assignment.",
      });
      return;
    }

    if (item.unitCube > slot.usableCube) {
      conflicts.push({
        itemId: item.itemId,
        slotId: slot.slotId,
        reason: `Item cube ${item.unitCube} exceeds slot cube ${slot.usableCube}.`,
      });
    }

    const unit = unitMap.get(slot.storageId);
    if (unit) {
      const template = templates[unit.templateId];
      if (template && !template.rules.handling.includes(item.handlingClass)) {
        conflicts.push({
          itemId: item.itemId,
          slotId: slot.slotId,
          reason: `Handling class ${item.handlingClass} not allowed in template ${unit.templateId}.`,
        });
      }

      if (unit.rules?.cleanOnly && item.handlingClass !== "clean") {
        conflicts.push({
          itemId: item.itemId,
          slotId: slot.slotId,
          reason: "Slot restricted to clean-only handling.",
        });
      }
    }
  });

  return conflicts;
}
