"use client";

/* ─── Section E: Download Sample Data Button ─────────────── */

import type { GraphResponse } from "@/lib/types";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  graphData: GraphResponse;
}

export default function DownloadButton({ graphData }: DownloadButtonProps) {
  const handleDownload = () => {
    const exportData = {
      metadata: {
        title: "Chip Supply Chain Dependency Graph",
        project: "Real Rails PoC #93",
        data_source: graphData.data_source,
        timestamp: new Date().toISOString(),
        attribution: [
          "UN Comtrade (https://comtradeplus.un.org/)",
          "World Bank Data (https://data.worldbank.org/)",
          "Synthetic firm-to-firm dependency graph",
        ],
      },
      nodes: graphData.nodes,
      edges: graphData.edges,
      analytics: graphData.analytics,
      metrics: graphData.metrics,
      bottlenecks: graphData.bottlenecks,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `real-rails-poc93-chip-supply-chain-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-3">
      <button
        onClick={handleDownload}
        className="
          w-full flex items-center justify-center gap-2
          px-4 py-2.5 rounded-lg
          text-xs font-semibold uppercase tracking-wider
          bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20
          hover:bg-[#38BDF8]/20 hover:border-[#38BDF8]/40
          active:scale-[0.98]
          transition-all duration-200
          cyan-glow
        "
      >
        <Download size={13} strokeWidth={2.5} />
        Download Sample Data
      </button>
    </div>
  );
}
