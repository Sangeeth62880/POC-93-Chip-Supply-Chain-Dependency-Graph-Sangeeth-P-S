"use client";

/* ─── Custom React Flow Node: StageNode ──────────────────── */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { formatPercent } from "@/lib/api";

interface StageNodeData {
  label: string;
  country: string;
  country_flag: string;
  stage: string;
  color: string;
  market_share: number | null;
  is_bottleneck: boolean;
  risk_level: string;
  [key: string]: unknown;
}

function StageNodeComponent({ data }: NodeProps) {
  const d = data as unknown as StageNodeData;
  const shareWidth = d.market_share ? Math.min(d.market_share, 100) : 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-1.5 !h-1.5 !bg-[#1F2937] !border-[#38BDF8] !border"
      />
      <div
        className={`
          rounded-xl px-3 py-2.5 min-w-[220px] min-h-[95px] cursor-pointer
          transition-all duration-200 flex flex-col justify-between
          hover:scale-[1.04] hover:border-[#38BDF8]/40
          ${d.is_bottleneck ? "bottleneck-pulse-glow" : ""}
        `}
        style={{
          background: "rgba(11, 17, 23, 0.9)",
          backdropFilter: "blur(12px)",
          border: d.is_bottleneck
            ? "2px solid #EF4444"
            : `1px solid #1F2937`,
          borderLeft: `4px solid ${d.color}`,
        }}
      >
        {/* Company name row */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-xs font-bold tracking-tight text-[#F3F4F6] truncate"
              style={{ maxWidth: "165px" }}
            >
              {d.label}
            </span>
            <span className="text-xs leading-none">{d.country_flag}</span>
          </div>

          {/* Stage + risk badge row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span
              className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded"
              style={{
                color: d.color,
                background: `${d.color}18`,
              }}
            >
              {d.stage}
            </span>
            <span
              className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${d.risk_level}`}
            >
              {d.risk_level}
            </span>
            {d.is_bottleneck && (
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 animate-pulse">
                Bottleneck
              </span>
            )}
          </div>
        </div>

        {/* Market share bar */}
        {d.market_share !== null && (
          <div className="w-full mt-auto">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] text-[#9CA3AF] font-medium uppercase tracking-wider">Market Share</span>
              <span className="text-[10px] text-[#E5E7EB] font-bold font-mono">
                {formatPercent(d.market_share)}
              </span>
            </div>
            <div className="w-full h-1 bg-[#1F2937]/55 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${shareWidth}%`,
                  background: d.color,
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-1.5 !h-1.5 !bg-[#1F2937] !border-[#38BDF8] !border"
      />
    </>
  );
}

export const StageNode = memo(StageNodeComponent);
