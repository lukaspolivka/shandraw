'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { SDForm } from '../shared/form/SDForm';
import { SDInput } from '../shared/form/SDInput';
import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  avatar: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, updateProfile } = useAppStore();
  const { toast } = useToast();

  const form = useForm<ProfileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    values: { name: user!.name, avatar: user!.avatar || '' },
  });

  const onSubmit = async (values: ProfileFormSchemaType) => {
    try {
      const result = await updateProfile(values);
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your changes have been saved.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    }
  };

  if (!user) return null;

  return (
    <SDForm methods={form} onSubmit={onSubmit} className="space-y-6 max-w-md">
      <SDInput
        name="name"
        label="Name"
        placeholder="Your Name"
        disabled={form.formState.isSubmitting}
      />
      <SDInput
        name="avatar"
        label="Avatar URL"
        placeholder="https://example.com/avatar.png"
        disabled={form.formState.isSubmitting}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Profile
      </Button>
    </SDForm>
  );
}
