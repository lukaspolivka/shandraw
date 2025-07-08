'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import SchemaEditor from '@/components/editor/SchemaEditor';
import DiagramCanvas from '@/components/editor/DiagramCanvas';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/useToast';
import fetchWithAuth from '@/lib/utils/fetchWithAuth';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

export default function EditorPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const hasCreatedProject = useRef(false);
  const [isPageReady, setIsPageReady] = useState(false);

  const {
    loadProject,
    isDiagramVisible,
    isEditorVisible,
    toggleEditorVisibility,
    resetProjectState,
    clearSyncedProjectFromCache,
  } = useAppStore();

  useEffect(() => {
    const createNewProject = async () => {
      try {
        const result = await fetchWithAuth('/api/project/create', { method: 'POST' });
        hasCreatedProject.current = true;
        router.replace(`/editor/${result.data.id}`);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Project Creation Failed',
          description: error?.message || 'Please try again later.',
        });
        resetProjectState();
      }
    };

    if (projectId === 'new' && !hasCreatedProject.current) {
      hasCreatedProject.current = true;
      createNewProject();
    }

    if (projectId && projectId !== 'new') {
      loadProject(projectId as string).then(() => {
        setIsPageReady(true);
      });
    }
  }, [projectId, router, loadProject, resetProjectState]);

  useEffect(() => {
    return () => {
      const { isDirty, projectId: closedId } = useAppStore.getState();
      if (closedId && !isDirty) {
        clearSyncedProjectFromCache(closedId);
      }
      resetProjectState();
    };
  }, [clearSyncedProjectFromCache, resetProjectState]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isEditorVisible && isDiagramVisible) {
      toggleEditorVisibility();
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (isDiagramVisible || !isEditorVisible) toggleEditorVisibility();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleEditorVisibility, isEditorVisible, isDiagramVisible]);

  const containerClassName = 'h-[calc(100vh-8rem)]';

  if (projectId === 'new' || !isPageReady) {
    return (
      <div className={clsx(containerClassName, 'flex items-center justify-center')}>
        <Loader className="w-5 h-5 mr-2 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-md">Loading editor...</span>
      </div>
    );
  }

  if (isEditorVisible && isDiagramVisible) {
    return (
      <div className={containerClassName}>
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={35} minSize={20}>
            <SchemaEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} minSize={30}>
            <DiagramCanvas />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  if (isEditorVisible)
    return (
      <div className={containerClassName}>
        <SchemaEditor />
      </div>
    );
  if (isDiagramVisible)
    return (
      <div className={containerClassName}>
        <DiagramCanvas />
      </div>
    );

  return (
    <div className={containerClassName}>
      <SchemaEditor />
    </div>
  );
}
