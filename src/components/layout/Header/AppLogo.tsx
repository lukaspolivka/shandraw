import config from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AppLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/icon-transparent.png" alt={config.app_name} height={30} width={30} />
      <span className="font-bold">{config.app_name}</span>
    </Link>
  );
};

export default AppLogo;
