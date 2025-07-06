import Link from 'next/link';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import config from '@/config';
import { AlertTriangle } from 'lucide-react';
import LoadingUI from '@/components/shared/LoadingUI';

const NoTokenAlert = () => {
  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <CardTitle className="text-2xl">Invalid Link</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          The password reset link is missing or invalid. Please request a new one.
        </p>
      </CardContent>
    </Card>
  );
};

function ResetPasswordPageContent({ token }: { token: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {token ? (
          <Card>
            <CardHeader className="space-y-2 text-center">
              <Image
                src="/icon-transparent.png"
                alt={config.app_name}
                width={48}
                height={48}
                className="mx-auto"
              />
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>Enter a new password for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm token={token} />
            </CardContent>
          </Card>
        ) : (
          <NoTokenAlert />
        )}
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

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;
  return (
    <Suspense fallback={<LoadingUI />}>
      <ResetPasswordPageContent token={token} />
    </Suspense>
  );
}
