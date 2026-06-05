"use client";

/* ─── Analytics Tab (Country Charts & Network Metrics) ───────────────── */

import type { ConcentrationAnalytics, BottleneckEntry, EdgeData } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Globe, ShieldAlert, Layers, Split } from "lucide-react";

interface AnalyticsTabProps {
  analytics: ConcentrationAnalytics;
  bottlenecks: BottleneckEntry[];
  edges: EdgeData[];
}

const COUNTRY_SHORT: Record<string, string> = {
  Taiwan: "Taiwan",
  "United States": "USA",
  Netherlands: "NL",
  "South Korea": "S.Korea",
  China: "China",
  "United Kingdom": "UK",
};

const BAR_COLORS = ["#38BDF8", "#818CF8", "#F59E0B", "#10B981", "#EF4444", "#6B7280"];

const STAGE_LABELS_LOCAL: Record<string, string> = {
  design: "Design",
  fabrication: "Fabrication",
  equipment: "Equipment",
  memory: "Memory",
  packaging: "Packaging",
  consumer: "Consumer",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-xs shadow-xl border border-[#1F2937]">
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

export default function AnalyticsTab({
  analytics,
  bottlenecks,
  edges,
}: AnalyticsTabProps) {
  // 1. Chart Data
  const chartData = analytics.by_country
    .filter((c) => c.critical_node_count > 0)
    .map((c) => ({
      ...c,
      shortName: COUNTRY_SHORT[c.country] || c.country,
    }));

  // 2. Top Risk Countries (sorted by critical count descending)
  const topRiskCountries = [...analytics.by_country]
    .filter((c) => c.critical_node_count > 0)
    .sort((a, b) => b.critical_node_count - a.critical_node_count);

  // 3. Critical Node Distribution by Stage
  const stageDistribution = bottlenecks.reduce((acc, b) => {
    const stg = b.stage.toLowerCase();
    acc[stg] = (acc[stg] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 4. Dependency Breakdown
  const dependencyBreakdown = edges.reduce((acc, e) => {
    const type = e.dependency_type || "primary";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none">
      {/* Concentration Score & Chart */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Globe size={13} className="text-[#818CF8]" />
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
            Country Concentration Risk
          </div>
          <span
            className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold"
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

        {/* Chart */}
        <div className="w-full h-[140px] bg-[#111827]/20 border border-[#1F2937]/50 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="shortName"
                tick={{ fontSize: 10, fill: "#D1D5DB", fontWeight: "bold" }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(31, 41, 55, 0.2)" }}
              />
              <Bar
                dataKey="critical_node_percentage"
                radius={[0, 4, 4, 0]}
                barSize={12}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Risk Countries List */}
      <div className="border-t border-[#1F2937]/50 pt-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <ShieldAlert size={13} className="text-[#EF4444]" />
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
            Top Risk Countries
          </div>
        </div>
        <div className="space-y-1.5">
          {topRiskCountries.map((c) => (
            <div
              key={c.country}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827]/40 border border-[#1F2937]/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs leading-none">{c.country_flag}</span>
                <span className="text-xs text-[#E5E7EB] font-medium">{c.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#9CA3AF]">
                  Critical Nodes: <strong className="text-white font-mono">{c.critical_node_count}</strong>
                </span>
                <span className="text-[10px] font-mono text-[#EF4444] font-semibold">
                  {c.critical_node_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Node Distribution */}
      <div className="border-t border-[#1F2937]/50 pt-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Layers size={13} className="text-[#F59E0B]" />
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
            Critical Node Distribution by Stage
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(STAGE_LABELS_LOCAL).map(([key, label]) => {
            const count = stageDistribution[key] || 0;
            return (
              <div
                key={key}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111827]/20 border border-[#1F2937]/30 text-xs"
              >
                <span className="text-[#9CA3AF]">{label}</span>
                <span className={`font-mono font-bold ${count > 0 ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dependency Breakdown */}
      <div className="border-t border-[#1F2937]/50 pt-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Split size={13} className="text-[#38BDF8]" />
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
            Dependency Breakdown
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111827]/40 border border-[#1F2937]/50 text-xs">
            <span className="text-[#EF4444] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              Sole Supplier Dependencies
            </span>
            <span className="font-mono font-extrabold text-white">
              {dependencyBreakdown.sole_supplier || 0}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111827]/40 border border-[#1F2937]/50 text-xs">
            <span className="text-[#38BDF8] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              Primary Dependencies
            </span>
            <span className="font-mono font-extrabold text-white">
              {dependencyBreakdown.primary || 0}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111827]/40 border border-[#1F2937]/50 text-xs">
            <span className="text-[#F59E0B] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              Secondary Dependencies
            </span>
            <span className="font-mono font-extrabold text-white">
              {dependencyBreakdown.secondary || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
