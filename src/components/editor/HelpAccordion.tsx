import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="mt-2 mb-4 rounded-md border bg-muted p-4 font-code text-sm overflow-x-auto">
    <code>{children}</code>
  </pre>
);

export function HelpAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Tables</AccordionTrigger>
        <AccordionContent>
          <p>
            Define a table using the <code>Table</code> keyword, followed by the table name and a
            set of curly braces.
          </p>
          <CodeBlock>{`Table users {\n  id int [pk]\n  name varchar\n}`}</CodeBlock>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Columns, Types & Settings</AccordionTrigger>
        <AccordionContent>
          <p>
            Columns are defined within a table block with <code>name type [settings]</code>.
          </p>
          <p className="mt-2">
            <b>Common types:</b> <code>int</code>, <code>varchar</code>, <code>text</code>,{' '}
            <code>boolean</code>, <code>timestamp</code>, <code>date</code>, <code>decimal</code>.
          </p>
          <p className="mt-2">
            <b>Settings</b> are enclosed in square brackets:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <code>pk</code> or <code>primary key</code>: Marks the column as the primary key.
            </li>
            <li>
              <code>not null</code>: The column cannot be empty.
            </li>
            <li>
              <code>unique</code>: All values in this column must be unique.
            </li>
            <li>
              <code>increment</code>: Auto-incrementing integer.
            </li>
            <li>
              <code>default: value</code>: Sets a default value. For strings, use single quotes
              (e.g.,
              <code>'user'</code>). For expressions, use backticks (e.g., <code>{'`now()`'}</code>).
            </li>
          </ul>
          <CodeBlock>{`Table posts {\n  id int [pk, increment]\n  title varchar [not null]\n  status varchar [default: 'draft']\n  created_at timestamp [default: \`now()\`, not null]\n}`}</CodeBlock>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Relationships (Refs)</AccordionTrigger>
        <AccordionContent>
          <p>
            Define relationships between tables using <code>Ref</code>. The direction of the arrow
            defines the relationship type.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <code>&gt;</code>: One-to-many (e.g., one user has many posts).
            </li>
            <li>
              <code>&lt;</code>: Many-to-one (e.g., many posts belong to one user).
            </li>
            <li>
              <code>-</code>: One-to-one (e.g., one user has one profile).
            </li>
          </ul>
          <CodeBlock>{`// One-to-many: One user has many posts\nRef: users.id < posts.user_id\n\n// One-to-one: One user has one profile\nRef: users.id - user_profiles.user_id`}</CodeBlock>
          <p>You can also define refs inline inside a column definition:</p>
          <CodeBlock>{`Table posts {\n  // ...\n  user_id int [ref: > users.id]\n}`}</CodeBlock>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger>Enums</AccordionTrigger>
        <AccordionContent>
          <p>
            Define a reusable list of possible values for a column using <code>Enum</code>.
          </p>
          <CodeBlock>{`Enum post_status {\n  draft\n  published\n  archived\n}\n\nTable posts {\n  id int [pk]\n  status post_status [not null]\n}`}</CodeBlock>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger>Keyboard Shortcuts</AccordionTrigger>
        <AccordionContent>
          <p>Boost your productivity with these shortcuts:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>
              <span className="font-semibold">Save Project:</span>
              <p className="flex items-center gap-1">
                Press <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Cmd</kbd>{' '}
                + <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">S</kbd> on
                macOS, or{' '}
                <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Ctrl</kbd> +{' '}
                <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">S</kbd> on
                Windows/Linux.
              </p>
            </li>
            <li>
              <span className="font-semibold">Toggle Editor Panel:</span>
              <p className="flex items-center gap-1">
                Press <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Cmd</kbd>{' '}
                + <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">B</kbd> on
                macOS, or{' '}
                <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Ctrl</kbd> +{' '}
                <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">B</kbd> on
                Windows/Linux.
              </p>
            </li>
            <li>
              <span className="font-semibold">Autocomplete:</span>
              <p className="flex items-center gap-1">
                Suggestions will appear automatically as you type. Use arrow keys to navigate and{' '}
                <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans">Enter</kbd> to
                select.
              </p>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
