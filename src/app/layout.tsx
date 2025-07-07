import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import config from '@/config';
import { cn } from '@/lib/utils';
import { Inter, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: config.app_name,
  description: 'Code-driven database diagramming tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('antialiased', inter.variable, sourceCodePro.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
