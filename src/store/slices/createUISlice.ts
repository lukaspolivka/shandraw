import { StoreSlice } from '../useAppStore';

export interface UISlice {
  isDiagramVisible: boolean;
  isEditorVisible: boolean;
  exportRequest: { format: 'png' | 'svg' | 'pdf'; timestamp: number } | null;
  toggleDiagramVisibility: () => void;
  toggleEditorVisibility: () => void;
  triggerExport: (format: 'png' | 'svg' | 'pdf') => void;
  clearExportRequest: () => void;
}

export const createUISlice: StoreSlice<UISlice> = (set) => ({
  isDiagramVisible: true,
  isEditorVisible: true,
  exportRequest: null,
  toggleDiagramVisibility: () => set((state) => ({ isDiagramVisible: !state.isDiagramVisible })),
  toggleEditorVisibility: () => set((state) => ({ isEditorVisible: !state.isEditorVisible })),
  triggerExport: (format) => set({ exportRequest: { format, timestamp: Date.now() } }),
  clearExportRequest: () => set({ exportRequest: null }),
});
