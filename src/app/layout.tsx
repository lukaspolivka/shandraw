import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import config from '@/config';
import { cn } from '@/lib/utils';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { ThemeProvider } from '@/components/provider/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#112A46" />
      </head>
      <body className={cn('font-body antialiased', inter.variable, sourceCodePro.variable)}>
        <ThemeProvider disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
