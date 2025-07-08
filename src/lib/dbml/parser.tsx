import { Node, Edge, MarkerType } from 'reactflow';

interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
}

interface Column {
  id: string; // `${tableName}-${columnName}`
  name: string;
  type: string;
  pk: boolean;
  fk: boolean;
}

interface Enum {
  id: string;
  name: string;
  values: string[];
  position: { x: number; y: number };
}

export const parseDBML = (dbml: string): { nodes: Node[]; edges: Edge[] } => {
  // Remove multi-line comments and single line comments
  const noMultiLineComments = dbml.replace(/\/\*[\s\S]*?\*\//g, '');
  const noComments = noMultiLineComments
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');
  const cleanDbml = noComments
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .join('\n');

  const tables: Map<string, Table> = new Map();
  const enums: Map<string, Enum> = new Map();
  const edges: Edge[] = [];

  // Parse enums
  const enumRegex = /Enum\s+([^\s{]+)\s*\{([\s\S]+?)\}/g;
  let match;
  while ((match = enumRegex.exec(cleanDbml)) !== null) {
    const [, enumName, valuesStr] = match;
    const values = valuesStr
      .trim()
      .split(/[\n\s,]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    enums.set(enumName, {
      id: enumName,
      name: enumName,
      values,
      position: { x: 0, y: 0 },
    });
  }

  // Parse tables and inline column relationships
  const tableRegex = /Table\s+([^\s{]+)\s*\{([\s\S]+?)\}/g;
  while ((match = tableRegex.exec(cleanDbml)) !== null) {
    const [, tableName, columnsStr] = match;
    const columns: Column[] = [];
    const columnLines = columnsStr.split('\n').filter((line) => line.trim());

    for (const line of columnLines) {
      const colMatch = line.trim().match(/^(\w+)\s+([\w\(\)]+)(?:\s+\[(.*)\])?/);
      if (!colMatch) continue;

      const [, colName, colType, attributes] = colMatch;
      const colId = `${tableName}-${colName}`;
      const column: Column = {
        id: colId,
        name: colName,
        type: colType,
        pk: false,
        fk: false,
      };

      // Enum reference edge
      if (enums.has(colType)) {
        edges.push({
          id: `edge-enum-${colId}-${colType}`,
          source: tableName,
          target: colType,
          sourceHandle: `${colId}-source`,
          targetHandle: `${colType}-target`,
          type: 'smoothstep',
          animated: true,
          style: {
            strokeDasharray: '5 5',
            strokeWidth: 1.5,
            stroke: 'gray',
          },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'gray' },
        });
      }

      // Attributes like pk and fk + inline ref
      if (attributes) {
        if (/\bpk\b|\bprimary key\b/.test(attributes)) {
          column.pk = true;
        }

        const refMatch = attributes.match(/ref:\s*([-><])\s*(\w+)\.(\w+)/);
        if (refMatch) {
          column.fk = true;
          const [, relType, targetTable, targetColumn] = refMatch;

          const source = tableName;
          const target = targetTable;
          const targetColId = `${target}-${targetColumn}`;

          let markerEnd: any = undefined;
          let markerStart: any = undefined;

          if (relType === '>') {
            markerEnd = { type: MarkerType.ArrowClosed, color: '#4CAF50' };
          } else if (relType === '<') {
            markerStart = { type: MarkerType.ArrowClosed, color: '#4CAF50' };
          }

          edges.push({
            id: `edge-${colId}-${targetColId}`,
            source,
            target,
            sourceHandle: `${colId}-source`,
            targetHandle: `${targetColId}-target`,
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 1.5, stroke: '#4CAF50' },
            markerEnd,
            markerStart,
          });
        }
      }

      columns.push(column);
    }

    tables.set(tableName, {
      id: tableName,
      name: tableName,
      columns,
      position: { x: 0, y: 0 },
    });
  }

  // Parse explicit Ref statements (Ref: TableA.colA > TableB.colB)
  const refRegex = /Ref\s*(?:[\w_]+)?\s*:\s*([\w\.]+)\s*([-><])\s*([\w\.]+)/g;
  while ((match = refRegex.exec(cleanDbml)) !== null) {
    let [, sourceRef, relType, targetRef] = match;
    let [sourceTable, sourceColumn] = sourceRef.split('.');
    let [targetTable, targetColumn] = targetRef.split('.');

    const sourceColId = `${sourceTable}-${sourceColumn}`;
    const targetColId = `${targetTable}-${targetColumn}`;

    // Mark fk column
    const fkTable = relType === '>' ? sourceTable : targetTable;
    const fkColumn = relType === '>' ? sourceColumn : targetColumn;
    const tableData = tables.get(fkTable);
    if (tableData) {
      const columnData = tableData.columns.find((c) => c.name === fkColumn);
      if (columnData) columnData.fk = true;
    }

    let markerEnd: any = undefined;
    let markerStart: any = undefined;
    let edgeSource = sourceTable;
    let edgeTarget = targetTable;

    if (relType === '<') {
      // One-to-many direction, edge reversed
      edgeSource = targetTable;
      edgeTarget = sourceTable;
      markerEnd = { type: MarkerType.ArrowClosed, color: '#4CAF50' };
    } else if (relType === '>') {
      markerEnd = { type: MarkerType.ArrowClosed, color: '#4CAF50' };
    }

    edges.push({
      id: `edge-${sourceColId}-${targetColId}`,
      source: edgeSource,
      target: edgeTarget,
      sourceHandle: `${sourceColId}-source`,
      targetHandle: `${targetColId}-target`,
      type: 'smoothstep',
      animated: true,
      style: { strokeWidth: 1.5, stroke: '#4CAF50' },
      markerEnd,
      markerStart,
    });
  }

  // Create React Flow nodes for tables
  const tableNodes: Node[] = Array.from(tables.values()).map((table, index) => ({
    id: table.id,
    type: 'table',
    position: { x: (index % 4) * 400, y: Math.floor(index / 4) * 300 },
    data: { name: table.name, columns: table.columns },
  }));

  // Create React Flow nodes for enums (below tables)
  const enumNodes: Node[] = Array.from(enums.values()).map((en, index) => ({
    id: en.id,
    type: 'enum',
    position: { x: (index % 4) * 400, y: Math.floor(index / 4) * 300 + 1200 },
    data: { name: en.name, values: en.values },
  }));

  // Deduplicate edges by id (optional)
  const finalEdges = [...new Map(edges.map((e) => [e.id, e])).values()];

  return {
    nodes: [...tableNodes, ...enumNodes],
    edges: finalEdges,
  };
};
