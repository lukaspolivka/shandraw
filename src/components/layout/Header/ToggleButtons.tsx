'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Layout, PanelLeftClose, PanelLeftOpen, Eye, EyeOff } from 'lucide-react';

interface Props {
  autoLayout: () => void;
  toggleEditorVisibility: () => void;
  toggleDiagramVisibility: () => void;
  isEditorVisible: boolean;
  isDiagramVisible: boolean;
  className?: string;
  isMobile?: boolean;
}

export default function ToggleButtons({
  autoLayout,
  toggleEditorVisibility,
  toggleDiagramVisibility,
  isEditorVisible,
  isDiagramVisible,
  className,
  isMobile = false,
}: Props) {
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          onClick={autoLayout}
          className={`w-full justify-start ${className}`}
        >
          <Layout className="mr-2 h-4 w-4" />
          <span>Auto-Layout</span>
        </Button>

        <Button
          variant="ghost"
          onClick={toggleEditorVisibility}
          disabled={!isDiagramVisible && isEditorVisible}
          className={`w-full justify-start ${className}`}
        >
          {isEditorVisible ? (
            <PanelLeftClose className="mr-2 h-4 w-4" />
          ) : (
            <PanelLeftOpen className="mr-2 h-4 w-4" />
          )}
          <span>{isEditorVisible ? 'Hide Editor' : 'Show Editor'}</span>
        </Button>

        <Button
          variant="ghost"
          onClick={toggleDiagramVisibility}
          disabled={!isEditorVisible && isDiagramVisible}
          className={`w-full justify-start ${className}`}
        >
          {isDiagramVisible ? (
            <EyeOff className="mr-2 h-4 w-4" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          <span>{isDiagramVisible ? 'Hide Diagram' : 'Show Diagram'}</span>
        </Button>
      </>
    );
  }

  // Desktop with tooltips
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={autoLayout}
            className={`h-9 w-9 ${className}`}
          >
            <Layout className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Auto-Layout</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleEditorVisibility}
            disabled={!isDiagramVisible && isEditorVisible}
            className={`h-9 w-9 ${className}`}
          >
            {isEditorVisible ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isEditorVisible ? 'Hide Editor' : 'Show Editor'} (⌘/Ctrl+B)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDiagramVisibility}
            disabled={!isEditorVisible && isDiagramVisible}
            className={`h-9 w-9 ${className}`}
          >
            {isDiagramVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isDiagramVisible ? 'Hide Diagram' : 'Show Diagram'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
