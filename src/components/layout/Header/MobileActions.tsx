'use client';

import SaveButton from './SaveButton';
import AddTableButton from './AddTableButton';
import ExportMenu from './ExportMenu';
import ToggleButtons from './ToggleButtons';
import { UserNav } from '@/components/layout/UserNav';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

interface Props {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isLoading: boolean;
  handleSave: () => void;
  openAddTableModal: () => void;
  autoLayout: () => void;
  toggleEditorVisibility: () => void;
  toggleDiagramVisibility: () => void;
  isEditorVisible: boolean;
  isDiagramVisible: boolean;
  handleImportClick: () => void;
  handleExport: (format: 'dbml' | 'png' | 'svg' | 'pdf') => void;
  handleMobileClick: (action: () => void) => void;
}

export default function MobileActions(props: Props) {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isLoading,
    handleSave,
    openAddTableModal,
    autoLayout,
    toggleEditorVisibility,
    toggleDiagramVisibility,
    isEditorVisible,
    isDiagramVisible,
    handleImportClick,
    handleExport,
    handleMobileClick,
  } = props;

  return (
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
            <SheetTitle>Actions</SheetTitle>
          </SheetHeader>
          <div className="flex-grow space-y-1 overflow-y-auto">
            <SaveButton
              isLoading={isLoading}
              onClick={() => handleMobileClick(handleSave)}
              className="w-full justify-start"
            >
              {isLoading ? 'Saving...' : 'Save Project'}
            </SaveButton>

            <AddTableButton
              onClick={() => handleMobileClick(openAddTableModal)}
              className="w-full justify-start"
            >
              Add Table
            </AddTableButton>

            <ToggleButtons
              autoLayout={() => handleMobileClick(autoLayout)}
              toggleEditorVisibility={() => handleMobileClick(toggleEditorVisibility)}
              toggleDiagramVisibility={() => handleMobileClick(toggleDiagramVisibility)}
              isEditorVisible={isEditorVisible}
              isDiagramVisible={isDiagramVisible}
              isMobile
            />

            <ExportMenu
              onImportClick={() => handleMobileClick(handleImportClick)}
              onExport={(format) => handleMobileClick(() => handleExport(format))}
              isMobile
              closeMenu={() => setIsDrawerOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
