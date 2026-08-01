"use client";

/* ─── Section C: Who Controls the Rail ───────────────────── */

import type { ControllerEntry } from "@/lib/types";
import { Shield } from "lucide-react";

interface WhoControlsTheRailProps {
  content: string;
  controllers: ControllerEntry[];
}

export default function WhoControlsTheRail({
  content,
  controllers,
}: WhoControlsTheRailProps) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <Shield size={14} className="text-[#FF3B3B]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#666666] font-bold">
          Who Controls the Rail
        </h2>
      </div>
      <p className="text-sm text-[#666666] leading-relaxed mb-3.5 font-normal">
        {content}
      </p>

      {/* Top Controllers List */}
      <div className="space-y-2">
        {controllers.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center gap-3 bg-[#111111] border border-[#2A2A2A] rounded px-3 py-2.5"
          >
            <span className="text-xs font-mono text-[#666666] w-4 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#F5F5F5] truncate">
                {c.name}
              </div>
              <div className="text-xs text-[#666666] truncate mt-0.5">
                {c.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
