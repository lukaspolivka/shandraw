'use client';

import { useCallback, RefObject } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { getRectOfNodes, Node } from 'reactflow';
import { useToast } from '@/hooks/useToast';

export type ExportFormat = 'png' | 'svg' | 'pdf';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap';

export async function getFontEmbedCSS(doc: Document) {
  try {
    let cssText = '';
    for (const sheet of Array.from(doc.styleSheets)) {
      try {
        if (sheet.cssRules) {
          for (const rule of Array.from(sheet.cssRules)) {
            cssText += rule.cssText;
          }
        }
      } catch {
        // Ignore cross-origin rules
      }
    }

    const fontResponse = await fetch(FONT_URL);
    if (fontResponse.ok) {
      const fontCss = await fontResponse.text();
      cssText += fontCss;
    }

    return `<style>${cssText}</style>`;
  } catch (error) {
    console.error('Failed to fetch/process CSS:', error);
    return '';
  }
}

interface UseDiagramExportOptions {
  diagramRef: RefObject<HTMLDivElement | null>;
  nodes: Node[];
  projectName: string;
  onExportStart?: (format: ExportFormat) => void;
  onExportEnd?: () => void;
}

export function useDiagramExport({
  diagramRef,
  nodes,
  projectName,
  onExportStart,
  onExportEnd,
}: UseDiagramExportOptions) {
  const { toast } = useToast();

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      onExportStart?.(format);
      const viewportEl = diagramRef.current?.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewportEl || nodes.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Export Failed',
          description: 'Diagram is empty or not ready.',
        });
        onExportEnd?.();
        return;
      }

      const fontCSS = await getFontEmbedCSS(document);
      const bgColor =
        getComputedStyle(document.documentElement).getPropertyValue('--background').trim() ||
        '#ffffff';

      const bounds = getRectOfNodes(nodes);
      const padding = 100;
      const width = bounds.width + padding * 2;
      const height = bounds.height + padding * 2;

      const filename = `${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

      const options = {
        fontEmbedCSS: fontCSS,
        cacheBust: true,
        width,
        height,
        pixelRatio: 3,
        backgroundColor: bgColor,
        filter: (node: HTMLElement | null | undefined) => {
          if (!node || !node.classList) return true;
          const excluded = ['react-flow__controls', 'react-flow__background', 'export-ignore'];
          return !excluded.some((cls) => node.classList.contains(cls));
        },
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${-bounds.x + padding}px, ${-bounds.y + padding}px) scale(1)`,
        },
      };

      try {
        if (format === 'pdf') {
          const dataUrl = await toPng(viewportEl, options);
          const pdf = new jsPDF({
            orientation: width > height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [width, height],
          });
          pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height, undefined, 'FAST');
          pdf.save(`${filename}.pdf`);
        } else {
          const dataUrl = await (format === 'svg' ? toSvg : toPng)(viewportEl, options);
          const link = document.createElement('a');
          link.download = `${filename}.${format}`;
          link.href = dataUrl;
          link.click();
        }
      } catch (error) {
        console.error(`${format.toUpperCase()} Export Failed:`, error);
        toast({
          variant: 'destructive',
          title: `${format.toUpperCase()} Export Failed`,
          description: 'Something went wrong. Try again.',
        });
      } finally {
        onExportEnd?.();
      }
    },
    [diagramRef, nodes, projectName, toast, onExportStart, onExportEnd]
  );

  return { handleExport };
}
