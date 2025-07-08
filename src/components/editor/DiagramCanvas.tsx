'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, getNodesBounds } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../diagram/CustomNode';
import EnumNode from '../diagram/EnumNode';
import { Loader } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useDiagramExport } from '@/hooks/useDiagramExport';

function Diagram() {
  const {
    nodes,
    edges,
    isLoading,
    onNodesChange,
    onEdgesChange,
    createRelation,
    projectName,
    exportRequest,
    clearExportRequest,
  } = useAppStore();

  const diagramRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<false | 'png' | 'svg' | 'pdf'>(false);

  const nodeTypes = useMemo(
    () => ({
      table: CustomNode,
      enum: EnumNode,
    }),
    [CustomNode, EnumNode]
  );

  const { handleExport } = useDiagramExport({
    diagramRef,
    nodes,
    projectName,
    onExportStart: (format) => setIsExporting(format),
    onExportEnd: () => setIsExporting(false),
  });

  useEffect(() => {
    if (exportRequest?.format) {
      handleExport(exportRequest.format).finally(() => {
        clearExportRequest();
      });
    }
  }, [exportRequest, handleExport, clearExportRequest]);

  return (
    <div className="h-full w-full relative" ref={diagramRef}>
      {(isLoading || isExporting) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm export-ignore">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          {isExporting && (
            <p className="mt-4 text-lg font-semibold">
              Exporting as {isExporting.toUpperCase()}...
            </p>
          )}
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={createRelation}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        proOptions={{ hideAttribution: true }}
        minZoom={0.05}
        maxZoom={15}
      >
        <Background />
        <Controls className="export-ignore" />
      </ReactFlow>
    </div>
  );
}

export default function CanvasDiagram() {
  return (
    <ReactFlowProvider>
      <Diagram />
    </ReactFlowProvider>
  );
}
