'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PlusCircle, Menu, Loader2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { UserNav } from '@/components/layout/UserNav';

import config from '@/config';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardHeader() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      setIsDrawerOpen(false);
    }
  }, [addNewlyCreatedProject, getToken, router]);

  const CreateButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <Button
      onClick={handleCreateProject}
      disabled={isCreating}
      className={fullWidth ? 'w-full justify-start text-base' : 'sm:inline-flex hidden'}
    >
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </>
      )}
    </Button>
  );

  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* App Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon-transparent.png"
            alt={`${config.app_name} Logo`}
            width={30}
            height={30}
            priority
          />
          <span className="text-xl font-bold tracking-tight">{config.app_name}</span>
        </Link>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-4">
          <CreateButton />
          <ThemeToggle />
          <UserNav />
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <UserNav />
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-4">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle className="text-lg">Quick Actions</SheetTitle>
              </SheetHeader>

              <div className="space-y-2">
                <CreateButton fullWidth />
                {/* You can add more actions here like settings, feedback, etc. */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
