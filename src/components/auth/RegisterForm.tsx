'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be provide.' }),
  username: z
    .string()
    .min(3, 'Username must be provide.')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores are allowed.'),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type RegisterSchemaType = z.infer<typeof formSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<RegisterSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', username: '', email: '', password: '' },
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    setIsLoading(true);

    try {
      const result = await register(values);
      if (result.success) {
        toast({
          variant: 'default',
          title: 'Success',
          description: result.message,
        });
        methods.reset();
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Warning',
          description: result.message,
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        description: 'Please try again later.',
        title: 'Unexpected error',
      });
    }
    setIsLoading(false);
  };

  return (
    <SDForm methods={methods} onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SDInput name="name" label="Name" placeholder="John Doe" disabled={isLoading} />
          <SDInput name="username" label="Username" placeholder="john_doe" disabled={isLoading} />
        </div>
        <SDInput
          name="email"
          label="Email"
          type="email"
          placeholder="john_doe@example.com"
          disabled={isLoading}
        />
        <SDInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
          <UserPlus className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </SDForm>
  );
}
