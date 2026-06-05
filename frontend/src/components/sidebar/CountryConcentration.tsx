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
  "#38BDF8",
  "#818CF8",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#6B7280",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl">
        <div className="font-semibold text-[#E5E7EB] mb-1">
          {data.country} {data.country_flag}
        </div>
        <div className="text-[#9CA3AF]">
          Critical Nodes: <span className="text-[#E5E7EB] font-mono">{data.critical_node_count}</span>
        </div>
        <div className="text-[#9CA3AF]">
          Share: <span className="text-[#E5E7EB] font-mono">{data.critical_node_percentage}%</span>
        </div>
        {data.node_names.length > 0 && (
          <div className="text-[#6B7280] mt-1 text-[10px]">
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
        <Globe size={14} className="text-[#818CF8]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#9CA3AF] font-bold">
          Country Concentration
        </h2>
        <span
          className="ml-auto text-xs font-semibold font-mono px-1.5 py-0.5 rounded"
          style={{
            color: analytics.concentration_score > 50 ? "#EF4444" : "#F59E0B",
            background:
              analytics.concentration_score > 50
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(245, 158, 11, 0.1)",
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
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              tick={{ fontSize: 11, fill: "#D1D5DB", fontWeight: "bold" }}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(31, 41, 55, 0.3)" }}
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
