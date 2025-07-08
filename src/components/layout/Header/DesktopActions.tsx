'use client';

import SaveButton from './SaveButton';
import AddTableButton from './AddTableButton';
import ExportMenu from './ExportMenu';
import ToggleButtons from './ToggleButtons';
import { UserNav } from '@/components/layout/UserNav';
import ThemeToggle from '../ThemeToggle';

interface Props {
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
}

export default function DesktopActions(props: Props) {
  const {
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
  } = props;

  return (
    <div className="hidden items-center gap-1 sm:flex sm:gap-2">
      <SaveButton isLoading={isLoading} onClick={handleSave} />
      <AddTableButton onClick={openAddTableModal} />
      <ToggleButtons
        autoLayout={autoLayout}
        toggleEditorVisibility={toggleEditorVisibility}
        toggleDiagramVisibility={toggleDiagramVisibility}
        isEditorVisible={isEditorVisible}
        isDiagramVisible={isDiagramVisible}
      />
      <ExportMenu onImportClick={handleImportClick} onExport={handleExport} />
      <ThemeToggle />
      <UserNav />
    </div>
  );
}
