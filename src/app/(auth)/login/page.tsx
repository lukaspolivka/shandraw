import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/config';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <Image
              src="/icon-transparent.png"
              alt={config.app_name}
              width={48}
              height={48}
              className="mx-auto"
            />
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline transition-colors hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
