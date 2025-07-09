'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { Home } from 'lucide-react';
import Link from 'next/link';

const ProjectNameInput = () => {
  const { projectName, setProjectName } = useAppStore();
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button variant="ghost" size="icon" className="shrink-0" asChild>
        <Link href="/dashboard">
          <Home className="h-5 w-5" />
        </Link>
      </Button>
      <Input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name..."
        className="w-32 border-0 bg-transparent text-lg font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-ring sm:w-48 md:w-64"
      />
    </div>
  );
};

export default ProjectNameInput;
