/* ─── Real Rails PoC #93 — API Fetch Wrapper with Mock Fallback ─── */

import { GraphResponse, NodeDetailResponse } from "./types";
import mockDataJson from "./mock_data.json";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      data: mockDataJson as unknown as GraphResponse,
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
    const mock = mockDataJson as unknown as GraphResponse;
    const node = mock.nodes.find((n) => n.id === nodeId);
    if (!node) return { data: null, isMock: true };

    const incoming = mock.edges.filter((e) => e.target === nodeId);
    const outgoing = mock.edges.filter((e) => e.source === nodeId);
    const connectedIds = new Set([
      ...incoming.map((e) => e.source),
      ...outgoing.map((e) => e.target),
    ]);
    const connectedNodes = mock.nodes.filter((n) =>
      connectedIds.has(n.id)
    );

    return {
      data: { node, incoming_edges: incoming, outgoing_edges: outgoing, connected_nodes: connectedNodes },
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
