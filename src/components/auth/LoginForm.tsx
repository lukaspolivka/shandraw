'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginSchemaType = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    setIsLoading(true);
    console.log(values);
    setIsLoading(false);
  };

  return (
    <SDForm methods={methods} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <SDInput
          name="username"
          type="text"
          label="Username"
          placeholder="john_doe"
          disabled={isLoading}
        />
        <SDInput
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          disabled={isLoading}
        />
        <Link
          href="/forgot-password"
          className="mt-5 block text-right text-sm underline transition-colors hover:text-primary"
        >
          Forgot your password?
        </Link>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
          <LogIn className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </SDForm>
  );
}
