'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home } from 'lucide-react';

interface Props {
  projectName: string;
  setProjectName: (name: string) => void;
  onHomeClick: () => void;
}

export default function ProjectNameInput({ projectName, setProjectName, onHomeClick }: Props) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button variant="ghost" size="icon" onClick={onHomeClick} className="shrink-0">
        <Home className="h-5 w-5" />
      </Button>
      <Input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name..."
        className="w-32 border-0 bg-transparent text-lg font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-ring sm:w-48 md:w-64"
      />
    </div>
  );
}
