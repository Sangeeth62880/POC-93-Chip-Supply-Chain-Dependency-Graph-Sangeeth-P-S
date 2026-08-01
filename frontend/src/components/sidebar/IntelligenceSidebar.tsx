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
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "bottlenecks" | "analytics" | "details";

export default function IntelligenceSidebar({
  graphData,
  selectedNodeId,
  onNodeClick,
  onNodeDetailClose,
  isOpen,
  onClose,
}: IntelligenceSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Automatically switch to the "Details" tab when a node is selected
  useEffect(() => {
    if (selectedNodeId) {
      const timer = setTimeout(() => {
        setActiveTab("details");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedNodeId]);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: "380px",
        zIndex: 40,
        background: "#1A1A1A",
        borderLeft: "1px solid #2A2A2A",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s ease-out",
        overflowY: "auto",
      }}
    >
      {/* Tabs Navigation Header */}
      <div className="flex border-b border-[#2A2A2A] bg-[#1A1A1A]/40 pr-[46px] relative">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "overview"
              ? "text-[#FF6B35] border-[#FF6B35] bg-[#FF6B35]/5"
              : "text-[#666666] border-transparent hover:text-[#888888]"
          }`}
        >
          <Info size={14} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("bottlenecks")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "bottlenecks"
              ? "text-[#FF3B3B] border-[#FF3B3B] bg-[#FF3B3B]/5"
              : "text-[#666666] border-transparent hover:text-[#888888]"
          }`}
        >
          <AlertTriangle size={14} />
          <span>Bottlenecks</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 ${
            activeTab === "analytics"
              ? "text-[#FF6B35] border-[#FF6B35] bg-[#FF6B35]/5"
              : "text-[#666666] border-transparent hover:text-[#888888]"
          }`}
        >
          <BarChart3 size={14} />
          <span>Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-b-2 relative ${
            activeTab === "details"
              ? "text-[#FF6B35] border-[#FF6B35] bg-[#FF6B35]/5"
              : "text-[#666666] border-transparent hover:text-[#888888]"
          }`}
        >
          <Building size={14} />
          <span>Node Details</span>
          {selectedNodeId && activeTab !== "details" && (
            <span className="absolute top-2.5 right-4 w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
          )}
        </button>

        {/* Slide-over close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "28px",
            height: "28px",
            background: "transparent",
            border: "1px solid #2A2A2A",
            borderRadius: "4px",
            color: "#666666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          className="hover:border-[#FF6B35] hover:text-[#FF6B35] text-lg font-bold"
        >
          &times;
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
