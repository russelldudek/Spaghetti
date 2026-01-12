import { useMemo, useState } from "react";
import { FloorPlan } from "./components/FloorPlan";
import { StorageDetail } from "./components/StorageDetail";
import { ConflictReport } from "./components/ConflictReport";
import { downloadFloorPlanSvg, downloadWorkbook } from "./data/exporter";
import { generateConflictReport } from "./data/conflicts";
import { parseWorkbook } from "./data/parser";
import { seedData } from "./data/seed";
import { generateSlots } from "./data/slotGenerator";
import { templates } from "./data/templates";
import type { Assignment, PlanoData, Slot, StorageUnit } from "./data/types";

const ensureSlots = (data: PlanoData): PlanoData => {
  if (data.slots.length > 0) {
    return data;
  }
  return {
    ...data,
    slots: generateSlots(data.storageUnits, templates),
  };
};

const remapAssignments = (
  assignments: Assignment[],
  newSlots: Slot[],
  storageId: string,
): Assignment[] => {
  const updatedAssignments: Assignment[] = [];
  const availableSlots = newSlots.filter((slot) => slot.storageId === storageId);
  const availableIds = new Set(availableSlots.map((slot) => slot.slotId));
  const usedSlots = new Set<string>();

  assignments.forEach((assignment) => {
    if (!assignment.slotId.startsWith(storageId)) {
      updatedAssignments.push(assignment);
      return;
    }

    if (availableIds.has(assignment.slotId) && !usedSlots.has(assignment.slotId)) {
      usedSlots.add(assignment.slotId);
      updatedAssignments.push(assignment);
      return;
    }

    const fallback = availableSlots.find((slot) => !usedSlots.has(slot.slotId));
    if (fallback) {
      usedSlots.add(fallback.slotId);
      updatedAssignments.push({ ...assignment, slotId: fallback.slotId });
      return;
    }

    updatedAssignments.push({ ...assignment, slotId: "UNASSIGNED" });
  });

  return updatedAssignments;
};

function App() {
  const [data, setData] = useState<PlanoData>(() => ensureSlots(seedData));
  const [selectedId, setSelectedId] = useState<string>(seedData.storageUnits[0].storageId);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const selectedUnit = data.storageUnits.find((unit) => unit.storageId === selectedId);

  const conflicts = useMemo(
    () => generateConflictReport(data.assignments, data.items, data.slots, data.storageUnits, templates),
    [data],
  );

  const handleWorkbookUpload = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const result = parseWorkbook(buffer);
    setParseErrors(result.errors);
    setData(ensureSlots(result.data));
    if (result.data.storageUnits[0]) {
      setSelectedId(result.data.storageUnits[0].storageId);
    }
  };

  const handleTemplateChange = (storageId: string, templateId: string) => {
    const storageUnits: StorageUnit[] = data.storageUnits.map((unit) =>
      unit.storageId === storageId ? { ...unit, templateId } : unit,
    );
    const slots = generateSlots(storageUnits, templates);
    const assignments = remapAssignments(data.assignments, slots, storageId);

    setData({
      ...data,
      storageUnits,
      slots,
      assignments,
    });
  };

  return (
    <main>
      <header>
        <div>
          <h1>SpaghettiPlano</h1>
          <div className="note">Planogram digital twin for racks, benches, and slotting.</div>
        </div>
        <div className="header-actions">
          <label>
            <span className="badge">Import workbook</span>
            <input
              type="file"
              accept=".xlsx"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleWorkbookUpload(file);
                }
              }}
              style={{ marginLeft: 8 }}
            />
          </label>
          <button type="button" onClick={() => downloadWorkbook(data)}>
            Export workbook
          </button>
          <button type="button" onClick={() => downloadFloorPlanSvg(data)}>
            Export floor plan SVG
          </button>
        </div>
      </header>

      {parseErrors.length > 0 && (
        <section>
          <div className="panel-title">Workbook validation</div>
          <div className="list">
            {parseErrors.map((error) => (
              <div key={error} className="note">
                {error}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="panel-title">Facility Floor Plan</div>
        <FloorPlan units={data.storageUnits} selectedId={selectedId} onSelect={setSelectedId} />
      </section>

      <div className="grid">
        <section>
          <div className="panel-title">Dataset Summary</div>
          <div className="list">
            <div>
              <span className="badge">Storage Units</span> {data.storageUnits.length}
            </div>
            <div>
              <span className="badge">Slots</span> {data.slots.length}
            </div>
            <div>
              <span className="badge">Items</span> {data.items.length}
            </div>
            <div>
              <span className="badge">Assignments</span> {data.assignments.length}
            </div>
          </div>
        </section>
        <section>
          <div className="panel-title">Item Snapshot</div>
          <div className="list">
            {data.items.slice(0, 6).map((item) => (
              <div key={item.itemId}>
                <strong>{item.itemId}</strong> — {item.description}
                <div className="note">
                  {item.family} · {item.handlingClass} · Cube {item.unitCube}
                </div>
              </div>
            ))}
            {data.items.length > 6 && <div className="note">+ {data.items.length - 6} more…</div>}
          </div>
        </section>
      </div>

      {selectedUnit && (
        <StorageDetail
          unit={selectedUnit}
          slots={data.slots.filter((slot) => slot.storageId === selectedUnit.storageId)}
          assignments={data.assignments}
          items={data.items}
          onTemplateChange={handleTemplateChange}
        />
      )}

      <ConflictReport conflicts={conflicts} />
    </main>
  );
}

export default App;
