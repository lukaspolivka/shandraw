'use client';
import { Node, Edge } from 'reactflow';
import ELK, { ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
const elk = new ELK();

const elkOptions: LayoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.layered.spacing.nodeNodeBetweenLayers': '150',
  'elk.spacing.nodeNode': '100',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.separateConnectedComponents': 'true',
  'elk.padding': '[top=40,left=40,bottom=40,right=40]',
};

export const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  if (nodes.length === 0) return { nodes, edges };

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width ?? 250,
      height: node.height ?? 150,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    const layoutedNodes = nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((child: any) => child.id === node.id);
      if (layoutedNode) {
        return {
          ...node,
          position: { x: layoutedNode.x ?? 0, y: layoutedNode.y ?? 0 },
        };
      }
      return node;
    });

    return { nodes: layoutedNodes, edges };
  } catch (error) {
    console.error('ELK layout error:', error);
    return { nodes, edges };
  }
};
