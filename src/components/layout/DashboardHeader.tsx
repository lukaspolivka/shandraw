'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PlusCircle, Menu, Loader2 } from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import Image from 'next/image';
import { toast } from '@/hooks/useToast';
import config from '@/config';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

function DashboardHeader() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreateNew = async () => {
    setIsCreating(true);
    toast({ title: 'Creating new project...' });
    setIsCreating(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-card/75 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon-transparent.png" alt={config.app_name} height={30} width={30} />
          <h1 className="text-xl font-bold">{config.app_name}</h1>
        </Link>

        {/* Desktop Header */}
        <div className="hidden items-center gap-2 sm:flex sm:gap-4">
          <Button onClick={handleCreateNew} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            <span>{isCreating ? 'Creating...' : 'New Project'}</span>
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>

        {/* Mobile Header */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <UserNav />
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full max-w-xs flex-col p-4">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex-grow">
                <Button
                  onClick={handleCreateNew}
                  disabled={isCreating}
                  className="w-full justify-start text-base"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  <span>{isCreating ? 'Creating...' : 'New Project'}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
