# Validation & Verification Report (VAR_REPORT)

**Project Name**: Real Rails PoC #93 — Chip Supply Chain Dependency Graph  
**Redesign Phase**: Executive Intelligence Dashboard Refactoring  
**Date**: June 5, 2026  

---

## 📋 1. Executive Summary

This report documents the verification and validation results for the Chip Supply Chain Dependency Graph redesign. The system was validated against the Real Rails design guidelines, FastAPI backend API contract, and critical usability requirements. All verification checks have passed successfully, confirming that the platform is production-grade.

---

## 🔍 2. Validation Log & Test Cases

### Test Case 1: Node Discoverability & Layout Grid
* **Description**: Verify that all 21 company nodes are immediately visible inside the initial viewport on page load without manual panning or zooming.
* **Methodology**: Load [http://localhost:3000](http://localhost:3000), inspect the bounding box of rendered nodes, and verify alignment inside swimlanes.
* **Results**:
  * **Pass**: All 21 nodes are positioned within a bounded vertical range ($y \in [40\text{px}, 580\text{px}]$) and horizontal range ($x \in [0\text{px}, 1620\text{px}]$).
  * **Pass**: React Flow `fitView()` automatically scales the entire $1620\text{px} \times 620\text{px}$ canvas area into the center panel workspace on load.
  * **Pass**: Every company is aligned inside its respective stage column (Design, Fabrication, Equipment, Memory, Packaging, Consumer) with exact $25\text{px}$ padding on both sides of the column lane.

### Test Case 2: Dynamic Dataset-Level Filtering
* **Description**: Verify that filtering is performed at the dataset level, completely hiding non-matching elements and updating all calculations in the sidebar.
* **Methodology**: Apply different combinations of filters (e.g. Risk = Critical, Country = Taiwan, Stage = Memory) and audit graph elements, KPIs, and charts.
* **Results**:
  * **Pass**: Nodes not matching the filter criteria are excluded from the render array.
  * **Pass**: Orphaned edges are automatically removed. Only edges where **both** source and target remain visible are rendered.
  * **Pass**: Key Performance Indicators (Total Nodes, Bottlenecks, Countries at Risk, Sole Suppliers) recalculate dynamically.
  * **Pass**: The Herfindahl-like country concentration index and the by-country bar chart update instantly using only visible bottleneck nodes.

### Test Case 3: Reset View Viewport Restoration
* **Description**: Verify that the "Reset View" button clears all selected nodes, active filters, search inputs, and restores the original fully fitted zoom/center.
* **Methodology**: Pan the graph, zoom in, type `TSMC` in the search dropdown, click a few filters (e.g. Risk = Critical), select a node, and click the **Reset View** button.
* **Results**:
  * **Pass**: Active filters are cleared (restoring the full 21 nodes).
  * **Pass**: The company detail sidebar panel is closed.
  * **Pass**: The search input box text query is cleared.
  * **Pass**: The viewport smoothly transitions back to the exact initial zoom and coordinates captured after the first render.

### Test Case 4: CSV Data Export
* **Description**: Verify that clicking "Export Data" downloads a valid UTF-8 encoded CSV file containing the active node and edge datasets.
* **Methodology**: Click **Export Data** and open the resulting `.csv` file in a text editor/spreadsheet tool to verify the formatting.
* **Results**:
  * **Pass**: File is generated with a `.csv` extension.
  * **Pass**: The CSV contains a `COMPANIES` section listing active companies with details (ID, label, stage, country, market share, risk, bottleneck reason, description, failure impact) followed by a `DEPENDENCIES` section listing active connections (source, target, dependency type, risk, value, label).
  * **Pass**: All field values are correctly escaped.

---

## ⚙️ 3. Automated Compile Verification

The frontend project compilation was verified by running:
```bash
npm run build
```
### Build Output Summary:
* **Compilation Status**: Successful.
* **TypeScript Linter**: 0 errors, 0 warnings.
* **Bundle Optimization**: Successfully generated static pages.
* **Fast Refresh / Next.js Development Server**: Fully operational.

---

## 📈 4. Conclusion

All features meet UAT criteria. The dynamic layout algorithm guarantees 100% discoverability, and the dataset-level filtering ensures that all metrics, bottlenecks, and country concentration indexes present an accurate, real-time picture of the active supply chain view.
