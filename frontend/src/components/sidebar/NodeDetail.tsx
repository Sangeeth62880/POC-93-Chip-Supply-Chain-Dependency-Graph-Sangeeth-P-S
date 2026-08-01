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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none text-[#666666]">
        <div className="w-12 h-12 rounded-full border border-[#2A2A2A] flex items-center justify-center mb-3 bg-[#1A1A1A]/40 text-[#666666]">
          <Building2 size={18} />
        </div>
        <div className="text-xs font-bold text-[#F5F5F5] mb-1 uppercase tracking-wider">No Company Selected</div>
        <p className="text-[11px] text-[#666666] max-w-[200px] leading-relaxed">
          Select a node on the graph to display its intelligence profile and chokepoints.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden select-none">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs text-[#666666] animate-pulse">Loading profile...</div>
        </div>
      ) : detail ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Profile Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-extrabold text-[#F5F5F5] leading-tight">
                  {detail.node.label}
                </span>
                <span className="text-base leading-none">{detail.node.country_flag}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded"
                  style={{
                    color: detail.node.color,
                    background: `${detail.node.color}08`,
                  }}
                >
                  {detail.node.stage}
                </span>
                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded risk-${detail.node.risk_level}`}>
                  {detail.node.risk_level}
                </span>
                {detail.node.is_bottleneck && (
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-sm risk-critical">
                    ⚠ Bottleneck
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClearSelection}
              className="text-[10px] text-[#666666] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] px-2 py-0.5 rounded transition-all bg-transparent border-0 cursor-pointer font-semibold"
            >
              Clear
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="bg-[#111111] border border-[#2A2A2A] rounded p-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666666] font-bold mb-0.5">Country</div>
              <div className="text-xs font-semibold text-[#F5F5F5] truncate">{detail.node.country}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666666] font-bold mb-0.5">Market Share</div>
              <div className="text-xs font-bold text-[#F5F5F5] font-mono">{formatPercent(detail.node.market_share)}</div>
            </div>
            {detail.node.revenue_usd && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#666666] font-bold mb-0.5">Revenue</div>
                <div className="text-xs font-bold text-[#F5F5F5] font-mono truncate">{formatUSD(detail.node.revenue_usd)}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#666666] font-bold mb-0.5">Alternatives</div>
              <div className="flex items-center gap-1 mt-0.5">
                {detail.node.no_alternatives ? (
                  <>
                    <AlertTriangle size={11} className="text-[#FF3B3B]" />
                    <span className="text-xs font-bold text-[#FF3B3B]">None</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={11} className="text-[#FF6B35]" />
                    <span className="text-xs font-bold text-[#FF6B35]">Available</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#666666] font-bold">Company Profile</div>
              <p className="text-xs text-[#666666] leading-relaxed">{detail.node.description}</p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[#FF3B3B] font-bold">Failure Impact Analysis</div>
              <p className="text-xs text-[#666666] leading-relaxed">{detail.node.risk_if_fails}</p>
            </div>

            {detail.node.bottleneck_reason && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[#FF6B35] font-bold">Chokepoint Justification</div>
                <p className="text-xs text-[#666666] leading-relaxed">{detail.node.bottleneck_reason}</p>
              </div>
            )}
          </div>

          {/* Dependencies In (Depends On) */}
          {detail.incoming_edges.length > 0 && (
            <div className="border-t border-[#2A2A2A]/50 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowRight size={12} className="text-[#FF6B35]" />
                <span className="text-[10px] uppercase tracking-wider text-[#666666] font-bold">
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
                      className="w-full text-left bg-[#111111] border border-[#2A2A2A] rounded px-2.5 py-1.5 flex items-center justify-between hover:border-[#FF6B35]/20 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs text-[#F5F5F5] font-semibold truncate group-hover:text-[#FF6B35] transition-colors">
                          {srcNode?.label || e.source}
                        </div>
                        <div className="text-[10px] text-[#666666] font-mono mt-0.5">
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
            <div className="border-t border-[#2A2A2A]/50 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowLeft size={12} className="text-[#FF6B35]" />
                <span className="text-[10px] uppercase tracking-wider text-[#666666] font-bold">
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
                      className="w-full text-left bg-[#111111] border border-[#2A2A2A] rounded px-2.5 py-1.5 flex items-center justify-between hover:border-[#FF6B35]/20 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-xs text-[#F5F5F5] font-semibold truncate group-hover:text-[#FF6B35] transition-colors">
                          {tgtNode?.label || e.target}
                        </div>
                        <div className="text-[10px] text-[#666666] font-mono mt-0.5">
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
          <div className="text-xs text-[#FF3B3B]">Profile load error</div>
        </div>
      )}
    </div>
  );
}
