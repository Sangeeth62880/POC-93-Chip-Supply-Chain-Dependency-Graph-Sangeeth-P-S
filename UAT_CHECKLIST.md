# User Acceptance Testing Checklist (UAT_CHECKLIST)

This checklist verifies the functional and design requirements of the Chip Supply Chain Dependency Graph executive dashboard.

| ID | Category | Requirement Description | Status | Verification Notes |
|---|---|---|---|---|
| **UAT-1.1** | UI & Layout | All 21 company nodes are visible inside the initial viewport on load. | **PASS** | Nodes are centered vertically within a $620\text{px}$ boundary. `fitView()` fits them on load. |
| **UAT-1.2** | UI & Layout | The graph uses a strict stage-column layout in left-to-right order. | **PASS** | Design (0) → Fabrication (1) → Equipment (2) → Memory (3) → Packaging (4) → Consumer (5). |
| **UAT-1.3** | UI & Layout | Nodes do not overlap or stack on top of one another. | **PASS** | Nodes inside columns are sorted by ID and spaced vertically with a $16\text{px}$ gap. |
| **UAT-1.4** | UI & Layout | Graph controls panel is collapsible to support the 70/30 viewport split. | **PASS** | Toggling "Graph Controls" slides the filters sidebar open/close via CSS transitions. |
| **UAT-2.1** | Reset View | Reset View clears selected company details and closes the panel. | **PASS** | Resets `selectedNodeId` to `null` and returns the sidebar tab to "Overview". |
| **UAT-2.2** | Reset View | Reset View clears the auto-complete search bar query. | **PASS** | Clears the `searchQuery` state in the parent, resetting the input. |
| **UAT-2.3** | Reset View | Reset View clears all active stage, risk, and country filters. | **PASS** | Resets filter arrays, restoring all 21 nodes to the graph canvas. |
| **UAT-2.4** | Reset View | Reset View restores the exact initial zoom level and center. | **PASS** | Viewport coordinates are stored after first render and restored using `setViewport`. |
| **UAT-3.1** | Filter Logic | Risk level filtering completely hides non-matching nodes. | **PASS** | Nodes are removed from the render array rather than just dimmed. |
| **UAT-3.2** | Filter Logic | Orphaned edges (lines without a visible source or target) are removed. | **PASS** | Edges are filtered to only keep connections where both endpoints are visible. |
| **UAT-3.3** | Filter Logic | Metrics summary cards in the sidebar update dynamically based on filters. | **PASS** | Total nodes, bottlenecks, countries at risk, and sole suppliers update instantly. |
| **UAT-3.4** | Filter Logic | Bottlenecks Registry list in the sidebar updates dynamically. | **PASS** | Bottleneck cards are filtered and sorted by risk score descending. |
| **UAT-3.5** | Filter Logic | Country Concentration score and Recharts bar chart update dynamically. | **PASS** | Computes a normalized HHI index using only the currently visible bottleneck nodes. |
| **UAT-4.1** | Data Export | Clicking "Export Data" downloads a valid CSV file. | **PASS** | Downloads a `.csv` file format compatible with Excel and Google Sheets. |
| **UAT-4.2** | Data Export | CSV contains both COMPANIES (nodes) and DEPENDENCIES (edges) sections. | **PASS** | Separated by sections and fully escapes quotes and special characters. |
| **UAT-4.3** | Compilation | The frontend compiles successfully without linter or runtime errors. | **PASS** | Successful compile of Next.js production build (`npm run build`). |

---

## 📝 Sign-off Block

* **Tester Name**: Antigravity AI  
* **Role**: Primary Coding Partner  
* **UAT Date**: June 5, 2026  
* **Sign-off Status**: Approved for Deployment  
