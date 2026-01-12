import type { Slot, StorageUnit, TemplateDefinition } from "./types";

const round = (value: number) => Math.round(value * 100) / 100;

export function generateSlotsForUnit(
  unit: StorageUnit,
  template: TemplateDefinition,
): Slot[] {
  const slots: Slot[] = [];
  if (template.structure.shelves && template.structure.binsPerShelf) {
    const shelves = template.structure.shelves;
    const binsPerShelf = template.structure.binsPerShelf;
    const width = template.structure.binWidth ?? template.geometry.width / binsPerShelf;
    const depth = template.structure.binDepth ?? template.geometry.depth;
    const height = template.structure.binHeight ?? template.geometry.height / shelves;

    for (let shelf = 1; shelf <= shelves; shelf += 1) {
      for (let bin = 1; bin <= binsPerShelf; bin += 1) {
        const slotId = `${unit.storageId}-SH${String(shelf).padStart(2, "0")}-BIN${String(
          bin,
        ).padStart(2, "0")}`;
        const usableCube = round(width * depth * height);
        slots.push({
          slotId,
          storageId: unit.storageId,
          slotKind: template.slotKind,
          usableWidth: width,
          usableDepth: depth,
          usableHeight: height,
          usableCube,
          maxWeight: template.rules.maxLoad / shelves,
        });
      }
    }
    return slots;
  }

  if (template.structure.drawers) {
    const drawers = template.structure.drawers;
    const width = template.structure.drawerWidth ?? template.geometry.width;
    const depth = template.structure.drawerDepth ?? template.geometry.depth;
    const height = template.structure.drawerHeight ?? template.geometry.height / drawers;
    for (let drawer = 1; drawer <= drawers; drawer += 1) {
      const slotId = `${unit.storageId}-DR${String(drawer).padStart(2, "0")}`;
      const usableCube = round(width * depth * height);
      slots.push({
        slotId,
        storageId: unit.storageId,
        slotKind: template.slotKind,
        usableWidth: width,
        usableDepth: depth,
        usableHeight: height,
        usableCube,
        maxWeight: template.rules.maxLoad / drawers,
      });
    }
  }

  return slots;
}

export function generateSlots(
  units: StorageUnit[],
  templates: Record<string, TemplateDefinition>,
): Slot[] {
  return units.flatMap((unit) => {
    const template = templates[unit.templateId];
    if (!template) {
      return [];
    }
    return generateSlotsForUnit(unit, template);
  });
}
