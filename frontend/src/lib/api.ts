/* ─── Real Rails PoC #93 — API Fetch Wrapper with Mock Fallback ─── */

import { GraphResponse, NodeDetailResponse } from "./types";
import mockDataJson from "../data/mock_data.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK_SIDEBAR_CONTENT = {
  title: "Chip Supply Chain Dependency Graph",
  subtitle: "Supply Chain Rail · Semiconductor Layer",
  why_this_matters:
    "The global semiconductor supply chain is the most concentrated critical infrastructure on Earth. A single company in the Netherlands — ASML — makes the only machines capable of printing advanced chips. A single fab in Taiwan — TSMC — produces chips for Apple, Nvidia, AMD, and nearly every advanced device. This is not a market. It is a rail. And almost no one controls a redundant track.",
  who_controls_the_rail:
    "Three chokepoints — ASML's EUV monopoly, TSMC's fabrication dominance, and ARM's architecture licensing — mean that export controls, natural disasters, or geopolitical conflict in any one of three locations can halt global chip production.",
  top_controllers: [
    { name: "ASML", role: "EUV Lithography Monopoly" },
    { name: "TSMC", role: "Advanced Node Fabrication" },
    { name: "ARM", role: "CPU/GPU Architecture Licensing" },
    { name: "SK Hynix", role: "HBM Memory for AI Chips" },
    { name: "ASE Group", role: "Advanced Packaging" },
  ],
};

/**
 * Fetch the full graph data from the backend.
 * Falls back to mock_data.json if the API is unreachable.
 */
export async function fetchGraphData(): Promise<{
  data: GraphResponse;
  isMock: boolean;
}> {
  try {
    const res = await fetch(`${API_URL}/api/graph`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data: GraphResponse = await res.json();
    return { data, isMock: data.data_source === "synthetic" };
  } catch {
    console.warn(
      "[Real Rails] API unreachable — falling back to mock data"
    );
    return {
      data: {
        nodes: mockDataJson.nodes,
        edges: mockDataJson.edges,
        sidebar_content: FALLBACK_SIDEBAR_CONTENT,
        metrics: {
          total_nodes: 0,
          critical_bottlenecks: 0,
          countries_at_risk: 0,
          sole_supplier_nodes: 0,
        },
        bottlenecks: [],
        analytics: {
          concentration_score: 0,
          by_country: [],
        },
        data_source: "synthetic",
        timestamp: new Date().toISOString(),
      } as unknown as GraphResponse,
      isMock: true,
    };
  }
}

/**
 * Fetch detail for a single node.
 * Falls back to constructing detail from local mock data.
 */
export async function fetchNodeDetail(
  nodeId: string
): Promise<{
  data: NodeDetailResponse | null;
  isMock: boolean;
}> {
  try {
    const res = await fetch(`${API_URL}/api/graph/node/${nodeId}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data: NodeDetailResponse = await res.json();
    return { data, isMock: false };
  } catch {
    // Build detail from mock data
    const node = mockDataJson.nodes.find((n) => n.id === nodeId);
    if (!node) return { data: null, isMock: true };

    const incoming = mockDataJson.edges.filter((e) => e.target === nodeId);
    const outgoing = mockDataJson.edges.filter((e) => e.source === nodeId);
    const connectedIds = new Set([
      ...incoming.map((e) => e.source),
      ...outgoing.map((e) => e.target),
    ]);
    const connectedNodes = mockDataJson.nodes.filter((n) =>
      connectedIds.has(n.id)
    );

    return {
      data: {
        node: node as any,
        incoming_edges: incoming as any,
        outgoing_edges: outgoing as any,
        connected_nodes: connectedNodes as any,
      },
      isMock: true,
    };
  }
}

/**
 * Format large USD values for display.
 */
export function formatUSD(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

/**
 * Format market share percentage.
 */
export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value}%`;
}
