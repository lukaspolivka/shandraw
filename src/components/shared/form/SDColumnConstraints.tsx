'use client';

import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const constraintOptions = [
  { key: 'isPk', label: 'Primary Key' },
  { key: 'isUnique', label: 'Unique' },
  { key: 'isNotNull', label: 'Not Null' },
  { key: 'isIncrement', label: 'Auto Increment' },
];

const SDColumnConstraints = ({ field, index }: { field: { id: string }; index: number }) => {
  const { register } = useFormContext();

  return (
    <div>
      <FormLabel>Constraints</FormLabel>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
        {constraintOptions.map(({ key, label }) => (
          <FormItem key={`${field.id}-${key}`} className="flex items-center space-x-2">
            <FormControl>
              <Checkbox id={`${field.id}-${key}`} {...register(`columns.${index}.${key}`)} />
            </FormControl>
            <Label htmlFor={`${field.id}-${key}`} className="cursor-pointer font-normal">
              {label}
            </Label>
          </FormItem>
        ))}
      </div>
    </div>
  );
};

export default SDColumnConstraints;
