'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Loader, Download, FileImage, FileText, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CustomNode from '../diagram/CustomNode';
import EnumNode from '../diagram/EnumNode';
import { useDiagramExport } from '@/hooks/useDiagramExport';

interface PublicDiagramViewProps {
  nodes: Node[];
  edges: Edge[];
  projectName: string;
}

function Diagram({
  nodes: initialNodes,
  edges: initialEdges,
  projectName,
}: PublicDiagramViewProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isExporting, setIsExporting] = useState<false | 'png' | 'svg' | 'pdf'>(false);

  const nodeTypes = useMemo(() => ({ table: CustomNode, enum: EnumNode }), []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const { handleExport } = useDiagramExport({
    diagramRef,
    nodes,
    projectName,
    onExportStart: (format) => setIsExporting(format),
    onExportEnd: () => setIsExporting(false),
  });

  return (
    <div className="relative w-full h-full" ref={diagramRef}>
      {isExporting && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm export-ignore">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-base font-medium">Exporting as {isExporting.toUpperCase()}...</p>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-background"
        proOptions={{ hideAttribution: true }}
        minZoom={0.05}
        maxZoom={1.5}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        zoomOnScroll
        panOnDrag
      >
        <Background />
        <Controls className="export-ignore" />

        <div className="absolute top-4 right-4 z-10 export-ignore">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleExport('png')}>
                <FileImage className="mr-2 h-4 w-4" /> PNG
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('svg')}>
                <FileType className="mr-2 h-4 w-4" /> SVG
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ReactFlow>
    </div>
  );
}

export function PublicDiagramView(props: PublicDiagramViewProps) {
  return (
    <ReactFlowProvider>
      <Diagram {...props} />
    </ReactFlowProvider>
  );
}
