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

const RISK_COLORS: Record<string, string> = {
  critical: "#FF3B3B",
  high: "#FF6B35",
  medium: "#555555",
};

function StageNodeComponent({ data }: NodeProps) {
  const d = data as unknown as StageNodeData;
  const shareWidth = d.market_share ? Math.min(d.market_share, 100) : 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-1.5 !h-1.5 !bg-[#2A2A2A] !border-[#FF6B35] !border"
      />
      <div
        className={`
           min-w-[220px] min-h-[95px] cursor-pointer
           transition-all duration-200 flex flex-col justify-between
           hover:border-[#FF6B35]/30
        `}
        style={{
          background: "#161616",
          border: d.is_bottleneck
            ? "1px solid #444444"
            : "1px solid #2A2A2A",
          borderRadius: "6px",
          padding: "12px 14px",
          position: "relative",
        }}
      >
        {/* Bottleneck red dot indicator */}
        {d.is_bottleneck && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#FF3B3B",
            }}
          />
        )}

        {/* Company name row */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                maxWidth: "165px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </span>
            <span className="text-xs leading-none">{d.country_flag}</span>
          </div>

          {/* Stage + risk badge row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span
              style={{
                color: "#555555",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              {d.stage}
            </span>
            <span
              style={{
                color: RISK_COLORS[d.risk_level] || "#555555",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
              }}
            >
              {d.risk_level}
            </span>
          </div>
        </div>

        {/* Market share bar */}
        {d.market_share !== null && (
          <div className="w-full mt-auto">
            <div className="flex justify-between items-center mb-0.5">
              <span
                style={{
                  fontSize: "9px",
                  color: "#444444",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                Market Share
              </span>
              <span
                style={{
                  fontSize: "9px",
                  color: "#888888",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {formatPercent(d.market_share)}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "2px",
                background: "#252525",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${shareWidth}%`,
                  background: "#FF6B35",
                  borderRadius: "2px",
                  transition: "all 0.5s",
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-1.5 !h-1.5 !bg-[#2A2A2A] !border-[#FF6B35] !border"
      />
    </>
  );
}

export const StageNode = memo(StageNodeComponent);
