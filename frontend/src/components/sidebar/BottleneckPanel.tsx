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
        <Zap size={14} className="text-[#FF3B3B]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#666666] font-bold">
          Critical Bottlenecks
        </h2>
        <span className="ml-auto text-xs font-bold font-mono text-[#FF3B3B]">
          {bottlenecks.length}
        </span>
      </div>

      <div className="space-y-2">
        {bottlenecks.map((b) => (
          <button
            key={b.id}
            onClick={() => onNodeClick(b.id)}
            className="
              w-full text-left bg-[#111111] border border-[#2A2A2A] rounded p-3
              hover:border-[#FF3B3B]/25 transition-all duration-200
              cursor-pointer group
            "
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#FF3B3B] transition-colors">
                {b.label}
              </span>
              <span className="text-xs">{b.country_flag}</span>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed mb-2">
              {b.bottleneck_reason}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded risk-${b.risk_level}`}>
                {b.risk_level}
              </span>
              <span className="text-[10px] text-[#666666] uppercase tracking-wider font-medium">
                {b.stage}
              </span>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed mt-2 border-t border-[#2A2A2A] pt-2">
              <span className="text-[#FF3B3B] font-semibold">If this fails: </span>
              {b.risk_if_fails.slice(0, 120)}
              {b.risk_if_fails.length > 120 ? "..." : ""}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
