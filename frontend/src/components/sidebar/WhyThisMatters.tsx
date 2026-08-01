"use client";

/* ─── Section B: Why This Matters ────────────────────────── */

import { AlertCircle } from "lucide-react";

interface WhyThisMattersProps {
  content: string;
}

export default function WhyThisMatters({ content }: WhyThisMattersProps) {
  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <AlertCircle size={14} className="text-[#FF6B35]" strokeWidth={2.5} />
        <h2 className="text-xs uppercase tracking-[0.15em] text-[#666666] font-bold">
          Why This Matters
        </h2>
      </div>
      <p className="text-sm text-[#666666] leading-relaxed font-normal">
        {content}
      </p>
    </div>
  );
}
