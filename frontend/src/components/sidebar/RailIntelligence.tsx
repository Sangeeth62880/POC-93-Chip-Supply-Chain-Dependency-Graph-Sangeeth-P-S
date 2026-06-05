"use client";

/* ─── Section A: Rail Intelligence (Title + Metrics) ─────── */

import type { MetricsSummary, SidebarContent } from "@/lib/types";
import { Activity, AlertTriangle, Globe, Link2 } from "lucide-react";

interface RailIntelligenceProps {
  sidebar: SidebarContent;
  metrics: MetricsSummary;
}

const metricConfig = [
  { key: "total_nodes" as const, label: "Total Nodes", icon: Activity, color: "#38BDF8" },
  { key: "critical_bottlenecks" as const, label: "Bottlenecks", icon: AlertTriangle, color: "#EF4444" },
  { key: "countries_at_risk" as const, label: "Countries at Risk", icon: Globe, color: "#F59E0B" },
  { key: "sole_supplier_nodes" as const, label: "Sole Suppliers", icon: Link2, color: "#818CF8" },
];

export default function RailIntelligence({ sidebar, metrics }: RailIntelligenceProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      {/* Title */}
      <h1 className="text-lg font-extrabold tracking-tight text-[#F3F4F6] leading-tight">
        {sidebar.title}
      </h1>
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF] mt-1 font-semibold">
        {sidebar.subtitle}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4.5">
        {metricConfig.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="glass-card rounded-xl p-3 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <Icon size={13} style={{ color }} strokeWidth={2.5} />
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                {label}
              </span>
            </div>
            <span
              className="text-2xl font-black font-mono tracking-tight"
              style={{ color }}
            >
              {metrics[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
