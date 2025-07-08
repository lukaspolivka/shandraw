'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { SDSelect } from '../shared/form/SDSelect';
import SDColumnConstraints from '../shared/form/SDColumnConstraints';
import { DATA_TYPES } from './editor.const';

const columnSchema = z.object({
  name: z.string().min(1, 'Column name is required.'),
  type: z.string().min(1, 'Data type is required.'),
  isPk: z.boolean().catch(false),
  isUnique: z.boolean().catch(false),
  isNotNull: z.boolean().catch(false),
  isIncrement: z.boolean().catch(false),
});

const tableFormSchema = z.object({
  tableName: z.string().min(1, 'Table name is required.'),
  columns: z.array(columnSchema).min(1, 'At least one column is required.'),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

interface AddTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (dbml: string) => void;
}

const defaultValues = {
  tableName: '',
  columns: [
    {
      name: 'id',
      type: 'int',
      isPk: true,
      isNotNull: true,
      isUnique: false,
      isIncrement: true,
    },
  ],
};

export function AddTableModal({ open, onOpenChange, onAddTable }: AddTableModalProps) {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema) as any,
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'columns',
  });

  const onSubmit = (data: TableFormValues) => {
    let dbml = `Table ${data.tableName} {\n`;
    data.columns.forEach((col) => {
      const attributes = [];
      if (col.isPk) attributes.push('pk');
      if (col.isUnique) attributes.push('unique');
      if (col.isNotNull) attributes.push('not null');
      if (col.isIncrement) attributes.push('increment');

      dbml += `  ${col.name} ${col.type}`;
      if (attributes.length > 0) {
        dbml += ` [${attributes.join(', ')}]`;
      }
      dbml += '\n';
    });
    dbml += '}';

    onAddTable(dbml);
    form.reset(defaultValues);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Define the name and columns for your new table. This will generate the DBML code and add
            it to the editor.
          </DialogDescription>
        </DialogHeader>
        <SDForm methods={form} onSubmit={onSubmit} className="space-y-6">
          <SDInput name="tableName" label="Table Name" placeholder="e.g., users" />

          <div>
            <Label>Columns</Label>
            <div className="mt-2 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="relative space-y-4 rounded-lg border p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SDInput
                      name={`columns.${index}.name`}
                      label="Column Name"
                      placeholder="e.g., id, user_name"
                    />
                    <SDSelect
                      name={`columns.${index}.type`}
                      label="Data Type"
                      placeholder="Select type"
                      options={DATA_TYPES}
                    />
                  </div>
                  <SDColumnConstraints field={field} index={index} />
                  <div className="absolute right-1 top-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {form.formState.errors.columns?.message && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.columns?.message}
              </p>
            )}
            {form.formState.errors.columns?.root?.message && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.columns?.root?.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: '',
                type: 'varchar',
                isPk: false,
                isUnique: false,
                isNotNull: false,
                isIncrement: false,
              })
            }
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </Button>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Table to Schema</Button>
          </DialogFooter>
        </SDForm>
      </DialogContent>
    </Dialog>
  );
}
