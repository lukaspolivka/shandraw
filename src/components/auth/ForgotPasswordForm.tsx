'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import CheckEmailCard from './CheckEmailCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Image from 'next/image';
import config from '@/config';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/useToast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ForgetPasswordSchemaType = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAppStore();
  const { toast } = useToast();

  const methods = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgetPasswordSchemaType) => {
    setIsLoading(true);

    try {
      const result = await forgotPassword(values);
      if (result.success) {
        toast({
          variant: 'default',
          title: 'Forget Request Success.',
          description: result.message,
        });
        methods.reset();
        setIsSubmitted(true);
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

  if (isSubmitted) {
    return <CheckEmailCard />;
  }

  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <Image
          src="/icon-transparent.png"
          alt={config.app_name}
          width={48}
          height={48}
          className="mx-auto"
        />
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <SDForm methods={methods} onSubmit={onSubmit} className="space-y-5">
          <SDInput
            name="email"
            label="Email"
            type="email"
            placeholder="john_doe@example.com"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
            <Mail className="ml-2 h-4 w-4" />
          </Button>
        </SDForm>
      </CardContent>
    </Card>
  );
}
