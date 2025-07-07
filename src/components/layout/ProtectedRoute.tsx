'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, fetchUser, getToken } = useAppStore();
  const [isVerified, setIsVerified] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace(`/login?redirectForm=${pathname}`);
      return;
    }

    if (!user) {
      fetchUser().then(() => setIsVerified(true));
    } else {
      setIsVerified(true);
    }
  }, [router, user, fetchUser, getToken, pathname, setIsVerified]);

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex-1 p-4">
          <Skeleton className="h-full w-full" />
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
