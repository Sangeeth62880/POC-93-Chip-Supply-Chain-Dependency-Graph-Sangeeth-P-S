import { type Node, type Edge } from "@xyflow/react";
import mockData from "../mock_data.json";

/**
 * Adapter to format node and edge data for React Flow.
 * Defaults to formatting the data from mock_data.json if arguments are omitted.
 */
export function graphAdapter(
  inputNodes?: any[],
  inputEdges?: any[]
): { nodes: Node[]; edges: Edge[] } {
  try {
    const rawNodes = inputNodes || mockData.nodes;
    const rawEdges = inputEdges || mockData.edges;

    if (!rawNodes || !rawEdges) {
      throw new Error("Invalid or missing nodes/edges in data source");
    }

    const nodes: Node[] = rawNodes.map((n: any) => ({
      id: n.id,
      type: "stageNode",
      position: { x: 0, y: 0 },
      data: {
        label: n.label,
        country: n.country,
        country_flag: n.country_flag,
        stage: n.stage,
        color: n.color,
        market_share: n.market_share,
        is_bottleneck: n.is_bottleneck ?? false,
        risk_level: n.risk_level,
        description: n.description,
      },
    }));

    const edges: Edge[] = rawEdges.map((e: any) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "custom",
      data: {
        dependency_type: e.dependency_type,
        risk_level: e.risk_level,
        annual_value_usd: e.annual_value_usd,
        label: e.label || "",
      },
    }));

    return { nodes, edges };
  } catch (error) {
    console.warn(
      "[Real Rails] graphAdapter failed to process graph data, returning empty arrays:",
      error
    );
    return { nodes: [], edges: [] };
  }
}
