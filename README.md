# SpaghettiPlano

SpaghettiPlano is a planogram digital twin for Vape-Jet inventory and production storage. It visualizes facility layout, generates storage slots from templates, and highlights assignment conflicts.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL printed in the terminal.

## Publishing to GitHub Pages

1. Update `vite.config.ts` to set the base path for your repo (for example `base: "/Spaghetti/"`).
2. Build the site:
   ```bash
   npm run build
   ```
3. Deploy `dist/` to GitHub Pages:
   - In GitHub, go to **Settings → Pages**.
   - Set **Source** to **Deploy from a branch**.
   - Select the branch you want to publish (for example `main`) and the folder `/dist`.
   - Save, and wait for Pages to finish deploying.

## Using the App

1. **Import workbook:** Click the *Import workbook* badge and upload the planogram `.xlsx` file.
2. **Review validation:** Any missing/invalid columns appear in the **Workbook validation** panel.
3. **Explore the floor plan:** Click storage units to open their slot grids.
4. **Swap templates:** Change the template in **Storage Detail** to regenerate slots and auto-remap assignments.
5. **Review conflicts:** Check the **Conflict Report** for any cube/handling violations.
6. **Export data:** Use **Export workbook** or **Export floor plan SVG** to save updates.
