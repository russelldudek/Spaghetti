import type { PlanoData } from "./types";

export const seedData: PlanoData = {
  storageUnits: [
    { storageId: "L1-R01", zone: "L1", templateId: "BOLTLESS_48x24x84_7S", x: 2, y: 3, rotation: 0 },
    { storageId: "L1-R02", zone: "L1", templateId: "BOLTLESS_48x24x84_7S", x: 2, y: 8, rotation: 0 },
    { storageId: "L2-R01", zone: "L2", templateId: "DRAWER_36x24x60_10D", x: 2, y: 13, rotation: 0 },
    { storageId: "W1-BENCH", zone: "W1", templateId: "SHELF_CART_30x18x48_4S", x: 35, y: 5, rotation: 90 },
    { storageId: "W2-BENCH", zone: "W2", templateId: "SHELF_CART_30x18x48_4S", x: 35, y: 10, rotation: 90 }
  ],
  slots: [],
  items: [
    {
      itemId: "VJ-ASSY-001",
      description: "VJ Main Housing",
      unitCube: 120,
      handlingClass: "clean",
      family: "VJ",
      stationAffinity: "W1",
      zoneAffinity: "L1"
    },
    {
      itemId: "JF-FAST-204",
      description: "JF Fastener Kit",
      unitCube: 40,
      handlingClass: "general",
      family: "JF",
      stationAffinity: "W2",
      zoneAffinity: "L1"
    },
    {
      itemId: "DJ-ESD-778",
      description: "DJ Sensor Harness",
      unitCube: 20,
      handlingClass: "esd",
      family: "DJ",
      stationAffinity: "W1",
      zoneAffinity: "L2"
    }
  ],
  assignments: [
    { itemId: "VJ-ASSY-001", slotId: "L1-R01-SH01-BIN01", min: 2, max: 6, reorderPoint: 2, pickFace: true },
    { itemId: "JF-FAST-204", slotId: "L1-R01-SH01-BIN02", min: 10, max: 40, reorderPoint: 20 },
    { itemId: "DJ-ESD-778", slotId: "L2-R01-DR01", min: 5, max: 15, reorderPoint: 5 }
  ]
};
