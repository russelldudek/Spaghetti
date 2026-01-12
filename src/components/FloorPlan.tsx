import type { StorageUnit } from "../data/types";
import { benches, facility } from "../data/floorPlan";

interface FloorPlanProps {
  units: StorageUnit[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function FloorPlan({ units, selectedId, onSelect }: FloorPlanProps) {
  const scale = 12;
  const width = facility.width * scale;
  const height = facility.height * scale;

  return (
    <svg
      className="floor-plan"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect width={width} height={height} fill="#f8fafc" stroke="#94a3b8" strokeWidth={2} />
      {benches.map((bench) => (
        <g key={bench.id}>
          <rect
            x={bench.x * scale}
            y={bench.y * scale}
            width={bench.width * scale}
            height={bench.height * scale}
            fill="#fbbf24"
            opacity={0.8}
            rx={6}
          />
          <text
            x={bench.x * scale + (bench.width * scale) / 2}
            y={bench.y * scale + (bench.height * scale) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#7c2d12"
          >
            {bench.id}
          </text>
        </g>
      ))}
      {units.map((unit) => {
        const rectWidth = 4 * scale;
        const rectHeight = 2 * scale;
        const x = unit.x * scale;
        const y = unit.y * scale;
        const isSelected = unit.storageId === selectedId;
        return (
          <g
            key={unit.storageId}
            transform={`rotate(${unit.rotation}, ${x + rectWidth / 2}, ${y + rectHeight / 2})`}
            onClick={() => onSelect(unit.storageId)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x}
              y={y}
              width={rectWidth}
              height={rectHeight}
              fill={isSelected ? "#2563eb" : "#60a5fa"}
              opacity={0.85}
              stroke="#1e3a8a"
              rx={4}
            />
            <text
              x={x + rectWidth / 2}
              y={y + rectHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#0f172a"
            >
              {unit.storageId}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
