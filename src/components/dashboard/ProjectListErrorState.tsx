import { ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ProjectListErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
      <h3 className="mt-4 text-lg font-semibold">Could not load projects</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Something went wrong. Please try again later.
      </p>
      <Button onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
