"use client";

import { useState } from "react";
import { Info as InfoIcon, Filter as FilterIcon } from "lucide-react";

interface HeaderProps {
  onGraphControlsClick: () => void;
}

export default function Header({ onGraphControlsClick }: HeaderProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          height: "40px",
          background: "rgba(26, 26, 26, 0.95)",
          border: "1px solid #2A2A2A",
          borderRadius: "999px",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          whiteSpace: "nowrap",
          minWidth: "max-content",
        }}
      >
        {/* 1. Coral square */}
        <div
          style={{
            width: "10px",
            height: "10px",
            background: "#FF6B35",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />

        {/* 2. Title text */}
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#F5F5F5",
            whiteSpace: "nowrap",
          }}
        >
          Infocreon Internship
        </span>

        {/* 3. Divider */}
        <div
          style={{
            width: "1px",
            height: "16px",
            background: "#2A2A2A",
            flexShrink: 0,
          }}
        />

        {/* 4. Subtitle */}
        <span
          style={{
            fontSize: "11px",
            color: "#666666",
            whiteSpace: "nowrap",
          }}
        >
          Chip Supply Chain &middot; PoC #93
        </span>

        {/* 5. Spacer */}
        <div style={{ flex: 1, minWidth: "24px" }} />

        {/* Graph Controls Button */}
        <button
          onClick={onGraphControlsClick}
          style={{
            height: "28px",
            padding: "0 12px",
            borderRadius: "999px",
            background: "transparent",
            border: "1px solid #2A2A2A",
            color: "#666666",
            fontSize: "11px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
          className="hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
        >
          <FilterIcon size={12} />
          Graph Controls
        </button>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "16px",
            background: "#2A2A2A",
            flexShrink: 0,
          }}
        />

        {/* 7. Info button */}
        <button
          onClick={() => setIsInfoOpen(true)}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "999px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666666",
          }}
        >
          <InfoIcon size={14} />
        </button>
      </header>

      {/* Info Modal */}
      {isInfoOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2A2A2A",
              borderRadius: "4px",
              padding: "24px",
              minWidth: "280px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button top right */}
            <button
              onClick={() => setIsInfoOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "transparent",
                border: "none",
                color: "#666666",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              &times;
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#666666", letterSpacing: "0.15em", marginBottom: "4px" }}>
                  ARCHITECT
                </div>
                <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500 }}>
                  Sangeeth PS
                </div>
              </div>
              <div style={{ height: "1px", background: "#2A2A2A" }} />
              
              <div>
                <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#666666", letterSpacing: "0.15em", marginBottom: "4px" }}>
                  POC ID
                </div>
                <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500, fontFamily: "monospace" }}>
                  93
                </div>
              </div>
              <div style={{ height: "1px", background: "#2A2A2A" }} />

              <div>
                <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#666666", letterSpacing: "0.15em", marginBottom: "4px" }}>
                  POC TITLE
                </div>
                <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500 }}>
                  Chip Supply Chain Dependency Graph
                </div>
              </div>
              <div style={{ height: "1px", background: "#2A2A2A" }} />

              <div>
                <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#666666", letterSpacing: "0.15em", marginBottom: "4px" }}>
                  BATCH
                </div>
                <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500 }}>
                  Batch 4
                </div>
              </div>
              <div style={{ height: "1px", background: "#2A2A2A" }} />

              <div>
                <div style={{ fontSize: "10px", textTransform: "uppercase", color: "#666666", letterSpacing: "0.15em", marginBottom: "4px" }}>
                  STACK
                </div>
                <div style={{ fontSize: "14px", color: "#F5F5F5", fontWeight: 500 }}>
                  Next.js &middot; FastAPI &middot; React Flow &middot; Recharts
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
