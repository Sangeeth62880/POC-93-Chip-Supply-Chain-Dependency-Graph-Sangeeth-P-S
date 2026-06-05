"use client";

/* ─── Bottlenecks Tab (List of Bottleneck Cards with Analytics) ──────── */

import type { BottleneckEntry, EdgeData } from "@/lib/types";
import { Zap, GitCommit } from "lucide-react";

interface BottlenecksTabProps {
  bottlenecks: BottleneckEntry[];
  edges: EdgeData[];
  onNodeClick: (nodeId: string) => void;
}

const RISK_SCORE: Record<string, number> = {
  critical: 3,
  high: 2,
  medium: 1,
};

export default function BottlenecksTab({
  bottlenecks,
  edges,
  onNodeClick,
}: BottlenecksTabProps) {
  // Sort bottlenecks by risk score descending
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    const scoreA = RISK_SCORE[a.risk_level] || 0;
    const scoreB = RISK_SCORE[b.risk_level] || 0;
    return scoreB - scoreA;
  });

  // Calculate dependency count (incoming + outgoing)
  const getDependencyCount = (nodeId: string) => {
    return edges.filter((e) => e.source === nodeId || e.target === nodeId).length;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
          High-Risk Chokepoint Registry
        </div>
        <span className="text-xs font-mono font-bold text-[#EF4444] px-2 py-0.5 rounded bg-[#EF4444]/10 border border-[#EF4444]/25">
          {sortedBottlenecks.length} Bottlenecks
        </span>
      </div>

      <div className="space-y-3">
        {sortedBottlenecks.map((b) => {
          const depCount = getDependencyCount(b.id);
          return (
            <button
              key={b.id}
              onClick={() => onNodeClick(b.id)}
              className="
                w-full text-left glass-card rounded-xl p-3 border border-[#1F2937]
                hover:border-[#EF4444]/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]
                transition-all duration-200 cursor-pointer group flex flex-col gap-2
              "
            >
              {/* Header */}
              <div className="flex items-start justify-between w-full">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#F3F4F6] group-hover:text-[#EF4444] transition-colors truncate">
                    {b.label}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[#9CA3AF]">
                    <span>{b.country_flag}</span>
                    <span>{b.country}</span>
                    <span className="text-[#4B5563]">•</span>
                    <span className="uppercase font-semibold tracking-wider text-[9px]">{b.stage}</span>
                  </div>
                </div>
                
                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${b.risk_level}`}>
                  {b.risk_level}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 bg-[#111827]/40 rounded-lg px-2.5 py-1 text-[10px] text-[#9CA3AF] border border-[#1F2937]/50 w-fit">
                <div className="flex items-center gap-1">
                  <GitCommit size={11} className="text-[#38BDF8]" />
                  <span>Dependencies: <strong className="text-white font-mono">{depCount}</strong></span>
                </div>
              </div>

              {/* Critical Reason */}
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#F59E0B] font-bold mb-0.5">
                  Why It Is Critical
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  {b.bottleneck_reason}
                </p>
              </div>

              {/* Failure Impact */}
              <div className="border-t border-[#1F2937]/50 pt-2">
                <div className="text-[9px] uppercase tracking-wider text-[#EF4444] font-bold mb-0.5">
                  Impact If Failure Occurs
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {b.risk_if_fails}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
