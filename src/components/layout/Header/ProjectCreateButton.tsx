'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const ProjectCreateButton = () => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { addNewlyCreatedProject, getToken } = useAppStore();

  const handleCreateProject = useCallback(async () => {
    setIsCreating(true);
    toast({
      title: 'Creating Project',
      description: 'Please wait while we set things up...',
    });

    try {
      const token = getToken();
      const response = await fetch('/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'Creation Failed',
          description: result.message || 'Something went wrong.',
        });
        return;
      }
      const newProject = result.data;
      await addNewlyCreatedProject(newProject);
      toast({
        title: 'Project Created Successfully!',
        description: 'Redirecting to your new project...',
      });
      router.push(`/editor/${newProject.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: 'Failed to create a project. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  }, [addNewlyCreatedProject, getToken, router]);
  return (
    <Button onClick={handleCreateProject} disabled={isCreating} className={'inline-flex'}>
      {isCreating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline-flex">Creating...</span>
        </>
      ) : (
        <>
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline-flex">New Project</span>
        </>
      )}
    </Button>
  );
};

export default ProjectCreateButton;
