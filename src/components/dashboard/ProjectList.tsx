'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectListSkeleton } from './ProjectListSkeleton';
import { ProjectListEmptyState } from './ProjectListEmptyState';
import { ProjectListErrorState } from './ProjectListErrorState';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { ShareProjectModal } from './ShareProjectModal';

import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';
import type { ProjectData } from '@/types';

export function ProjectList() {
  const { toast } = useToast();
  const { projects, syncAndFetchProjects, deleteProject, isLoading, isError } = useAppStore();

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToShare, setProjectToShare] = useState<ProjectData | null>(null);

  useEffect(() => {
    syncAndFetchProjects();
  }, [syncAndFetchProjects]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!projectToDelete) return;

    const result = await deleteProject(projectToDelete);

    toast({
      variant: result.success ? 'default' : 'destructive',
      title: result.success ? 'Project Deleted' : 'Deletion Failed',
      description: result.message,
    });

    setProjectToDelete(null);
  }, [deleteProject, projectToDelete, toast]);

  if (isLoading && projects.length === 0) {
    return <ProjectListSkeleton />;
  }

  if (isError) {
    return <ProjectListErrorState onRetry={syncAndFetchProjects} />;
  }

  if (!isLoading && projects.length === 0) {
    return <ProjectListEmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={setProjectToDelete}
            onShare={setProjectToShare}
          />
        ))}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Share Modal */}
      {projectToShare && (
        <ShareProjectModal
          project={projectToShare}
          open={true}
          onOpenChange={() => setProjectToShare(null)}
        />
      )}
    </>
  );
}
