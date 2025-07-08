'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KeyRound, Link } from 'lucide-react';

interface Column {
  id: string;
  name: string;
  type: string;
  pk: boolean;
  fk: boolean;
}

interface TableNodeData {
  name: string;
  columns: Column[];
}

function CustomNode({ data }: NodeProps<TableNodeData>) {
  return (
    <Card className="w-64 rounded-lg border-2 p-0 border-primary/50 shadow-lg transition-all duration-200 hover:border-primary hover:shadow-2xl">
      <CardHeader className="rounded-t-md bg-primary/10 p-3">
        <CardTitle className="text-base font-bold text-primary">{data.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {data.columns.map((col) => (
            <li
              key={col.id}
              className="relative flex items-center justify-between p-2 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                {col.pk && <KeyRound className="h-3 w-3 text-yellow-500" />}
                {col.fk && <Link className="h-3 w-3 text-blue-500" />}
                <span>{col.name}</span>
              </div>
              <span className="text-muted-foreground">{col.type}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={`${col.id}-source`}
                className="!bg-primary"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
              <Handle
                type="target"
                position={Position.Left}
                id={`${col.id}-target`}
                className="!bg-accent"
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default CustomNode;
