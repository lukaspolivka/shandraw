import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  Node,
  Edge,
} from 'reactflow';
import { getLayoutedElements } from '@/lib/reactflow/layout';
import { StoreSlice } from '../useAppStore';
import { toast } from '@/hooks/useToast';

export interface DiagramSlice {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  createRelation: (connection: Connection) => void;
  autoLayout: () => Promise<void>;
}

export const createDiagramSlice: StoreSlice<DiagramSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    const { edges, schemaCode } = get();
    const deletions = changes.filter((c) => c.type === 'remove');
    if (deletions.length > 0) {
      const edgesToDelete = edges.filter((edge) => deletions.some((d) => d.id === edge.id));

      let currentSchemaCode = schemaCode;
      for (const edge of edgesToDelete) {
        if (!edge.sourceHandle || !edge.targetHandle) continue;

        const [sourceTable, sourceColumn] = edge.id.split('-')[1].split('.');
        const [targetTable, targetColumn] = edge.id.split('-')[2].split('.');

        const refRegex1 = new RegExp(
          `Ref(?:\\s+\\S+)?\\s*:\\s*${sourceTable}\\.${sourceColumn}\\s*[-><]\\s*${targetTable}\\.${targetColumn}\\s*\\n?`,
          'gm'
        );
        const refRegex2 = new RegExp(
          `Ref(?:\\s+\\S+)?\\s*:\\s*${targetTable}\\.${targetColumn}\\s*[-><]\\s*${sourceTable}\\.${sourceColumn}\\s*\\n?`,
          'gm'
        );
        const inlineRefRegex = new RegExp(
          `(\\[[^\\]]*)ref\\s*:\\s*[-><]\\s*${targetTable}\\.${targetColumn}([^\\]]*\\])`
        );
        const inlineRefRegexInverse = new RegExp(
          `(\\[[^\\]]*)ref\\s*:\\s*[-><]\\s*${sourceTable}\\.${sourceColumn}([^\\]]*\\])`
        );

        const removeInlineRef = (match: string, p1: string, p2: string) => {
          const remainingAttrs = (p1 + p2)
            .replace(/, ,/g, ',')
            .replace(/,\]/g, ']')
            .replace(/\[,/g, '[')
            .trim();
          if (remainingAttrs === '[]' || remainingAttrs === '[ ]') return '';
          return remainingAttrs;
        };

        currentSchemaCode = currentSchemaCode
          .replace(refRegex1, '')
          .replace(refRegex2, '')
          .replace(inlineRefRegex, removeInlineRef)
          .replace(inlineRefRegexInverse, removeInlineRef)
          .trim();
      }
      get().setSchemaCode(currentSchemaCode);
    }

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  createRelation: (connection) => {
    const { sourceHandle, targetHandle, source, target } = connection;
    if (!sourceHandle || !targetHandle || !source || !target) return;

    const newEdge = {
      ...connection,
      id: `edge-${sourceHandle}-${targetHandle}`,
      type: 'smoothstep',
      animated: true,
      style: { strokeWidth: 1.5, stroke: 'hsl(var(--chart-2))' },
      markerEnd: { type: 'arrowclosed', color: 'hsl(var(--chart-2))' },
    };

    set({
      edges: addEdge(newEdge, get().edges),
    });

    const [sourceTable, sourceColumn] = sourceHandle.split('-').slice(0, 2);
    const [targetTable, targetColumn] = targetHandle.split('-').slice(0, 2);
    const newRef = `\n\nRef: ${sourceTable}.${sourceColumn} > ${targetTable}.${targetColumn}`;
    get().appendSchemaCode(newRef.trim());
  },
  autoLayout: async () => {
    set({ isLoading: true });
    try {
      const { nodes, edges } = get();
      if (nodes.length === 0) return;
      const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(
        nodes,
        edges
      );
      set({ nodes: [...layoutedNodes], edges: [...layoutedEdges] });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Layout Failed',
        description: 'Could not auto-layout the diagram.',
      });
    } finally {
      set({ isLoading: false });
    }
  },
});
