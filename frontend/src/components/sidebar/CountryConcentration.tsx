"use client";

/* ─── Country Concentration Bar Chart (Recharts) ─────────── */

import type { ConcentrationAnalytics } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Globe } from "lucide-react";

interface CountryConcentrationProps {
  analytics: ConcentrationAnalytics;
}

const COUNTRY_SHORT: Record<string, string> = {
  Taiwan: "Taiwan",
  "United States": "USA",
  Netherlands: "NL",
  "South Korea": "S.Korea",
  China: "China",
  "United Kingdom": "UK",
};

const BAR_COLORS = [
  "#FF6B35",
  "#F5F5F5",
  "#888888",
  "#FF3B3B",
  "#555555",
  "#333333",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-xs shadow-xl">
        <div className="font-semibold text-[#F5F5F5] mb-1">
          {data.country} {data.country_flag}
        </div>
        <div className="text-[#666666]">
          Critical Nodes: <span className="text-[#F5F5F5] font-mono">{data.critical_node_count}</span>
        </div>
        <div className="text-[#666666]">
          Share: <span className="text-[#F5F5F5] font-mono">{data.critical_node_percentage}%</span>
        </div>
        {data.node_names.length > 0 && (
          <div className="text-[#666666] mt-1 text-[10px]">
            {data.node_names.join(", ")}
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function CountryConcentration({
  analytics,
}: CountryConcentrationProps) {
  const chartData = analytics.by_country
    .filter((c) => c.critical_node_count > 0)
    .map((c) => ({
      ...c,
      shortName: COUNTRY_SHORT[c.country] || c.country,
    }));

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <Globe size={14} className="text-[#FF6B35]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#666666] font-bold">
          Country Concentration
        </h2>
        <span
          className="ml-auto text-xs font-semibold font-mono px-1.5 py-0.5 rounded"
          style={{
            color: analytics.concentration_score > 50 ? "#FF3B3B" : "#FF6B35",
            background:
              analytics.concentration_score > 50
                ? "rgba(255, 59, 59, 0.08)"
                : "rgba(255, 107, 53, 0.08)",
          }}
        >
          Risk: {analytics.concentration_score.toFixed(0)}/100
        </span>
      </div>

      <div className="w-full h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#666666" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              tick={{ fontSize: 11, fill: "#F5F5F5", fontWeight: "bold" }}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(42, 42, 42, 0.4)" }}
            />
            <Bar
              dataKey="critical_node_percentage"
              radius={[0, 4, 4, 0]}
              barSize={14}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
