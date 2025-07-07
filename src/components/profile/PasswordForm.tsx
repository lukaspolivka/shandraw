'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';
import { SDInput } from '../shared/form/SDInput';
import { SDForm } from '../shared/form/SDForm';

const schema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordValues = z.infer<typeof schema>;

export default function PasswordForm() {
  const { toast } = useToast();
  const { changePassword, logout } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: PasswordValues) => {
    setIsLoading(true);
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.success) {
        toast({
          title: 'Password changed successfully',
          description: 'You will be logged out for security.',
        });
        form.reset();
        logout();
      } else {
        toast({
          variant: 'destructive',
          title: 'Password change failed',
          description: result.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Password change failed',
        description: error.message || 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SDForm methods={form} onSubmit={onSubmit} className="space-y-6 max-w-md">
      <SDInput
        name="currentPassword"
        label="Current Password"
        type="password"
        placeholder="••••••••"
        disabled={isLoading}
      />
      <SDInput
        name="newPassword"
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
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Updating...' : 'Change Password'}
        <LogOut className="ml-2 h-4 w-4" />
      </Button>
    </SDForm>
  );
}
