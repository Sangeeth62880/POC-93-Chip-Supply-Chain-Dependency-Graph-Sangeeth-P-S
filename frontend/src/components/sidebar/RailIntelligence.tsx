"use client";

/* ─── Section A: Rail Intelligence (Title + Metrics) ─────── */

import type { MetricsSummary, SidebarContent } from "@/lib/types";
import { Activity, AlertTriangle, Globe, Link2 } from "lucide-react";

interface RailIntelligenceProps {
  sidebar: SidebarContent;
  metrics: MetricsSummary;
}

const metricConfig = [
  { key: "total_nodes" as const, label: "Total Nodes", icon: Activity, color: "#666666", valColor: "#F5F5F5" },
  { key: "critical_bottlenecks" as const, label: "Bottlenecks", icon: AlertTriangle, color: "#FF3B3B", valColor: "#FF3B3B" },
  { key: "countries_at_risk" as const, label: "Countries at Risk", icon: Globe, color: "#FF6B35", valColor: "#FF6B35" },
  { key: "sole_supplier_nodes" as const, label: "Sole Suppliers", icon: Link2, color: "#666666", valColor: "#F5F5F5" },
];

export default function RailIntelligence({ sidebar, metrics }: RailIntelligenceProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      {/* Title */}
      <h1 className="text-lg font-extrabold tracking-tight text-[#F5F5F5] leading-tight">
        {sidebar.title}
      </h1>
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-1 font-semibold">
        {sidebar.subtitle}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4.5">
        {metricConfig.map(({ key, label, icon: Icon, color, valColor }) => (
          <div
            key={key}
            className="bg-[#111111] border border-[#2A2A2A] rounded p-3 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <Icon size={13} style={{ color }} strokeWidth={2.5} />
              <span className="text-[10px] uppercase tracking-wider text-[#666666] font-bold">
                {label}
              </span>
            </div>
            <span
              className="text-2xl font-black font-mono tracking-tight"
              style={{ color: valColor }}
            >
              {metrics[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
