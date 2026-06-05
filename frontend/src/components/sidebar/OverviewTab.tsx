"use client";

/* ─── Overview Tab (Metrics, Why This Matters, Who Controls the Rail) ─── */

import type { MetricsSummary, ControllerEntry } from "@/lib/types";
import { Activity, AlertTriangle, Globe, Link2, AlertCircle, Shield } from "lucide-react";

interface OverviewTabProps {
  metrics: MetricsSummary;
  whyThisMatters: string;
  whoControlsTheRail: string;
  topControllers: ControllerEntry[];
}

const metricConfig = [
  { key: "total_nodes" as const, label: "Total Nodes", icon: Activity, color: "#38BDF8" },
  { key: "critical_bottlenecks" as const, label: "Bottlenecks", icon: AlertTriangle, color: "#EF4444" },
  { key: "countries_at_risk" as const, label: "Countries at Risk", icon: Globe, color: "#F59E0B" },
  { key: "sole_supplier_nodes" as const, label: "Sole Suppliers", icon: Link2, color: "#818CF8" },
];

export default function OverviewTab({
  metrics,
  whyThisMatters,
  whoControlsTheRail,
  topControllers,
}: OverviewTabProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none">
      {/* Metrics Grid */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-2.5">
          Key Performance Indicators
        </div>
        <div className="grid grid-cols-2 gap-2">
          {metricConfig.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="glass-card rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5">
                <Icon size={12} style={{ color }} strokeWidth={2.5} />
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                  {label}
                </span>
              </div>
              <span
                className="text-xl font-extrabold font-mono tracking-tight"
                style={{ color }}
              >
                {metrics[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1F2937]/50 pt-4 space-y-4">
        {/* Why This Matters */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={13} className="text-[#F59E0B]" strokeWidth={2.5} />
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
              Why This Matters
            </div>
          </div>
          <p className="text-xs text-[#D1D5DB] leading-relaxed">
            {whyThisMatters}
          </p>
        </div>

        {/* Who Controls the Rail */}
        <div className="border-t border-[#1F2937]/50 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={13} className="text-[#EF4444]" strokeWidth={2.5} />
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
              Who Controls the Rail
            </div>
          </div>
          <p className="text-xs text-[#D1D5DB] leading-relaxed mb-3">
            {whoControlsTheRail}
          </p>

          {/* Top Controllers List */}
          <div className="space-y-1.5">
            {topControllers.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center gap-2.5 glass-card rounded-lg px-2.5 py-2"
              >
                <span className="text-[10px] font-mono text-[#6B7280] w-4 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#E5E7EB] truncate">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] truncate">
                    {c.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
