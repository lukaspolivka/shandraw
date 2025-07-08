import { Completion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';

const dbmlCompletions: Completion[] = [
  {
    label: 'Table',
    type: 'keyword',
    info: 'Define a new table',
    apply: 'Table table_name {\n  \n}',
  },
  {
    label: 'Ref',
    type: 'keyword',
    info: 'Define a relationship',
    apply: 'Ref: table1.col1 > table2.col2',
  },
  {
    label: 'Project',
    type: 'keyword',
    info: 'Define a project',
    apply:
      "Project project_name {\n  database_type: 'PostgreSQL'\n  Note: 'Project description'\n}",
  },
  { label: 'Note', type: 'keyword', info: 'Add a note', apply: "Note: ''" },
  {
    label: 'pk',
    type: 'keyword',
    info: 'Primary Key constraint',
    apply: '[pk]',
  },
  {
    label: 'primary key',
    type: 'keyword',
    info: 'Primary Key constraint',
    apply: '[primary key]',
  },
  {
    label: 'not null',
    type: 'keyword',
    info: 'Not null constraint',
    apply: '[not null]',
  },
  {
    label: 'unique',
    type: 'keyword',
    info: 'Unique constraint',
    apply: '[unique]',
  },
  {
    label: 'increment',
    type: 'keyword',
    info: 'Auto-increment constraint',
    apply: '[increment]',
  },
  {
    label: 'default',
    type: 'keyword',
    info: 'Default value',
    apply: "[default: '']",
  },
  { label: 'int', type: 'type', info: 'Integer' },
  { label: 'integer', type: 'type', info: 'Integer' },
  { label: 'bigint', type: 'type', info: 'Big Integer' },
  { label: 'smallint', type: 'type', info: 'Small Integer' },
  { label: 'decimal', type: 'type', info: 'Decimal' },
  { label: 'numeric', type: 'type', info: 'Numeric' },
  { label: 'real', type: 'type', info: 'Real number' },
  { label: 'double precision', type: 'type', info: 'Double precision number' },
  { label: 'float', type: 'type', info: 'Floating-point number' },
  { label: 'char', type: 'type', info: 'Fixed-length character string' },
  { label: 'varchar', type: 'type', info: 'Variable-length character string' },
  { label: 'text', type: 'type', info: 'Variable-length character string' },
  { label: 'string', type: 'type', info: 'Variable-length character string' },
  { label: 'bytea', type: 'type', info: 'Binary data' },
  { label: 'blob', type: 'type', info: 'Binary large object' },
  { label: 'json', type: 'type', info: 'JSON data' },
  { label: 'jsonb', type: 'type', info: 'JSON data (binary)' },
  { label: 'xml', type: 'type', info: 'XML data' },
  { label: 'uuid', type: 'type', info: 'Universally unique identifier' },
  { label: 'date', type: 'type', info: 'Date' },
  { label: 'time', type: 'type', info: 'Time of day' },
  { label: 'datetime', type: 'type', info: 'Date and time' },
  { label: 'timestamp', type: 'type', info: 'Timestamp' },
  { label: 'timestamptz', type: 'type', info: 'Timestamp with time zone' },
  { label: 'bool', type: 'type', info: 'Boolean type' },
  { label: 'boolean', type: 'type', info: 'Boolean type' },
  { label: 'ObjectId', type: 'type', info: 'Unique object identifier' },
  { label: 'Array', type: 'type', info: 'Array of values' },
  { label: 'Object', type: 'type', info: 'Embedded object' },
];

export function dbmlAutocomplete(context: CompletionContext): CompletionResult | null {
  const code = context.state.doc.toString();
  const dynamicCompletions: Completion[] = [];

  // Regex to find all tables and their content
  const tableRegex = /Table\s+(\w+)\s*\{([^}]+)\}/g;
  let tableMatch;
  // Iterate through all table definitions found in the code
  while ((tableMatch = tableRegex.exec(code)) !== null) {
    const tableName = tableMatch[1];
    // Add the table name as a completion suggestion
    dynamicCompletions.push({
      label: tableName,
      type: 'class',
      info: `Table: ${tableName}`,
    });

    // Extract the content within the table's curly braces
    const columnsContent = tableMatch[2];
    // Regex to find column names at the start of each line within the table content
    // Regex to find column names at the start of a line
    const columnRegex = /^\s*(\w+)/gm;
    let colMatch;
    while ((colMatch = columnRegex.exec(columnsContent)) !== null) {
      const colName = colMatch[1];
      // Add completion for `table.column` format, useful for Refs
      dynamicCompletions.push({
        label: `${tableName}.${colName}`, // Suggest `tableName.columnName`
        type: 'property',
        info: `Column in ${tableName}`,
      });
    }
  }

  const allCompletions = [...dbmlCompletions, ...dynamicCompletions];

  // Match words, including dot notation for `table.column`
  const word = context.matchBefore(/\w*\.?\w*/);
  // If no word is found or it's just a cursor without explicit request, return null

  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  return {
    from: word.from,
    options: allCompletions,
    validFor: /^\w*\.?\w*$/,
  };
}
