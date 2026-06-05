"use client";

/* ─── Bottleneck Nodes Panel ─────────────────────────────── */

import type { BottleneckEntry } from "@/lib/types";
import { Zap } from "lucide-react";

interface BottleneckPanelProps {
  bottlenecks: BottleneckEntry[];
  onNodeClick: (nodeId: string) => void;
}

export default function BottleneckPanel({
  bottlenecks,
  onNodeClick,
}: BottleneckPanelProps) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <Zap size={14} className="text-[#EF4444]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#9CA3AF] font-bold">
          Critical Bottlenecks
        </h2>
        <span className="ml-auto text-xs font-bold font-mono text-[#EF4444]">
          {bottlenecks.length}
        </span>
      </div>

      <div className="space-y-2">
        {bottlenecks.map((b) => (
          <button
            key={b.id}
            onClick={() => onNodeClick(b.id)}
            className="
              w-full text-left glass-card rounded-lg p-3
              hover:border-[#EF4444]/30 transition-all duration-200
              cursor-pointer group
            "
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-[#E5E7EB] group-hover:text-[#EF4444] transition-colors">
                {b.label}
              </span>
              <span className="text-xs">{b.country_flag}</span>
            </div>
            <p className="text-xs text-[#D1D5DB] leading-relaxed mb-2">
              {b.bottleneck_reason}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded risk-${b.risk_level}`}>
                {b.risk_level}
              </span>
              <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-medium">
                {b.stage}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed mt-2 border-t border-[#1F2937] pt-2">
              <span className="text-[#EF4444] font-semibold">If this fails: </span>
              {b.risk_if_fails.slice(0, 120)}
              {b.risk_if_fails.length > 120 ? "..." : ""}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
