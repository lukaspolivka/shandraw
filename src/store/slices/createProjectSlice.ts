import { ProjectData } from '@/types';
import {
  getNewProjectName,
  parseIfString,
  DBML_HELP_TEXT,
  syncProjectToServer,
  saveToLocalDB,
} from '../utils';
import { StoreSlice } from '../useAppStore';
import {
  clearAllProjectsFromDB,
  deleteProjectFromDB,
  getAllProjectsFromDB,
  getProjectFromDB,
} from '@/lib/indexed-db';
import { toast } from '@/hooks/useToast';
import fetchWithAuth from '@/lib/utils/fetchWithAuth';

export interface ProjectSlice {
  projectId: string | null;
  projectName: string;
  projects: ProjectData[];
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  isSuccess: boolean;
  isPublic: boolean;
  shareId: string | null;
  isDirty: boolean;
  localSaveTimeout: NodeJS.Timeout | null;
  remoteSyncTimeout: NodeJS.Timeout | null;
  setProjectName: (name: string) => void;
  saveProject: () => Promise<string | null>;
  loadProject: (projectId: string) => Promise<void>;
  exportSchema: () => void;
  importSchemaFromFile: (file: File) => void;
  resetProjectState: () => void;
  syncAndFetchProjects: () => Promise<void>;
  addNewlyCreatedProject: (project: ProjectData) => Promise<void>;
  deleteProject: (projectId: string) => Promise<{ success: boolean; message: string }>;
  updateProjectInList: (project: ProjectData) => void;
  handleModification: () => void;
  clearSyncedProjectFromCache: (projectId: string) => void;
}

const initialState = {
  projectId: null,
  projectName: getNewProjectName(),
  projects: [] as ProjectData[],
  isLoading: false,
  isLoaded: false,
  isError: false,
  isSuccess: false,
  isPublic: false,
  shareId: null,
  isDirty: false,
  localSaveTimeout: null,
  remoteSyncTimeout: null,
};

export const createProjectSlice: StoreSlice<ProjectSlice> = (set, get) => {
  const clearTimeouts = () => {
    const { localSaveTimeout, remoteSyncTimeout } = get();
    if (localSaveTimeout) clearTimeout(localSaveTimeout);
    if (remoteSyncTimeout) clearTimeout(remoteSyncTimeout);
  };

  const scheduleSaves = () => {
    clearTimeouts();

    const localTimeout = setTimeout(async () => {
      const { projectId, projectName, schemaCode, nodes, edges, isPublic, shareId } = get();
      if (!projectId) return;

      const projectData: ProjectData = {
        id: projectId,
        projectName,
        schemaCode,
        nodes,
        edges,
        isPublic,
        shareId,
        updatedAt: new Date().toISOString(),
        isDirty: true,
      };

      await saveToLocalDB(projectData);

      const remoteTimeout = setTimeout(() => get().saveProject(), 2 * 60 * 1000);
      set({ remoteSyncTimeout: remoteTimeout });
    }, 500);

    set({ localSaveTimeout: localTimeout });
  };

  return {
    ...initialState,

    setProjectName: (name: string) => {
      set({ projectName: name });
      get().handleModification();
    },

    resetProjectState: () => {
      clearTimeouts();
      set({
        ...initialState,
        projectName: getNewProjectName(),
        isLoaded: true,
        isLoading: false,
        isError: false,
        isSuccess: false,
        schemaCode: DBML_HELP_TEXT,
        nodes: [],
        edges: [],
      });
    },

    handleModification: () => {
      set({ isDirty: true });
      scheduleSaves();
    },

    saveProject: async () => {
      clearTimeouts();
      set({ isLoading: true, isError: false, isSuccess: false });

      const { projectId, projectName, schemaCode, nodes, edges, isPublic, shareId } = get();

      if (!projectId) {
        set({ isLoading: false, isError: true });
        return null;
      }

      if (!projectName.trim()) {
        toast({
          variant: 'destructive',
          title: 'Project Name Required',
          description: 'Please provide a name for your project before saving.',
        });
        set({ isLoading: false, isError: true });
        return null;
      }

      const projectData: ProjectData = {
        id: projectId,
        projectName,
        schemaCode,
        nodes,
        edges,
        updatedAt: new Date().toISOString(),
        isPublic,
        shareId,
      };

      try {
        await syncProjectToServer(projectData);
        set({ isDirty: false, isLoading: false, isSuccess: true });
        toast({
          title: 'Project Saved',
          description: 'Your project has been saved to the cloud.',
        });
        return projectId;
      } catch (error) {
        console.error('Failed to save project remotely:', error);
        set({ isLoading: false, isError: true });
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: 'Could not save to cloud. Your work is safe locally.',
        });
        return null;
      }
    },

    loadProject: async (projectId: string) => {
      set({ isLoading: true, isLoaded: false, isError: false, isSuccess: false });
      try {
        const result = await fetchWithAuth(`/api/project?id=${projectId}`);
        const remoteData = result.data;

        const finalData: ProjectData = {
          ...remoteData,
          schemaCode:
            typeof remoteData.schemaCode === 'string' ? remoteData.schemaCode : DBML_HELP_TEXT,
          nodes: parseIfString(remoteData.nodes),
          edges: parseIfString(remoteData.edges),
          isDirty: false,
        };

        await saveToLocalDB(finalData);

        set({
          ...finalData,
          projectId: finalData.id,
          isLoading: false,
          isLoaded: true,
          isSuccess: true,
        });
      } catch (error) {
        console.warn('Failed to fetch project from server, falling back to local cache.', error);
        const localData = await getProjectFromDB(projectId);
        if (localData?.isDirty) {
          set({
            ...localData,
            schemaCode: typeof localData.schemaCode === 'string' ? localData.schemaCode : '',
            projectId: localData.id,
            isLoading: false,
            isLoaded: true,
            isSuccess: true,
          });
          toast({
            title: 'Offline Mode',
            description: 'Loaded unsaved version from local cache.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Load Failed',
            description: 'Could not load project.',
          });
          get().resetProjectState();
          set({ isLoading: false, isError: true });
        }
      } finally {
        const { schemaCode, nodes } = get();
        if (
          typeof schemaCode === 'string' &&
          schemaCode.trim() &&
          (nodes.length === 0 || !nodes[0]?.position?.x)
        ) {
          await get().updateDiagram?.();
        }
      }
    },

    exportSchema: () => {
      const { schemaCode, projectName } = get();
      if (!schemaCode) return;

      const blob = new Blob([schemaCode], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${projectName.replace(/\s/g, '_')}.dbml`;
      link.click();
      URL.revokeObjectURL(link.href);
    },

    importSchemaFromFile: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        get().setSchemaCode?.(content);
      };
      reader.readAsText(file);
    },

    syncAndFetchProjects: async () => {
      set({ isLoading: true, isError: false, isSuccess: false });
      try {
        const localProjects = await getAllProjectsFromDB();
        const dirtyProjects = localProjects.filter((p) => p.isDirty);
        if (dirtyProjects.length) {
          toast({
            title: 'Syncing...',
            description: 'Saving your offline changes to the cloud.',
          });
          await Promise.all(dirtyProjects.map(syncProjectToServer));
        }

        const result = await fetchWithAuth('/api/project');
        await clearAllProjectsFromDB();
        set({ projects: result.data, isLoading: false, isSuccess: true });
      } catch (error) {
        console.error('Failed to sync or fetch projects:', error);
        set({ isError: true, projects: [], isLoading: false });
        toast({
          variant: 'destructive',
          title: 'Could not fetch projects',
          description: 'Please check your connection.',
        });
      }
    },

    addNewlyCreatedProject: async (project: ProjectData) => {
      const parsedProject = {
        ...project,
        nodes: parseIfString(project.nodes),
        edges: parseIfString(project.edges),
      };
      await saveToLocalDB(parsedProject);
      set((state) => ({ projects: [parsedProject, ...state.projects] }));
    },

    deleteProject: async (projectId: string) => {
      try {
        await deleteProjectFromDB(projectId);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        }));

        await fetchWithAuth(`/api/project?id=${projectId}`, { method: 'DELETE' });

        return { success: true, message: 'Project deleted from local and cloud.' };
      } catch (error) {
        console.error('Failed to delete project remotely:', error);
        return {
          success: false,
          message: 'Could not delete project from the cloud. It remains deleted locally.',
        };
      }
    },

    updateProjectInList: (updatedProject: ProjectData) => {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
      }));
    },

    clearSyncedProjectFromCache: (projectId: string) => {
      deleteProjectFromDB(projectId).catch((e) => {
        console.warn('Failed to clear synced project from cache:', e);
      });
    },
  };
};
