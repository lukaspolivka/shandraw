'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { UserNav } from '../UserNav';

const PublicAuthButton = () => {
  const { getToken } = useAppStore();
  const token = getToken();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {token ? (
        <UserNav />
      ) : (
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      )}
    </div>
  );
};

export default PublicAuthButton;
