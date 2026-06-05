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
        <Shield size={14} className="text-[#EF4444]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#9CA3AF] font-bold">
          Who Controls the Rail
        </h2>
      </div>
      <p className="text-sm text-[#D1D5DB] leading-relaxed mb-3.5 font-normal">
        {content}
      </p>

      {/* Top Controllers List */}
      <div className="space-y-2">
        {controllers.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center gap-3 glass-card rounded-lg px-3 py-2.5"
          >
            <span className="text-xs font-mono text-[#6B7280] w-4 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#E5E7EB] truncate">
                {c.name}
              </div>
              <div className="text-xs text-[#9CA3AF] truncate mt-0.5">
                {c.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
