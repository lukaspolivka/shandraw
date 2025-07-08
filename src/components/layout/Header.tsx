'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AddTableModal } from '@/components/editor/AddTableModal';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';
import ProjectNameInput from './Header/ProjectNameInput';
import MobileActions from './Header/MobileActions';
import DesktopActions from './Header/DesktopActions';

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    projectName,
    setProjectName,
    saveProject,
    exportSchema,
    toggleDiagramVisibility,
    isDiagramVisible,
    toggleEditorVisibility,
    isEditorVisible,
    autoLayout,
    isLoading,
    importSchemaFromFile,
    appendSchemaCode,
    triggerExport,
  } = useAppStore();

  const handleSave = async () => {
    setIsDrawerOpen(false);
    if (!projectName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Project Name Required',
        description: 'Please provide a name for your project before saving.',
      });
      return;
    }
    const projectId = await saveProject();
    if (projectId) {
      toast({
        title: 'Project Saved',
        description: 'Your project has been saved to the database.',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSchemaFromFile(file);
      toast({
        title: 'Import Successful',
        description: `Loaded ${file.name}.`,
      });
    }
    if (event.target) event.target.value = '';
    setIsDrawerOpen(false);
  };

  const handleAddTable = (dbml: string) => {
    appendSchemaCode(dbml);
    toast({
      title: 'Table Added',
      description: 'The DBML for the new table has been added to the editor.',
    });
  };

  const handleExport = (format: 'dbml' | 'png' | 'svg' | 'pdf') => {
    setIsDrawerOpen(false);
    if (format === 'dbml') {
      exportSchema();
    } else {
      triggerExport(format);
    }
  };

  const handleMobileClick = (action: () => void) => {
    action();
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-card/95 px-2 backdrop-blur-lg sm:px-4">
        <ProjectNameInput
          projectName={projectName}
          setProjectName={setProjectName}
          onHomeClick={() => router.push('/dashboard')}
        />

        <DesktopActions
          isLoading={isLoading}
          handleSave={handleSave}
          openAddTableModal={() => setIsAddTableModalOpen(true)}
          autoLayout={autoLayout}
          toggleEditorVisibility={toggleEditorVisibility}
          toggleDiagramVisibility={toggleDiagramVisibility}
          isEditorVisible={isEditorVisible}
          isDiagramVisible={isDiagramVisible}
          handleImportClick={handleImportClick}
          handleExport={handleExport}
        />

        <MobileActions
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          isLoading={isLoading}
          handleSave={handleSave}
          openAddTableModal={() => setIsAddTableModalOpen(true)}
          autoLayout={autoLayout}
          toggleEditorVisibility={toggleEditorVisibility}
          toggleDiagramVisibility={toggleDiagramVisibility}
          isEditorVisible={isEditorVisible}
          isDiagramVisible={isDiagramVisible}
          handleImportClick={handleImportClick}
          handleExport={handleExport}
          handleMobileClick={handleMobileClick}
        />
      </header>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".dbml"
        className="hidden"
      />

      <AddTableModal
        open={isAddTableModalOpen}
        onOpenChange={setIsAddTableModalOpen}
        onAddTable={handleAddTable}
      />
    </>
  );
}
