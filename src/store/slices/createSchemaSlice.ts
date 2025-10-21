import { parseDBML } from '@/lib/dbml/parser';
import { StoreSlice } from '../useAppStore';
import { DBML_HELP_TEXT } from '../utils';

export interface SchemaSlice {
  schemaCode: string;
  setSchemaCode: (code: string) => void;
  updateDiagram: () => Promise<void>;
  appendSchemaCode: (code: string) => void;
  navigateToTable: (tableName: string) => void;
  navigateToColumn: (tableName: string, columnName: string) => void;
  editorView: any | null;
  setEditorView: (view: any) => void;
}

export const createSchemaSlice: StoreSlice<SchemaSlice> = (set, get) => ({
  schemaCode: DBML_HELP_TEXT,
  editorView: null,
  setEditorView: (view) => {
    set({ editorView: view });
  },
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
  navigateToTable: (tableName) => {
    const { schemaCode, editorView } = get();
    if (!editorView) {
      return;
    }

    const tableRegex = new RegExp(`Table\\s+${tableName}\\s*{`, 'i');
    const match = tableRegex.exec(schemaCode);

    if (match) {
      const position = match.index;

      const lineLength = schemaCode.substring(position).split('\n')[0].length;
      const transaction = editorView.state.update({
        selection: { anchor: position + lineLength },
        scrollIntoView: true
      });

      editorView.dispatch(transaction);
      editorView.focus();
    }
  },
  navigateToColumn: (tableName, columnName) => {
    console.log("navigating to column: '" + columnName + "' in table: '" + tableName + "'");
    const { schemaCode, editorView } = get();
    if (!editorView) {
      return;
    }

    const tableRegex = new RegExp(`Table\\s+${tableName}\\s*{([\\s\\S]*?)}`, 'i');
    const tableMatch = tableRegex.exec(schemaCode);

    if (tableMatch) {
      const tableContent = tableMatch[1];
      const tableStartPosition = tableMatch.index;

      const columnRegex = new RegExp(`\\s+${columnName}\\s+[\\w\\(\\)]+`, 'i');
      const columnMatch = columnRegex.exec(tableContent);

      if (columnMatch) {
        const columnPosition = tableStartPosition + tableMatch[0].indexOf(columnMatch[0]) + 1;

        const lineLength = schemaCode.substring(columnPosition).split('\n')[0].length;
        const transaction = editorView.state.update({
          selection: { anchor: columnPosition +  lineLength},
          scrollIntoView: true
        });

        editorView.dispatch(transaction);
        editorView.focus();
      }
    }
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
