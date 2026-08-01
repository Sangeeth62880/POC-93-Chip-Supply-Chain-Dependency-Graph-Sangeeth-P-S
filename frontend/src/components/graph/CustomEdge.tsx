"use client";

/* ─── Custom React Flow Edge with Risk Styling ───────────── */

import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { formatUSD } from "@/lib/api";

const DEPENDENCY_COLORS: Record<string, string> = {
  sole_supplier: "#FF6B35",
  primary: "#333333",
  secondary: "#262626",
};

const DEPENDENCY_LABELS: Record<string, string> = {
  sole_supplier: "Sole Supplier",
  primary: "Primary",
  secondary: "Secondary",
};

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps) {
  const d = data as Record<string, unknown> | undefined;
  const riskLevel = (d?.risk_level as string) || "medium";
  const depType = (d?.dependency_type as string) || "primary";
  const annualValue = (d?.annual_value_usd as number) || 0;
  const edgeLabel = (d?.label as string) || "";
  const edgeColor = DEPENDENCY_COLORS[depType] || DEPENDENCY_COLORS.primary;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSoleSupplier = depType === "sole_supplier";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={15}
        className={isSoleSupplier ? "edge-critical-flow" : ""}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: isSoleSupplier ? 1.5 : 1.0,
          strokeDasharray: isSoleSupplier ? "6 3" : undefined,
          opacity: 0.85,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto group"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {/* Invisible hover target */}
          <div className="w-6 h-6 rounded-full" />
          {/* Tooltip on hover */}
          <div
            className="
              hidden group-hover:block absolute z-50
              bottom-full left-1/2 -translate-x-1/2 mb-2
              glass-card rounded px-3 py-2 min-w-[200px]
              text-xs shadow-xl
            "
          >
            <div className="font-semibold text-[#F5F5F5] mb-1.5">
              {edgeLabel}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded risk-${riskLevel}`}
              >
                {riskLevel}
              </span>
              <span
                className="text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255, 107, 53, 0.08)",
                  color: "#FF6B35",
                  border: "1px solid rgba(255, 107, 53, 0.15)",
                }}
              >
                {DEPENDENCY_LABELS[depType] || depType}
              </span>
            </div>
            {annualValue > 0 && (
              <div className="text-[#666666] mt-1">
                Annual Value:{" "}
                <span className="text-[#F5F5F5] font-mono">
                  {formatUSD(annualValue)}
                </span>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const CustomEdge = memo(CustomEdgeComponent);
