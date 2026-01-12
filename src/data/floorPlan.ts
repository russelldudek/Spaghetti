import type { StorageUnit } from "./types";

export const facility = {
  width: 50,
  height: 25,
};

export const benches = [
  { id: "W1", x: 30, y: 3, width: 6, height: 3 },
  { id: "W2", x: 30, y: 8, width: 6, height: 3 },
  { id: "W3", x: 30, y: 13, width: 6, height: 3 },
  { id: "W4", x: 30, y: 18, width: 6, height: 3 },
];

export function generateFloorPlanSvg(units: StorageUnit[]): string {
  const scale = 12;
  const width = facility.width * scale;
  const height = facility.height * scale;

  const unitRects = units
    .map((unit) => {
      const rectWidth = 4 * scale;
      const rectHeight = 2 * scale;
      const x = unit.x * scale;
      const y = unit.y * scale;
      return `\n      <g transform="rotate(${unit.rotation}, ${x + rectWidth / 2}, ${y + rectHeight / 2})">
        <rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="#6ea8fe" opacity="0.8" />
        <text x="${x + rectWidth / 2}" y="${y + rectHeight / 2}" text-anchor="middle" font-size="10" fill="#0f172a">${unit.storageId}</text>
      </g>`;
    })
    .join("\n");

  const benchRects = benches
    .map((bench) => {
      const x = bench.x * scale;
      const y = bench.y * scale;
      return `\n      <rect x="${x}" y="${y}" width="${bench.width * scale}" height="${bench.height * scale}" fill="#fbbf24" opacity="0.8" />
      <text x="${x + (bench.width * scale) / 2}" y="${y + (bench.height * scale) / 2}" text-anchor="middle" font-size="10" fill="#7c2d12">${bench.id}</text>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
  ${benchRects}
  ${unitRects}
</svg>`;
}
