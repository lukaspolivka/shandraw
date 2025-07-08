import { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from 'reactflow';

export type SchemaState = {
  projectId: string | null;
  projectName: string;
  schemaCode: string;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  isDiagramVisible: boolean;
  isEditorVisible: boolean;
  exportRequest: { format: 'png' | 'svg' | 'pdf'; timestamp: number } | null;
  isLoaded: boolean;
  isDirty: boolean;
};

export type SchemaActions = {
  setProjectName: (name: string) => void;
  setSchemaCode: (code: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  toggleDiagramVisibility: () => void;
  toggleEditorVisibility: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateDiagram: () => Promise<void>;
  autoLayout: () => Promise<void>;
  createRelation: (connection: Connection) => void;
  importSchemaFromFile: (file: File) => void;
  resetProjectState: () => void;
  appendSchemaCode: (code: string) => void;
  triggerExport: (format: 'png' | 'svg' | 'pdf') => void;
  clearExportRequest: () => void;
};
