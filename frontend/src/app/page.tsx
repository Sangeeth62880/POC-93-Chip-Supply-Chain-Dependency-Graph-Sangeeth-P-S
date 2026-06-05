"use client";

/* ─── Real Rails PoC #93 — Main Dashboard Page ──────────── */
/* Layout: 70px Top Bar | 3-Panel Split (18% Left, 57% Center, 25% Right) */

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import type { GraphResponse, Stage, RiskLevel } from "@/lib/types";
import { fetchGraphData } from "@/lib/api";
import Filters from "@/components/sidebar/Filters";
import DependencyGraph from "@/components/graph/DependencyGraph";
import IntelligenceSidebar from "@/components/sidebar/IntelligenceSidebar";
import { Filter } from "lucide-react";

/* ─── Sleek Custom Search Dropdown Component ────────────── */
interface SearchNodeDropdownProps {
  nodes: { id: string; label: string }[];
  onSelectNode: (id: string) => void;
  search: string;
  setSearch: (val: string) => void;
}

function SearchNodeDropdown({
  nodes,
  onSelectNode,
  search,
  setSearch,
}: SearchNodeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredNodes = nodes.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="bg-[#111827] border border-[#1F2937] text-xs text-[#E5E7EB] rounded-lg px-3 py-1.5 w-[190px] focus:outline-none focus:border-[#38BDF8] transition-colors font-medium placeholder-[#4B5563]"
      />
      {isOpen && search && (
        <div className="absolute right-0 mt-1.5 w-[230px] max-h-[220px] overflow-y-auto bg-[#0B1117]/95 border border-[#1F2937] rounded-xl shadow-2xl z-50 p-1 backdrop-blur-md">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  onSelectNode(node.id);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#9CA3AF] hover:text-white hover:bg-[#38BDF8]/10 transition-all cursor-pointer font-medium"
              >
                {node.label}
              </button>
            ))
          ) : (
            <div className="text-[10px] text-[#4B5563] p-3 text-center uppercase tracking-wider font-semibold">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard content layout that consumes ReactFlow context ─── */
function DashboardContent() {
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [loading, setLoading] = useState(true);

  // Layout State
  const [showFilters, setShowFilters] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Filters State
  const [activeStages, setActiveStages] = useState<Stage[]>([]);
  const [activeRiskLevels, setActiveRiskLevels] = useState<RiskLevel[]>([]);
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [bottlenecksOnly, setBottlenecksOnly] = useState(false);
  const [soleSuppliersOnly, setSoleSuppliersOnly] = useState(false);

  // Selected Node State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // React Flow hooks for viewport control
  const { fitView, getViewport, setViewport } = useReactFlow();
  const initialViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null);

  useEffect(() => {
    fetchGraphData().then(({ data, isMock: mock }) => {
      setGraphData(data);
      setIsMock(mock);
      setLoading(false);
    });
  }, []);

  // Capture initial viewport once the graph is fully loaded and layouted
  useEffect(() => {
    if (!loading && graphData) {
      const timer = setTimeout(() => {
        const vp = getViewport();
        // React Flow starts with zoom=1, x=0, y=0. We wait until fitView has run (which changes zoom to something else, typically != 1)
        if (vp && vp.zoom !== 1) {
          initialViewportRef.current = vp;
        } else {
          // Retry
          const retryTimer = setTimeout(() => {
            const vpRetry = getViewport();
            if (vpRetry) {
              initialViewportRef.current = vpRetry;
            }
          }, 500);
          return () => clearTimeout(retryTimer);
        }
      }, 600); // 600ms is enough for fitView animation (400ms duration) to complete
      return () => clearTimeout(timer);
    }
  }, [loading, graphData, getViewport]);

  // Fit view automatically when left filters show/hide transition completes (300ms transition)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && graphData) {
        fitView({ duration: 500, padding: 0.12 });
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [showFilters, loading, graphData, fitView]);

  // Client-side filtering useMemo: dynamic graph nodes, edges, KPIs, bottlenecks, and analytics calculations
  const filteredGraphData = useMemo(() => {
    if (!graphData) return null;

    // 1. Nodes Filter
    const fNodes = graphData.nodes.filter((node) => {
      if (activeStages.length > 0 && !activeStages.includes(node.stage)) {
        return false;
      }
      if (activeCountries.length > 0 && !activeCountries.includes(node.country)) {
        return false;
      }
      if (activeRiskLevels.length > 0 && !activeRiskLevels.includes(node.risk_level)) {
        return false;
      }
      if (bottlenecksOnly && !node.is_bottleneck) {
        return false;
      }
      if (soleSuppliersOnly) {
        const hasSoleSupplierEdge = graphData.edges.some(
          (e) =>
            e.dependency_type === "sole_supplier" &&
            (e.source === node.id || e.target === node.id)
        );
        if (!hasSoleSupplierEdge) {
          return false;
        }
      }
      return true;
    });

    const visibleNodeIds = new Set(fNodes.map((n) => n.id));

    // 2. Edges Filter (No orphaned edges: only render edges where BOTH source and target are visible)
    const fEdges = graphData.edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // 3. Bottleneck list from visible nodes
    const fBottlenecks = fNodes
      .filter((n) => n.is_bottleneck)
      .map((n) => ({
        id: n.id,
        label: n.label,
        country: n.country,
        country_flag: n.country_flag,
        stage: n.stage,
        risk_level: n.risk_level,
        bottleneck_reason: n.bottleneck_reason || "",
        risk_if_fails: n.risk_if_fails || "",
      }));

    // 4. Metrics calculation based on visible nodes/edges
    const soleSupplierNodes = new Set(
      fEdges.filter((e) => e.dependency_type === "sole_supplier").map((e) => e.source)
    );
    const countriesAtRisk = new Set(fBottlenecks.map((b) => b.country));

    const fMetrics = {
      total_nodes: fNodes.length,
      critical_bottlenecks: fBottlenecks.length,
      countries_at_risk: countriesAtRisk.size,
      sole_supplier_nodes: soleSupplierNodes.size,
    };

    // 5. Analytics (Herfindahl-like index and country breakdown)
    const countryData: Record<string, { country: string; flag: string; critical_node_count: number; node_names: string[] }> = {};
    
    fBottlenecks.forEach((b) => {
      if (!countryData[b.country]) {
        countryData[b.country] = {
          country: b.country,
          flag: b.country_flag,
          critical_node_count: 0,
          node_names: [],
        };
      }
      countryData[b.country].critical_node_count += 1;
      countryData[b.country].node_names.push(b.label);
    });

    const totalBottlenecks = fBottlenecks.length;
    const byCountry = Object.values(countryData).map((cdata) => {
      const pct = totalBottlenecks > 0 ? (cdata.critical_node_count / totalBottlenecks) * 100 : 0;
      return {
        country: cdata.country,
        country_flag: cdata.flag,
        critical_node_count: cdata.critical_node_count,
        critical_node_percentage: parseFloat(pct.toFixed(1)),
        node_names: cdata.node_names,
      };
    });

    byCountry.sort((a, b) => b.critical_node_count - a.critical_node_count);

    let concentrationScore = 0;
    if (totalBottlenecks > 0) {
      const shares = byCountry
        .filter((c) => c.critical_node_count > 0)
        .map((c) => c.critical_node_percentage / 100);
      const hhi = shares.reduce((sum, s) => sum + s * s, 0);
      const nCountriesWithBottlenecks = shares.length;
      if (nCountriesWithBottlenecks > 1) {
        const minHhi = 1 / nCountriesWithBottlenecks;
        concentrationScore = ((hhi - minHhi) / (1 - minHhi)) * 100;
        if (concentrationScore < 0) concentrationScore = 0;
        if (concentrationScore > 100) concentrationScore = 100;
      } else {
        concentrationScore = 100.0;
      }
    }

    return {
      nodes: fNodes,
      edges: fEdges,
      metrics: fMetrics,
      bottlenecks: fBottlenecks,
      analytics: {
        concentration_score: concentrationScore,
        by_country: byCountry,
      },
      sidebar_content: graphData.sidebar_content,
      data_source: graphData.data_source,
      timestamp: graphData.timestamp,
    };
  }, [graphData, activeStages, activeCountries, activeRiskLevels, bottlenecksOnly, soleSuppliersOnly]);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    // Zoom onto the target node smoothly
    setTimeout(() => {
      fitView({ nodes: [{ id: nodeId }], duration: 800, padding: 1.8 });
    }, 50);
  }, [fitView]);

  const handleNodeDetailClose = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleResetFilters = () => {
    setActiveStages([]);
    setActiveRiskLevels([]);
    setActiveCountries([]);
    setBottlenecksOnly(false);
    setSoleSuppliersOnly(false);
  };

  const handleResetView = () => {
    setSelectedNodeId(null);
    setSearchQuery("");
    handleResetFilters();

    // Reset viewport to stored initial state or fallback to fitView
    if (initialViewportRef.current) {
      const { x, y, zoom } = initialViewportRef.current;
      setViewport({ x, y, zoom }, { duration: 800 });
    } else {
      fitView({ duration: 800, padding: 0.12 });
    }
  };

  const handleExportData = () => {
    if (!filteredGraphData) return;

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    // 1. Companies Section (Nodes)
    const nodeHeaders = [
      "ID",
      "Company Name",
      "Stage",
      "Country",
      "Market Share (%)",
      "Risk Level",
      "Is Bottleneck",
      "Bottleneck Reason",
      "Description",
      "Failure Impact"
    ];

    const nodeRows = filteredGraphData.nodes.map((n) => [
      n.id,
      n.label,
      n.stage,
      n.country,
      n.market_share !== null ? n.market_share : "",
      n.risk_level,
      n.is_bottleneck ? "Yes" : "No",
      n.bottleneck_reason || "",
      n.description || "",
      n.risk_if_fails || ""
    ]);

    // 2. Dependencies Section (Edges)
    const edgeHeaders = [
      "Source ID",
      "Target ID",
      "Dependency Type",
      "Risk Level",
      "Annual Value (USD)",
      "Label"
    ];

    const edgeRows = filteredGraphData.edges.map((e) => [
      e.source,
      e.target,
      e.dependency_type,
      e.risk_level,
      e.annual_value_usd,
      e.label || ""
    ]);

    const csvLines = [
      "COMPANIES",
      nodeHeaders.join(","),
      ...nodeRows.map((row) => row.map(escapeCSV).join(",")),
      "",
      "DEPENDENCIES",
      edgeHeaders.join(","),
      ...edgeRows.map((row) => row.map(escapeCSV).join(","))
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `chip_supply_chain_intel_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  if (loading || !graphData || !filteredGraphData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#030712]">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-[#38BDF8] font-bold mb-2 animate-pulse">
            Real Rails
          </div>
          <div className="text-sm text-[#6B7280] tracking-wider uppercase font-medium">
            Loading Supply Chain Intelligence...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#030712] font-sans antialiased text-[#E5E7EB]">
      {/* ─── Top Bar (Full Width, 70px) ─── */}
      <header className="h-[70px] w-full border-b border-[#1F2937] bg-[#0B1117]/85 backdrop-blur-md px-6 flex items-center justify-between z-45 shrink-0">
        <div>
          <h1 className="text-base font-extrabold text-[#F3F4F6] tracking-tight flex items-center gap-2">
            <span>Chip Supply Chain Dependency Graph</span>
            <span className="text-[9px] tracking-[0.12em] px-2 py-0.5 bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 rounded font-black uppercase">
              Executive Intel
            </span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#6B7280] mt-0.5 font-bold">
            Supply Chain Rail • Semiconductor Layer
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Dropdown - displays full set for easy discovery */}
          <SearchNodeDropdown
            nodes={graphData.nodes.map((n) => ({ id: n.id, label: n.label }))}
            onSelectNode={handleNodeClick}
            search={searchQuery}
            setSearch={setSearchQuery}
          />

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 border text-xs rounded-lg transition-all duration-200 cursor-pointer font-semibold ${
              showFilters
                ? "bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]"
                : "border-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#111827]"
            }`}
          >
            <Filter size={12} />
            <span>{showFilters ? "Hide Controls" : "Graph Controls"}</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#1F2937] text-xs text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#111827] rounded-lg transition-all duration-200 cursor-pointer font-semibold"
          >
            Reset View
          </button>

          {/* Export Data Button */}
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#38BDF8]/10 text-xs text-[#38BDF8] border border-[#38BDF8]/25 hover:bg-[#38BDF8]/25 rounded-lg font-bold transition-all duration-200 cursor-pointer"
          >
            Export Data
          </button>
        </div>
      </header>

      {/* ─── Main Content 3-Panels Layout ─── */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Left Panel (Filters) — Collapsible with smooth transition */}
        <div
          className={`h-full shrink-0 border-r border-[#1F2937] transition-all duration-300 ease-in-out ${
            showFilters ? "w-[240px]" : "w-0 overflow-hidden border-none"
          }`}
        >
          <div className="w-[240px] h-full">
            <Filters
              activeStages={activeStages}
              activeRiskLevels={activeRiskLevels}
              activeCountries={activeCountries}
              bottlenecksOnly={bottlenecksOnly}
              soleSuppliersOnly={soleSuppliersOnly}
              onStagesChange={setActiveStages}
              onRiskLevelsChange={setActiveRiskLevels}
              onCountriesChange={setActiveCountries}
              onBottlenecksOnlyChange={setBottlenecksOnly}
              onSoleSuppliersOnlyChange={setSoleSuppliersOnly}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Center Panel (Graph Workspace) — Resizes dynamically to exact 70% of screen when filters are closed */}
        <div className="flex-1 h-full shrink-0 relative transition-all duration-300 ease-in-out">
          <DependencyGraph
            graphNodes={filteredGraphData.nodes}
            graphEdges={filteredGraphData.edges}
            isMock={isMock}
            activeStages={activeStages}
            activeRiskLevels={activeRiskLevels}
            activeCountries={activeCountries}
            bottlenecksOnly={bottlenecksOnly}
            soleSuppliersOnly={soleSuppliersOnly}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNodeId}
          />
        </div>

        {/* Right Panel (Intelligence Sidebar) — Set to exact 30% of screen to maintain the 70/30 split */}
        <div className="w-[30%] min-w-[340px] h-full shrink-0 transition-all duration-300 ease-in-out">
          <IntelligenceSidebar
            graphData={filteredGraphData}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
            onNodeDetailClose={handleNodeDetailClose}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Root Wrapper with ReactFlowProvider ──────────────── */
export default function DashboardPage() {
  return (
    <ReactFlowProvider>
      <DashboardContent />
    </ReactFlowProvider>
  );
}
