import type { Conflict } from "../data/types";

interface ConflictReportProps {
  conflicts: Conflict[];
}

export function ConflictReport({ conflicts }: ConflictReportProps) {
  return (
    <section>
      <div className="panel-title">Conflict Report</div>
      {conflicts.length === 0 ? (
        <div className="note">No conflicts detected for current assignments.</div>
      ) : (
        <div className="list">
          {conflicts.map((conflict, index) => (
            <div key={`${conflict.itemId}-${conflict.slotId}-${index}`} className="conflict">
              <strong>{conflict.itemId}</strong> → {conflict.slotId}
              <div className="note">{conflict.reason}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
