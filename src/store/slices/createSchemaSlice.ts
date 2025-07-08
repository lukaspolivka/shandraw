import { parseDBML } from '@/lib/dbml/parser';
import { StoreSlice } from '../useAppStore';
import { DBML_HELP_TEXT } from '../utils';

export interface SchemaSlice {
  schemaCode: string;
  setSchemaCode: (code: string) => void;
  updateDiagram: () => Promise<void>;
  appendSchemaCode: (code: string) => void;
}

export const createSchemaSlice: StoreSlice<SchemaSlice> = (set, get) => ({
  schemaCode: DBML_HELP_TEXT,
  setSchemaCode: (code) => {
    if (typeof code !== 'string') {
      console.warn('Invalid schemaCode detected:', code);
      code = DBML_HELP_TEXT;
    }
    set({ schemaCode: code });
    get().updateDiagram();
    get().handleModification();
  },
  appendSchemaCode: (codeToAppend) => {
    const currentCode = get().schemaCode;
    const newCode =
      (currentCode === DBML_HELP_TEXT || !currentCode.trim() ? '' : currentCode + '\n\n') +
      codeToAppend;
    get().setSchemaCode(newCode);
  },
  updateDiagram: async () => {
    try {
      const { schemaCode } = get();
      if (!schemaCode.trim()) {
        set({ nodes: [], edges: [] });
        return;
      }

      const { nodes: parsedNodes, edges: parsedEdges } = parseDBML(schemaCode);
      const existingNodesMap = new Map(get().nodes.map((node) => [node.id, node]));
      const updatedNodes = parsedNodes.map((pNode) => ({
        ...pNode,
        position: existingNodesMap.get(pNode.id)?.position || pNode.position,
      }));
      set({ nodes: updatedNodes, edges: parsedEdges });
    } catch (error) {
      console.error('Error updating diagram:', error);
      // We may not want to toast on every parse error during typing
    }
  },
});
