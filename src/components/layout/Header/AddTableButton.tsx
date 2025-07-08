'use client';

import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';

interface Props {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function AddTableButton({ onClick, className, children }: Props) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={className}>
      <Table2 className="mr-0 h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">{children || 'Add Table'}</span>
    </Button>
  );
}
