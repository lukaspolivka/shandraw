import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import config from '@/config';

export const metadata = {
  title: `Forgot Password - ${config.app_name}`,
  description: `Recover access to your ${config.app_name} account by resetting your password securely.`,
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
        <div className="mt-4 text-center text-sm">
          Remembered your password?{' '}
          <Link href="/login" className="underline transition-colors hover:text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
