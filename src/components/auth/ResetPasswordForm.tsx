'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const formSchema = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { resetPassword } = useAppStore();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const payload = {
      password: values.password,
      token,
    };
    try {
      const result = await resetPassword(payload);
      console.log(result);
      if (result.success) {
        toast({
          variant: 'default',
          title: 'Forget Request Success.',
          description: result.message,
        });
        methods.reset();
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Forget Request Failed.',
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
    <SDForm methods={methods} onSubmit={onSubmit} className="space-y-4">
      <SDInput
        name="password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        disabled={isLoading}
      />
      <SDInput
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
        <KeyRound className="ml-2 h-4 w-4" />
      </Button>
    </SDForm>
  );
}
