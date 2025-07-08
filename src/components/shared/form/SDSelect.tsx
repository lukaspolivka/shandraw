import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface SDSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
}

export const SDSelect: React.FC<SDSelectProps> = ({
  name,
  label,
  required,
  placeholder = 'Select an option',
  options,
  className,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormItem>
      {label && (
        <FormLabel htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Controller
          name={name}
          control={control}
          rules={{ required }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id={name} className={cn(className)} aria-invalid={!!errors[name]}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormControl>
      <FormMessage>{errors[name]?.message?.toString()}</FormMessage>
    </FormItem>
  );
};
