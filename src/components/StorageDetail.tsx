import type { Assignment, Item, Slot, StorageUnit } from "../data/types";
import { templateOptions } from "../data/templates";

interface StorageDetailProps {
  unit: StorageUnit;
  slots: Slot[];
  assignments: Assignment[];
  items: Item[];
  onTemplateChange: (storageId: string, templateId: string) => void;
}

const formatCube = (cube: number) => `${cube.toFixed(0)} in³`;

export function StorageDetail({
  unit,
  slots,
  assignments,
  items,
  onTemplateChange,
}: StorageDetailProps) {
  const assignmentsBySlot = new Map(assignments.map((assignment) => [assignment.slotId, assignment]));
  const itemMap = new Map(items.map((item) => [item.itemId, item]));
  const hasTemplate = templateOptions.some((option) => option.id === unit.templateId);
  const templateChoices = hasTemplate
    ? templateOptions
    : [
        { id: unit.templateId, label: `Unknown template (${unit.templateId || "Missing"})` },
        ...templateOptions,
      ];

  return (
    <section>
      <div className="panel-title">Storage Detail: {unit.storageId}</div>
      <div className="list">
        <div>
          <span className="tag">Zone {unit.zone}</span>
          <span className="tag">Rotation {unit.rotation}°</span>
        </div>
        <label>
          Template
          <select
            value={unit.templateId}
            onChange={(event) => onTemplateChange(unit.storageId, event.target.value)}
            style={{ marginLeft: 8 }}
          >
            {templateChoices.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {!hasTemplate && (
          <div className="note">
            This storage unit references a template that is not in the template library. Select a
            valid template to generate slots.
          </div>
        )}
      </div>
      <div className="panel-title" style={{ marginTop: 16 }}>
        Slots ({slots.length})
      </div>
      <div className="slot-grid">
        {slots.map((slot) => {
          const assignment = assignmentsBySlot.get(slot.slotId);
          const item = assignment ? itemMap.get(assignment.itemId) : undefined;
          return (
            <div key={slot.slotId} className="slot-card">
              <div>{slot.slotId}</div>
              <div className="note">{formatCube(slot.usableCube)}</div>
              {item ? (
                <div>
                  <strong>{item.itemId}</strong>
                  <div className="note">{item.description}</div>
                </div>
              ) : (
                <div className="note">Unassigned</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
