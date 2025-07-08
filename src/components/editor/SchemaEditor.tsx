'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { autocompletion } from '@codemirror/autocomplete';
import { keymap } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import { useAppStore } from '@/store/useAppStore';
import { HelpAccordion } from './HelpAccordion';
import { dbmlAutocomplete } from './dbmlAutocomplete';
import { toast } from '@/hooks/useToast';

export default function SchemaEditor() {
  const {
    schemaCode,
    setSchemaCode,
    saveProject,
    updateDiagram,
    isLoading: isStoreLoading,
  } = useAppStore();

  const [isClient, setIsClient] = useState(false);
  const [editorTheme, setEditorTheme] = useState<any>(eclipse);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateDiagram();
    }, 750);

    return () => clearTimeout(debounceTimer);
  }, [schemaCode, updateDiagram]);

  useEffect(() => {
    setIsClient(true);

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setEditorTheme(isDark ? vscodeDark : eclipse);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleSave = useCallback(async () => {
    toast({
      title: 'Saving project...',
    });
    await saveProject();
  }, [saveProject]);

  const onChange = useCallback(
    (value: string) => {
      setSchemaCode(value);
    },
    [setSchemaCode]
  );

  const customKeymap = keymap.of([
    {
      key: 'Mod-s',
      run: () => {
        handleSave();
        return true;
      },
      preventDefault: true,
    },
  ]);

  if (!isClient) {
    return (
      <div className="flex h-full flex-col bg-card items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-card">
      {isStoreLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold">Loading...</p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-2">
        <h2 className="text-lg font-semibold">Schema Editor</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" /> Help
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>DBML Help Guide</DialogTitle>
              <DialogDescription>
                A quick reference for writing DBML. For more details, visit the official DBML
                documentation.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-4">
              <HelpAccordion />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={schemaCode.toString()}
          height="100%"
          minHeight="300px"
          extensions={[sql(), customKeymap, autocompletion({ override: [dbmlAutocomplete] })]}
          onChange={onChange}
          theme={editorTheme}
          className="h-full font-code text-sm"
        />
      </div>
      <div className="border-t p-2">
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Pro-tip: Use{' '}
          <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Cmd/Ctrl + S</kbd> to
          save your work.
        </p>
      </div>
    </div>
  );
}
