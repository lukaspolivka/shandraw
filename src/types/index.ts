import { Edge, Node } from 'reactflow';

export interface ProjectData {
  id: string;
  projectName: string;
  schemaCode: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: string;
  isPublic: boolean;
  shareId: string | null;
  isDirty?: boolean;
}
