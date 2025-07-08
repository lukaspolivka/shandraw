import { FileText, Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';
import { toast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export function ProjectListEmptyState() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const { addNewlyCreatedProject, getToken } = useAppStore();

  const handleCreateNew = async () => {
    setIsCreating(true);
    toast({ title: 'Creating new project...' });
    const token = getToken();
    try {
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
          title: 'Project Creating Failed.',
          description: result.message,
        });
        return null;
      }
      const newProject = result.data;
      await addNewlyCreatedProject(newProject);
      toast({ title: 'Project Created.', description: result.message });
      router.push(`/editor/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create new project:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Could not create a new project. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="py-16 text-center">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating your first database diagram.
      </p>
      <Button onClick={handleCreateNew} disabled={isCreating} className="mt-5">
        {isCreating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-4 w-4" />
        )}
        <span>{isCreating ? 'Creating...' : 'Create New Project'}</span>
      </Button>
    </div>
  );
}
