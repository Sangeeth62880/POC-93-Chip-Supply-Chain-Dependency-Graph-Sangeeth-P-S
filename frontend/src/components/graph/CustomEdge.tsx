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
  sole_supplier: "#EF4444", // Red
  primary: "#38BDF8",       // Cyan
  secondary: "#F59E0B",     // Amber
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

  const isCritical = depType === "sole_supplier" || riskLevel === "critical";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={15}
        className={isCritical ? "edge-critical-flow" : ""}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: depType === "sole_supplier" ? 3.0 : 2.0,
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
              glass-card rounded-lg px-3 py-2 min-w-[200px]
              text-xs shadow-xl
            "
          >
            <div className="font-semibold text-[#E5E7EB] mb-1.5">
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
                  background: "rgba(56, 189, 248, 0.1)",
                  color: "#38BDF8",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                {DEPENDENCY_LABELS[depType] || depType}
              </span>
            </div>
            {annualValue > 0 && (
              <div className="text-[#9CA3AF] mt-1">
                Annual Value:{" "}
                <span className="text-[#E5E7EB] font-mono">
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
