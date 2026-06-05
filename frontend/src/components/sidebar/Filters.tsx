"use client";

/* ─── Filters & Control Panel (Left Panel - 18% width) ────────── */

import type { Stage, RiskLevel } from "@/lib/types";
import {
  STAGE_LABELS,
  STAGE_COLORS,
  ALL_STAGES,
  ALL_RISK_LEVELS,
  RISK_LABELS,
  ALL_COUNTRIES,
} from "@/lib/types";
import { Filter, RotateCcw, AlertTriangle, ShieldAlert } from "lucide-react";

interface FiltersProps {
  activeStages: Stage[];
  activeRiskLevels: RiskLevel[];
  activeCountries: string[];
  bottlenecksOnly: boolean;
  soleSuppliersOnly: boolean;
  onStagesChange: (stages: Stage[]) => void;
  onRiskLevelsChange: (levels: RiskLevel[]) => void;
  onCountriesChange: (countries: string[]) => void;
  onBottlenecksOnlyChange: (val: boolean) => void;
  onSoleSuppliersOnlyChange: (val: boolean) => void;
  onResetFilters: () => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Taiwan: "🇹🇼",
  "United States": "🇺🇸",
  Netherlands: "🇳🇱",
  "South Korea": "🇰🇷",
  China: "🇨🇳",
  "United Kingdom": "🇬🇧",
};

export default function Filters({
  activeStages,
  activeRiskLevels,
  activeCountries,
  bottlenecksOnly,
  soleSuppliersOnly,
  onStagesChange,
  onRiskLevelsChange,
  onCountriesChange,
  onBottlenecksOnlyChange,
  onSoleSuppliersOnlyChange,
  onResetFilters,
}: FiltersProps) {
  const toggleStage = (stage: Stage) => {
    if (activeStages.includes(stage)) {
      onStagesChange(activeStages.filter((s) => s !== stage));
    } else {
      onStagesChange([...activeStages, stage]);
    }
  };

  const toggleRisk = (level: RiskLevel) => {
    if (activeRiskLevels.includes(level)) {
      onRiskLevelsChange(activeRiskLevels.filter((l) => l !== level));
    } else {
      onRiskLevelsChange([...activeRiskLevels, level]);
    }
  };

  const toggleCountry = (country: string) => {
    if (activeCountries.includes(country)) {
      onCountriesChange(activeCountries.filter((c) => c !== country));
    } else {
      onCountriesChange([...activeCountries, country]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1117] border-r border-[#1F2937] px-4 py-5 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={15} className="text-[#38BDF8]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF] font-black">
          Graph Controls
        </h2>
      </div>

      <div className="flex-1 space-y-5">
        {/* Toggle Controls */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
            Quick Analysis
          </div>
          
          {/* Bottleneck Toggle */}
          <button
            onClick={() => onBottlenecksOnlyChange(!bottlenecksOnly)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              bottlenecksOnly
                ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444] font-semibold"
                : "bg-[#111827] border-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB]"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} className={bottlenecksOnly ? "text-[#EF4444]" : "text-[#9CA3AF]"} />
              <span className="text-xs">Bottlenecks Only</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
              bottlenecksOnly ? "border-[#EF4444] bg-[#EF4444] text-white" : "border-[#4B5563]"
            }`}>
              {bottlenecksOnly && "✓"}
            </div>
          </button>

          {/* Sole Supplier Toggle */}
          <button
            onClick={() => onSoleSuppliersOnlyChange(!soleSuppliersOnly)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              soleSuppliersOnly
                ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444] font-semibold"
                : "bg-[#111827] border-[#1F2937] text-[#9CA3AF] hover:text-[#E5E7EB]"
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={13} className={soleSuppliersOnly ? "text-[#EF4444]" : "text-[#9CA3AF]"} />
              <span className="text-xs">Sole Suppliers Only</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
              soleSuppliersOnly ? "border-[#EF4444] bg-[#EF4444] text-white" : "border-[#4B5563]"
            }`}>
              {soleSuppliersOnly && "✓"}
            </div>
          </button>
        </div>

        {/* Stage Filters */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-2">
            Filter by Stage
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onStagesChange([])}
              className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                activeStages.length === 0
                  ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30 font-semibold"
                  : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
              }`}
            >
              All Stages
            </button>
            {ALL_STAGES.map((stage) => (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  activeStages.includes(stage)
                    ? "font-semibold"
                    : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
                }`}
                style={
                  activeStages.includes(stage)
                    ? {
                        color: STAGE_COLORS[stage],
                        background: `${STAGE_COLORS[stage]}12`,
                        borderColor: `${STAGE_COLORS[stage]}45`,
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                  {STAGE_LABELS[stage]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Filters */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-2">
            Filter by Risk
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onRiskLevelsChange([])}
              className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                activeRiskLevels.length === 0
                  ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30 font-semibold"
                  : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
              }`}
            >
              All Risks
            </button>
            {ALL_RISK_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => toggleRisk(level)}
                className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  activeRiskLevels.includes(level)
                    ? `risk-${level} font-semibold`
                    : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
                }`}
              >
                {RISK_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Country Filters */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-2">
            Filter by Country
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onCountriesChange([])}
              className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                activeCountries.length === 0
                  ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30 font-semibold"
                  : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
              }`}
            >
              All Countries
            </button>
            <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {ALL_COUNTRIES.map((country) => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`text-xs w-full text-left px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                    activeCountries.includes(country)
                      ? "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30 font-semibold"
                      : "bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:text-[#E5E7EB]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{COUNTRY_FLAGS[country] || ""}</span>
                    <span>
                      {country.replace("United States", "USA")
                              .replace("South Korea", "S. Korea")
                              .replace("United Kingdom", "UK")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-[#EF4444]/30 text-[#EF4444] rounded-lg text-xs font-semibold bg-[#EF4444]/5 hover:bg-[#EF4444]/15 transition-all duration-200 cursor-pointer"
      >
        <RotateCcw size={12} />
        Reset Filters
      </button>
    </div>
  );
}
