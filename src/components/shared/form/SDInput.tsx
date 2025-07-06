import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface SDInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

export const SDInput: React.FC<SDInputProps> = ({
  name,
  label,
  required,
  placeholder,
  type = 'text',
  className,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormItem>
      {label && (
        <FormLabel htmlFor={name}>
          {label} {required && <span aria-label="required">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!errors[name]}
          {...register(name, { required })}
          className={cn(className)}
          {...rest}
        />
      </FormControl>
      <FormMessage>{errors[name]?.message?.toString()}</FormMessage>
    </FormItem>
  );
};
