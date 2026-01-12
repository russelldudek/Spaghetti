# PRD: Spaghetti (Planogram Digital Twin + Visualization)

## 1. Summary
Spaghetti is a dynamic planogram visualization and slotting tool for Vape-Jet production and inventory. It turns the current spreadsheet planogram (VJ4, JF30, DJ) into an interactive, data-driven facility map and rack-level views that automatically adapt when storage types change.

The core outcome is a "storage digital twin" where:
- storage units generate slots from templates (racks, shelves, drawers, bins, carts)
- parts and subassemblies are assigned to slots
- the UI renders floor plan, rack elevations, and fit/conflict reports from the same data

## 2. Background and Inspiration
We want something closer to a living system than a static drawing. When racks change, the model re-renders, and it flags what no longer fits.

Development workflow inspiration: “Ralph” style external loops that repeatedly feed an agent a backlog (prd.json), require it to run tests, commit progress, and continue until tasks are done. The agent-agnostic Ralph Loop explicitly supports Codex CLI via stdin and a max-iteration guard. We will adopt safety patterns from other Ralph implementations: rate limiting, stuck loop detection, and circuit breakers.

## 3. Goals
### 3.1 Primary Goals (MVP)
1) Visualize the facility layout (50’x25’) with:
   - left wall inventory racks (L1–L4)
   - right runway with four winged workbenches (W1–W4)
   - burn-in, QA, pack-out zones

2) Visualize storage internally:
   - click any rack/cabinet/cart and view a generated slot grid (shelves, drawers, bins)
   - click any slot to see assigned parts, min/max, cube utilization

3) Support dynamic storage templates:
   - change a storage unit’s template (example: boltless rack → drawer cabinet)
   - regenerate slots
   - auto-attempt remap of assignments
   - produce a conflict report for anything that does not fit or violates rules

4) Spreadsheet integration:
   - import the planogram workbook (xlsx)
   - export an updated workbook with storage IDs, slot IDs, and assignments
   - keep the spreadsheet as the source of truth for part master and demand columns

### 3.2 Secondary Goals (Post-MVP)
- Pick-path view for kitting (optimized walking route)
- Heatmaps (pick velocity, cube utilization, stockout risk)
- Label pack generator (bin labels + QR codes that link to slot pages)
- Multi-user mode and role-based editing (Ops vs builder)

## 4. Non-Goals (MVP)
- Full ERP inventory reconciliation
- Real-time barcode scanning and cycle count workflows
- Purchase ordering
- Automated vision or camera-based bin verification

## 5. Users and Use Cases
### 5.1 Personas
- Director of Ops: owns layout, stocking strategy, capacity, changes
- Kitter: needs fast pick faces and batch kitting views
- Builder: needs “where is it” lookup and clean staging rules
- Buyer: needs min/max, reorder triggers, vendor mapping (later)

### 5.2 Core Use Cases
- “Show me where part X lives and what bench it feeds.”
- “What parts are needed for 2x VJ, 1x JF this week, and where do I pick them?”
- “We replaced a boltless rack with a drawer cabinet. What breaks?”
- “Which racks are over cube, and which are wasting vertical space?”
- “Where do subassemblies stage between W2 and W3?”

## 6. Data Model
Spaghetti will manage five primary datasets (stored as tables in xlsx and mirrored in JSON internally):

1) **StorageUnits**
- storage_id (example: L2-R03)
- zone (L1–L4, W1–W4, BurnIn, QA, Pack)
- template_id (example: BOLTLESS_48x24x84_7S)
- floor placement: x, y, rotation
- rules: clean_only, esd, locked, max_load

2) **Slots (generated)**
- slot_id (example: L2-R03-SH04-BIN07)
- storage_id
- slot_kind (shelf, bin, drawer, pallet, lane)
- usable_w/d/h, usable_cube, max_weight

3) **Items (parts and subassemblies)**
- item_id (part number)
- description
- dims or unit_cube (required for fit)
- handling_class (clean fluid, esd, fragile, heavy, general)
- families (VJ/JF/DJ/shared)
- station affinity (W1–W4) and zone affinity (L1–L4)

4) **Assignments**
- item_id → slot_id
- min, max, reorder_point
- pick_face flag
- notes (example: "keep sealed", "ESD bag required")

5) **StagingObjects (subassembly staging and WIP)**
- stage_id (example: W3-STAGE-02)
- type (cart, shelf, WIP square)
- x, y, capacity
- which subassemblies belong here

## 7. Functional Requirements (MVP)
### 7.1 Import and Validation
- Import xlsx
- Validate required columns exist (item_id, desc, unit_cube or dims)
- Validate storage templates exist
- Report validation errors clearly

### 7.2 Storage Template System
- Template definitions stored in repo (YAML or JSON):
  - geometry: width, depth, height
  - structure: bays, shelves, drawers, bin grid
  - slot generator function parameters
- Ability to add new templates without code changes (data-driven where possible)

### 7.3 Floor Plan View
- Render scaled 2D map of 50’x25’
- Draw StorageUnits as rectangles, label by storage_id and zone
- Draw W1–W4 benches as fixed objects
- Click-through to rack detail views
- Filters: by product family (VJ/JF/DJ), by station (W1–W4), by handling class

### 7.4 Rack Detail View
- Elevation or grid view of slots
- Show per-slot:
  - assigned items
  - cube utilization %
  - min/max status if on-hand is later added
- Search: “find item” and highlight its slot and rack on the floor plan

### 7.5 Change Management and Conflict Report
When template_id changes for a StorageUnit:
- Regenerate slots
- Attempt assignment remap
- Produce conflict list:
  - does not fit by cube/dims
  - violates handling rules (example: clean-only)
  - exceeds max weight
  - pick-face constraint violated (optional MVP)

### 7.6 Export
- Export updated xlsx with:
  - StorageUnits table
  - Slots table (generated snapshot)
  - Assignments table
  - Floor placement values
- Export optional: SVG/PNG of floor plan for printing

## 8. Non-Functional Requirements
- Runs locally on a laptop (no cloud dependencies required for MVP)
- Deterministic rendering (same inputs yield same output)
- Fast: floor plan render under 1s for typical dataset size
- Tested: parser, slot generator, and conflict report logic covered by unit tests
- Version controlled: templates and app code live in Git

## 9. UX and Screens
1) **Home**
- load a workbook
- show dataset health summary
- quick links to floor plan and search

2) **Floor Plan**
- facility map
- filters
- click storage unit to drill down

3) **Storage Detail**
- rack slot grid/elevation
- list of items and utilization
- edit template, regenerate, view conflicts

4) **Item Search**
- search bar
- shows item card, primary slot, alternate slots, station affinity
- “show on map” jump

5) **Conflict Report**
- sortable list
- recommended fix actions: move item, change template, split assignment

## 10. Milestones
- M0: Repo scaffold, template format, xlsx import, basic data validation
- M1: Floor plan renderer + clickable storage units
- M2: Slot generator + rack detail views
- M3: Template swap + remap + conflict report
- M4: Export updated xlsx + SVG floor plan export
- M5: Polish: filters, search, quick edit tools

## 11. Success Metrics
- Time to locate any part from UI under 10 seconds
- Template swap produces conflict report within 2 seconds
- 90% of parts have a valid primary slot assignment
- Visual cube utilization exposes top 10 “wasted vertical” areas and top 10 “overflow” areas

## 12. Risks and Mitigations
- Missing item cube/dims: enforce required fields and provide a “temporary cube class” fallback
- Overfitting to current racks: use templates and generator logic early
- Visualization becomes hard to maintain: keep strict separation between data tables and rendering

## 13. Ralph-Style Codex Development Plan
We will maintain:
- prd.json: backlog as executable user stories
- prompt.md: system prompt for Codex iterations
- progress.txt: persistent learnings log
- ralph.sh: external loop script that calls Codex CLI and enforces max iterations
This mirrors the agent-agnostic Ralph Loop pattern.

Guardrails to adopt:
- max iterations per run, rate limiting, and stuck-loop detection patterns based on mature Ralph implementations.
Completion verification concept: evaluator checks whether the task is actually done before stopping.
