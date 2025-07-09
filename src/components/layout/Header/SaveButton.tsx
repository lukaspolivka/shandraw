'use client';

import { Button } from '@/components/ui/button';
import { Loader, Save } from 'lucide-react';

interface Props {
  isLoading: boolean;
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function SaveButton({ isLoading, onClick, className, children }: Props) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader className="mr-0 h-4 w-4 animate-spin sm:mr-2" />
      ) : (
        <Save className="mr-0 h-4 w-4 sm:mr-2" />
      )}
      <span>{children || (isLoading ? 'Saving...' : 'Save')}</span>
    </Button>
  );
}
