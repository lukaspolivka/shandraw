import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import config from '@/config';

const CheckEmailCard = () => {
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
        <CardTitle className="text-2xl">Check your email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          If an account with that email exists, we have sent a password reset link to it.
        </p>
      </CardContent>
    </Card>
  );
};

export default CheckEmailCard;
