/* ─── Deterministic Stage Column Layout for React Flow ────────────────── */

import { Position, type Node, type Edge } from "@xyflow/react";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 95; // Satisfies 90px+ min-height requirement
const COLUMN_WIDTH = 270; // Width of each stage column

const STAGE_ORDER: Record<string, number> = {
  design: 0,
  fabrication: 1,
  equipment: 2,
  memory: 3,
  packaging: 4,
  consumer: 5,
};

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR"
): { nodes: Node[]; edges: Edge[] } {
  const containerHeight = 620; // Vertically bounds the graph viewport
  const verticalGap = 16;      // Space between cards

  // Group nodes by stage index
  const nodesByStage: Record<number, Node[]> = {};
  for (let i = 0; i < 6; i++) {
    nodesByStage[i] = [];
  }

  nodes.forEach((node) => {
    const stage = (node.data?.stage as string) || "design";
    const stageIndex = STAGE_ORDER[stage.toLowerCase()] !== undefined ? STAGE_ORDER[stage.toLowerCase()] : 0;
    nodesByStage[stageIndex].push(node);
  });

  // Position nodes within each column
  const layoutedNodes = Object.entries(nodesByStage).flatMap(([stageIndexStr, stageNodes]) => {
    const stageIndex = parseInt(stageIndexStr, 10);
    const N = stageNodes.length;
    if (N === 0) return [];

    // Stable sort by id to ensure position consistency
    stageNodes.sort((a, b) => a.id.localeCompare(b.id));

    // Calculate vertical coordinates to center nodes in the container
    const totalHeight = N * NODE_HEIGHT + (N - 1) * verticalGap;
    const startY = (containerHeight - totalHeight) / 2;

    return stageNodes.map((node, index) => {
      return {
        ...node,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: {
          x: stageIndex * COLUMN_WIDTH + 50, // Centers the 220px node in the 270px column lane (with 25px offset)
          y: startY + index * (NODE_HEIGHT + verticalGap),
        },
      };
    });
  });

  return { nodes: layoutedNodes, edges };
}

