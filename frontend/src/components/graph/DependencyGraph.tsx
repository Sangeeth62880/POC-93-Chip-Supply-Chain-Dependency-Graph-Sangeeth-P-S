"use client";

/* ─── Main Dependency Graph Canvas (React Flow) ──────────── */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useViewport,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { StageNode } from "./StageNode";
import { CustomEdge } from "./CustomEdge";
import { getLayoutedElements } from "./layout";
import type { NodeData, EdgeData, Stage, RiskLevel } from "@/lib/types";

interface DependencyGraphProps {
  graphNodes: NodeData[];
  graphEdges: EdgeData[];
  isMock: boolean;
  activeStages: Stage[];
  activeRiskLevels: RiskLevel[];
  activeCountries: string[];
  bottlenecksOnly: boolean;
  soleSuppliersOnly: boolean;
  onNodeClick: (nodeId: string) => void;
  selectedNodeId: string | null;
}

const nodeTypes = { stageNode: StageNode };
const edgeTypes = { custom: CustomEdge };

/* ─── Swimlane Stage Background Overlay ─────────────────── */
function StageColumns() {
  const { x, y, zoom } = useViewport();
  const stages = [
    { name: "Design", color: "#818CF8" },
    { name: "Fabrication", color: "#38BDF8" },
    { name: "Equipment", color: "#F59E0B" },
    { name: "Memory", color: "#10B981" },
    { name: "Packaging", color: "#6B7280" },
    { name: "Consumer", color: "#EF4444" },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="flex h-[2400px] border-l border-r border-[#1F2937]/25"
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: "top left",
          width: `${6 * 270}px`,
          position: "absolute",
          left: "25px", // Matches coordinate offset
          top: "-600px", // Visual vertical margin
        }}
      >
        {stages.map((stage) => (
          <div
            key={stage.name}
            className="stage-column-lane flex-1 flex flex-col border-r border-[#1F2937]/30 last:border-r-0"
            style={{
              width: "270px",
              background: `linear-gradient(to bottom, ${stage.color}04 0%, transparent 100%)`,
            }}
          >
            {/* Column Header (positioned above the graph nodes) */}
            <div
              className="stage-column-header-text flex flex-col items-center gap-1.5 font-black mt-[520px]"
              style={{
                color: stage.color,
                opacity: 0.8,
              }}
            >
              <span>{stage.name}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Dependency Graph Viewport ─────────────────────────── */
export default function DependencyGraph({
  graphNodes,
  graphEdges,
  isMock,
  activeStages,
  activeRiskLevels,
  activeCountries,
  bottlenecksOnly,
  soleSuppliersOnly,
  onNodeClick,
  selectedNodeId,
}: DependencyGraphProps) {
  const [isLayouted] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const { fitView } = useReactFlow();

  // Convert API data to React Flow nodes
  const initialNodes: Node[] = useMemo(
    () =>
      graphNodes.map((n) => ({
        id: n.id,
        type: "stageNode",
        position: { x: 0, y: 0 },
        data: {
          label: n.label,
          country: n.country,
          country_flag: n.country_flag,
          stage: n.stage,
          color: n.color,
          market_share: n.market_share,
          is_bottleneck: n.is_bottleneck,
          risk_level: n.risk_level,
          description: n.description,
        },
      })),
    [graphNodes]
  );

  // Convert API data to React Flow edges
  const initialEdges: Edge[] = useMemo(
    () =>
      graphEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "custom",
        data: {
          dependency_type: e.dependency_type,
          risk_level: e.risk_level,
          annual_value_usd: e.annual_value_usd,
          label: e.label || "",
        },
      })),
    [graphEdges]
  );

  // Apply stage column layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    [initialNodes, initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update when layout data changes
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    // Auto-fit to viewport on initial load
    setTimeout(() => {
      fitView({ padding: 0.12, duration: 400 });
    }, 100);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges, fitView]);

  // Compute recursive dependency chain on hover
  const activeChain = useMemo(() => {
    if (!hoveredNodeId) return null;

    const connectedNodeIds = new Set<string>([hoveredNodeId]);
    const connectedEdgeIds = new Set<string>();

    // BFS Upstream (depends on)
    let queue = [hoveredNodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      edges.forEach((e) => {
        if (e.target === current && !connectedNodeIds.has(e.source)) {
          connectedNodeIds.add(e.source);
          connectedEdgeIds.add(e.id);
          queue.push(e.source);
        }
      });
    }

    // BFS Downstream (supplies to)
    queue = [hoveredNodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      edges.forEach((e) => {
        if (e.source === current && !connectedNodeIds.has(e.target)) {
          connectedNodeIds.add(e.target);
          connectedEdgeIds.add(e.id);
          queue.push(e.target);
        }
      });
    }

    // Capture direct connections inside the chain
    edges.forEach((e) => {
      if (connectedNodeIds.has(e.source) && connectedNodeIds.has(e.target)) {
        connectedEdgeIds.add(e.id);
      }
    });

    return { nodes: connectedNodeIds, edges: connectedEdgeIds };
  }, [hoveredNodeId, edges]);

  // Compute final opacity and styles for nodes
  const nodesWithHighlight = useMemo(() => {
    const hasStageFilter = activeStages.length > 0 && activeStages.length < 6;
    const hasRiskFilter = activeRiskLevels.length > 0 && activeRiskLevels.length < 3;
    const hasCountryFilter = activeCountries.length > 0 && activeCountries.length < 6;
    const hasAnyFilter = hasStageFilter || hasRiskFilter || hasCountryFilter || bottlenecksOnly || soleSuppliersOnly;

    return nodes.map((n) => {
      const nodeData = graphNodes.find((gn) => gn.id === n.id);
      if (!nodeData) return n;

      let isVisibleByFilter = true;

      if (hasStageFilter && !activeStages.includes(nodeData.stage)) {
        isVisibleByFilter = false;
      }
      if (hasRiskFilter && !activeRiskLevels.includes(nodeData.risk_level)) {
        isVisibleByFilter = false;
      }
      if (hasCountryFilter && !activeCountries.includes(nodeData.country)) {
        isVisibleByFilter = false;
      }
      if (bottlenecksOnly && !nodeData.is_bottleneck) {
        isVisibleByFilter = false;
      }
      if (soleSuppliersOnly) {
        const hasSoleSupplierEdge = graphEdges.some(
          (e) =>
            e.dependency_type === "sole_supplier" &&
            (e.source === nodeData.id || e.target === nodeData.id)
        );
        if (!hasSoleSupplierEdge) {
          isVisibleByFilter = false;
        }
      }

      const isSelected = selectedNodeId === n.id;
      let isVisibleByHover = true;
      if (activeChain) {
        isVisibleByHover = activeChain.nodes.has(n.id);
      }

      let opacity = 1;
      if (activeChain) {
        opacity = isVisibleByHover ? (isVisibleByFilter ? 1.0 : 0.2) : 0.15;
      } else if (hasAnyFilter) {
        opacity = isVisibleByFilter ? 1.0 : 0.15;
      }

      return {
        ...n,
        selected: isSelected,
        style: {
          ...n.style,
          opacity,
          transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: isSelected ? 10 : activeChain && isVisibleByHover ? 5 : 1,
        },
      };
    });
  }, [
    nodes,
    activeChain,
    activeStages,
    activeRiskLevels,
    activeCountries,
    bottlenecksOnly,
    soleSuppliersOnly,
    graphNodes,
    graphEdges,
    selectedNodeId,
  ]);

  // Compute final opacity and styles for edges
  const edgesWithHighlight = useMemo(() => {
    const hasStageFilter = activeStages.length > 0 && activeStages.length < 6;
    const hasRiskFilter = activeRiskLevels.length > 0 && activeRiskLevels.length < 3;
    const hasCountryFilter = activeCountries.length > 0 && activeCountries.length < 6;
    const hasAnyFilter = hasStageFilter || hasRiskFilter || hasCountryFilter || bottlenecksOnly || soleSuppliersOnly;

    return edges.map((e) => {
      const sourceNode = graphNodes.find((n) => n.id === e.source);
      const targetNode = graphNodes.find((n) => n.id === e.target);
      if (!sourceNode || !targetNode) return e;

      let sourceVisible = true;
      let targetVisible = true;

      if (hasStageFilter) {
        if (!activeStages.includes(sourceNode.stage)) sourceVisible = false;
        if (!activeStages.includes(targetNode.stage)) targetVisible = false;
      }
      if (hasRiskFilter) {
        if (!activeRiskLevels.includes(sourceNode.risk_level)) sourceVisible = false;
        if (!activeRiskLevels.includes(targetNode.risk_level)) targetVisible = false;
      }
      if (hasCountryFilter) {
        if (!activeCountries.includes(sourceNode.country)) sourceVisible = false;
        if (!activeCountries.includes(targetNode.country)) targetVisible = false;
      }
      if (bottlenecksOnly) {
        if (!sourceNode.is_bottleneck && !targetNode.is_bottleneck) {
          sourceVisible = false;
          targetVisible = false;
        }
      }
      if (soleSuppliersOnly) {
        if (e.data?.dependency_type !== "sole_supplier") {
          sourceVisible = false;
          targetVisible = false;
        }
      }

      const edgeVisibleByFilter = !hasAnyFilter || (sourceVisible && targetVisible);
      
      let isVisibleByHover = true;
      if (activeChain) {
        isVisibleByHover = activeChain.edges.has(e.id);
      }

      let opacity = 0.8;
      if (activeChain) {
        opacity = isVisibleByHover ? (edgeVisibleByFilter ? 0.95 : 0.15) : 0.05;
      } else if (hasAnyFilter) {
        opacity = edgeVisibleByFilter ? 0.8 : 0.08;
      }

      return {
        ...e,
        style: {
          ...e.style,
          opacity,
          transition: "opacity 0.25s ease",
        },
      };
    });
  }, [
    edges,
    activeChain,
    activeStages,
    activeRiskLevels,
    activeCountries,
    bottlenecksOnly,
    soleSuppliersOnly,
    graphNodes,
  ]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  return (
    <div className="relative w-full h-full select-none" style={{ background: "#030712" }}>
      <ReactFlow
        nodes={nodesWithHighlight}
        edges={edgesWithHighlight}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.25}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        className="!bg-[#030712] relative z-10"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={0.5}
          color="#1F2937"
        />
        <Controls
          showInteractive={false}
          className="!shadow-none !border border-[#1F2937] !bg-[#0B1117] !rounded-lg overflow-hidden"
        />
        
        {/* Render columns behind nodes but inside viewports */}
        <StageColumns />
      </ReactFlow>

      {/* Synthetic Data Badge */}
      {isMock && (
        <div className="absolute bottom-3 left-3 synthetic-badge px-2.5 py-1 rounded-md font-semibold z-20">
          Synthetic Data — For Demo Purposes
        </div>
      )}

      {/* Loading overlay */}
      {!isLayouted && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030712]/90 z-30">
          <div className="text-xs text-[#9CA3AF] animate-pulse uppercase tracking-[0.2em] font-semibold">
            Computing visual chokepoint layout...
          </div>
        </div>
      )}
    </div>
  );
}
