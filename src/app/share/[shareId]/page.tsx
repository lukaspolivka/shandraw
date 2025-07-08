'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { PublicDiagramView } from '@/components/share/PublicDiagramView';
import { Loader, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Node, Edge } from 'reactflow';
import clsx from 'clsx';

interface PublicProjectData {
  projectName: string;
  schemaCode: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: string;
}

export default function SharePage() {
  const { shareId } = useParams();
  const [data, setData] = useState<PublicProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerClassName = 'h-[calc(100vh-8rem)]';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/project/public/?shareId=${shareId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch project');
      }

      const { data } = await response.json();

      const parsedNodes: Node[] = (
        typeof data.nodes === 'string' ? JSON.parse(data.nodes) : data.nodes
      )?.map((node: Node) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      }));

      const parsedEdges: Edge[] =
        typeof data.edges === 'string' ? JSON.parse(data.edges) : data.edges;

      setData({
        ...data,
        nodes: parsedNodes,
        edges: parsedEdges,
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    if (shareId) fetchData();
  }, [shareId, fetchData]);

  if (isLoading) {
    return (
      <div className={clsx(containerClassName, 'flex flex-col items-center justify-center')}>
        <Loader className="mx-auto h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg text-center">Loading Diagram...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <ServerCrash className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">Could not load diagram</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button onClick={fetchData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={containerClassName}>
      <PublicDiagramView nodes={data.nodes} edges={data.edges} projectName={data.projectName} />
    </div>
  );
}
