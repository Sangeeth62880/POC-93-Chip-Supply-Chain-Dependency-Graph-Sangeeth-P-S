"use client";

/* ─── Intelligence Sidebar (Tabbed panel view - 25% width) ────────── */

import { useState, useEffect } from "react";
import type { GraphResponse } from "@/lib/types";
import OverviewTab from "./OverviewTab";
import BottlenecksTab from "./BottlenecksTab";
import AnalyticsTab from "./AnalyticsTab";
import NodeDetail from "./NodeDetail";
import { Info, AlertTriangle, BarChart3, Building } from "lucide-react";

interface IntelligenceSidebarProps {
  graphData: GraphResponse;
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  onNodeDetailClose: () => void;
}

type TabType = "overview" | "bottlenecks" | "analytics" | "details";

export default function IntelligenceSidebar({
  graphData,
  selectedNodeId,
  onNodeClick,
  onNodeDetailClose,
}: IntelligenceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Automatically switch to the "Details" tab when a node is selected
  useEffect(() => {
    if (selectedNodeId) {
      setActiveTab("details");
    }
  }, [selectedNodeId]);

  return (
    <aside
      className="flex flex-col h-full bg-[#0B1117] border-l border-[#1F2937]"
    >
      {/* Tabs Navigation Header */}
      <div className="flex border-b border-[#1F2937] bg-[#111827]/40">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "overview"
              ? "text-[#38BDF8] border-[#38BDF8] bg-[#38BDF8]/5"
              : "text-[#6B7280] border-transparent hover:text-[#9CA3AF]"
          }`}
        >
          <Info size={14} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "bottlenecks"
              ? "text-[#EF4444] border-[#EF4444] bg-[#EF4444]/5"
              : "text-[#6B7280] border-transparent hover:text-[#9CA3AF]"
          }`}
        >
          <AlertTriangle size={14} />
          <span>Bottlenecks</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "analytics"
              ? "text-[#818CF8] border-[#818CF8] bg-[#818CF8]/5"
              : "text-[#6B7280] border-transparent hover:text-[#9CA3AF]"
          }`}
        >
          <BarChart3 size={14} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 relative ${
            activeTab === "details"
              ? "text-[#10B981] border-[#10B981] bg-[#10B981]/5"
              : "text-[#6B7280] border-transparent hover:text-[#9CA3AF]"
          }`}
        >
          <Building size={14} />
          <span>Node Details</span>
          {selectedNodeId && activeTab !== "details" && (
            <span className="absolute top-2.5 right-4 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          )}
        </button>
      </div>

      {/* Tabs Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === "overview" && (
          <OverviewTab
            metrics={graphData.metrics}
            whyThisMatters={graphData.sidebar_content.why_this_matters}
            whoControlsTheRail={graphData.sidebar_content.who_controls_the_rail}
            topControllers={graphData.sidebar_content.top_controllers}
          />
        )}

        {activeTab === "bottlenecks" && (
          <BottlenecksTab
            bottlenecks={graphData.bottlenecks}
            edges={graphData.edges}
            onNodeClick={onNodeClick}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            analytics={graphData.analytics}
            bottlenecks={graphData.bottlenecks}
            edges={graphData.edges}
          />
        )}

        {activeTab === "details" && (
          <NodeDetail
            nodeId={selectedNodeId}
            onNodeClick={onNodeClick}
            onClearSelection={onNodeDetailClose}
          />
        )}
      </div>
    </aside>
  );
}
