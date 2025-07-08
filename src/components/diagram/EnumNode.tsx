'use client';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface EnumNodeData {
  name: string;
  values: string[];
}

function EnumNode({ data, id }: NodeProps<EnumNodeData>) {
  return (
    <Card className="relative w-52 shadow-md rounded-lg border-2 p-0 border-accent/50 bg-card">
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        className="!bg-accent"
        style={{ top: '50%' }}
      />
      <CardHeader className="bg-accent/50 p-3 rounded-t-md">
        <CardTitle className="text-sm font-bold text-accent-foreground">
          Enum: {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y text-xs">
          {data.values.map((val, index) => (
            <li key={index} className="px-3 py-1.5 text-card-foreground">
              {val}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default EnumNode;
