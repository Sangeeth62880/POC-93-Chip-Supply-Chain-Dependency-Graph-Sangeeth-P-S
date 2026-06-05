"use client";

/* ─── Node Details Tab Content (Inline Profile View) ─────────────────── */

import { useEffect, useState } from "react";
import type { NodeDetailResponse } from "@/lib/types";
import { fetchNodeDetail, formatUSD, formatPercent } from "@/lib/api";
import { ArrowRight, ArrowLeft, Building2, AlertTriangle, ShieldCheck } from "lucide-react";

interface NodeDetailProps {
  nodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  onClearSelection: () => void;
}

export default function NodeDetail({ nodeId, onNodeClick, onClearSelection }: NodeDetailProps) {
  const [detail, setDetail] = useState<NodeDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nodeId) {
      const timer = setTimeout(() => {
        setDetail(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetchNodeDetail(nodeId).then(({ data }) => {
        setDetail(data);
        setLoading(false);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [nodeId]);

  if (!nodeId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none text-[#9CA3AF]">
        <div className="w-12 h-12 rounded-full border border-[#1F2937] flex items-center justify-center mb-3 bg-[#111827]/40 text-[#6B7280]">
          <Building2 size={18} />
        </div>
        <div className="text-xs font-bold text-white mb-1 uppercase tracking-wider">No Company Selected</div>
        <p className="text-[11px] text-[#6B7280] max-w-[200px] leading-relaxed">
          Select a node on the graph to display its intelligence profile and chokepoints.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs text-[#9CA3AF] animate-pulse">Loading profile...</div>
        </div>
      ) : detail ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Profile Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-extrabold text-white leading-tight">
                  {detail.node.label}
                </span>
                <span className="text-base leading-none">{detail.node.country_flag}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded"
                  style={{
                    color: detail.node.color,
                    background: `${detail.node.color}15`,
                  }}
                >
                  {detail.node.stage}
                </span>
                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${detail.node.risk_level}`}>
                  {detail.node.risk_level}
                </span>
                {detail.node.is_bottleneck && (
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                    ⚠ Bottleneck
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClearSelection}
              className="text-[10px] text-[#EF4444] hover:underline bg-transparent border-0 cursor-pointer font-semibold"
            >
              Clear
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="glass-card rounded-xl p-3 grid grid-cols-2 gap-3 border border-[#1F2937]">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">Country</div>
              <div className="text-xs font-semibold text-[#E5E7EB] truncate">{detail.node.country}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">Market Share</div>
              <div className="text-xs font-bold text-[#E5E7EB] font-mono">{formatPercent(detail.node.market_share)}</div>
            </div>
            {detail.node.revenue_usd && (
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">Revenue</div>
                <div className="text-xs font-bold text-[#E5E7EB] font-mono truncate">{formatUSD(detail.node.revenue_usd)}</div>
              </div>
            )}
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-0.5">Alternatives</div>
              <div className="flex items-center gap-1 mt-0.5">
                {detail.node.no_alternatives ? (
                  <>
                    <AlertTriangle size={11} className="text-[#EF4444]" />
                    <span className="text-xs font-bold text-[#EF4444]">None</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={11} className="text-[#10B981]" />
                    <span className="text-xs font-bold text-[#10B981]">Available</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold">Company Profile</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">{detail.node.description}</p>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-[#EF4444] font-bold">Failure Impact Analysis</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">{detail.node.risk_if_fails}</p>
            </div>

            {detail.node.bottleneck_reason && (
              <div className="space-y-1">
                <div className="text-[9px] uppercase tracking-wider text-[#F59E0B] font-bold">Chokepoint Justification</div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">{detail.node.bottleneck_reason}</p>
              </div>
            )}
          </div>

          {/* Dependencies In (Depends On) */}
          {detail.incoming_edges.length > 0 && (
            <div className="border-t border-[#1F2937]/50 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowRight size={12} className="text-[#38BDF8]" />
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                  Depends On ({detail.incoming_edges.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {detail.incoming_edges.map((e) => {
                  const srcNode = detail.connected_nodes.find((n) => n.id === e.source);
                  return (
                    <button
                      key={e.id}
                      onClick={() => onNodeClick(e.source)}
                      className="w-full text-left glass-card rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-[#1F2937] hover:border-[#38BDF8]/40 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs text-[#E5E7EB] font-semibold truncate group-hover:text-[#38BDF8] transition-colors">
                          {srcNode?.label || e.source}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">
                          {formatUSD(e.annual_value_usd)}
                        </div>
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${e.risk_level} shrink-0`}>
                        {e.dependency_type.replace("_", " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Supplies To */}
          {detail.outgoing_edges.length > 0 && (
            <div className="border-t border-[#1F2937]/50 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowLeft size={12} className="text-[#818CF8]" />
                <span className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                  Supplies To ({detail.outgoing_edges.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {detail.outgoing_edges.map((e) => {
                  const tgtNode = detail.connected_nodes.find((n) => n.id === e.target);
                  return (
                    <button
                      key={e.id}
                      onClick={() => onNodeClick(e.target)}
                      className="w-full text-left glass-card rounded-lg px-2.5 py-1.5 flex items-center justify-between border border-[#1F2937] hover:border-[#818CF8]/40 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs text-[#E5E7EB] font-semibold truncate group-hover:text-[#818CF8] transition-colors">
                          {tgtNode?.label || e.target}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">
                          {formatUSD(e.annual_value_usd)}
                        </div>
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${e.risk_level} shrink-0`}>
                        {e.dependency_type.replace("_", " ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs text-[#EF4444]">Profile load error</div>
        </div>
      )}
    </div>
  );
}
