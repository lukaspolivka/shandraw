'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, FileCode, FileImage, FileType, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onImportClick: () => void;
  onExport: (format: 'dbml' | 'png' | 'svg' | 'pdf') => void;
  isMobile?: boolean;
  closeMenu?: () => void;
}

export default function ExportMenu({ onImportClick, onExport, isMobile, closeMenu }: Props) {
  const onClickAndClose = (action: () => void) => {
    action();
    if (closeMenu) closeMenu();
  };

  if (isMobile) {
    // Mobile: render as Buttons vertically
    return (
      <>
        <Button
          variant="ghost"
          onClick={() => onClickAndClose(onImportClick)}
          className="w-full justify-start"
        >
          <Upload className="mr-2 h-4 w-4" />
          <span>Import Schema</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onClickAndClose(() => onExport('dbml'))}
          className="w-full justify-start"
        >
          <FileCode className="mr-2 h-4 w-4" />
          <span>Export DBML</span>
        </Button>
        <div className="my-2 border-t" />
        <p className="px-2 pt-2 text-sm font-semibold text-muted-foreground">Export Diagram</p>
        <Button
          variant="ghost"
          onClick={() => onClickAndClose(() => onExport('png'))}
          className="w-full justify-start"
        >
          <FileImage className="mr-2 h-4 w-4" />
          <span>Export as PNG</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onClickAndClose(() => onExport('svg'))}
          className="w-full justify-start"
        >
          <FileType className="mr-2 h-4 w-4" />
          <span>Export as SVG</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => onClickAndClose(() => onExport('pdf'))}
          className="w-full justify-start"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </Button>
      </>
    );
  }

  // Desktop dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
          <ChevronDown className="ml-0 h-4 w-4 sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          <span>Import Schema</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('dbml')}>
          <FileCode className="mr-2 h-4 w-4" />
          <span>Export DBML</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileImage className="mr-2 h-4 w-4" />
            <span>Export Diagram</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => onExport('png')}>
              <FileImage className="mr-2 h-4 w-4" />
              <span>Export as PNG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('svg')}>
              <FileType className="mr-2 h-4 w-4" />
              <span>Export as SVG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onExport('pdf')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
