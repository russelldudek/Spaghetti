# SpaghettiPlano

SpaghettiPlano is a planogram digital twin for racks, benches, and slotting. The UI lets you import/export workbook data, visualize a facility floor plan, and review slotting conflicts.

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   Then open `http://localhost:4173` in your browser.

## Using the web app

- **Import workbook**: Use the "Import workbook" button in the header to upload an `.xlsx` file. The app will validate the workbook and show any issues under **Workbook validation**.
- **Export workbook**: Click **Export workbook** to download the current dataset as an `.xlsx` file.
- **Export floor plan**: Click **Export floor plan SVG** to download the floor plan visualization as an SVG.
- **Select a storage unit**: Click a unit in the **Facility Floor Plan** panel to view its slots and assignments in the **Storage Detail** section.
- **Change templates**: Use the template selector inside **Storage Detail** to switch slot configurations for a unit; assignments will be remapped automatically.
- **Review conflicts**: The **Conflict Report** panel lists slotting conflicts detected in the current dataset.

## Production build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## GitHub Pages deployment

This project is configured to serve from the root base path (`/`) so it can be hosted on a user/organization GitHub Pages site (e.g., `https://<username>.github.io`). Build the site and publish the `dist/` folder to the `gh-pages` branch (or configure Pages to serve `dist/`). 
