import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/provider/ThemeProvider';
import { Inter, Source_Code_Pro,  } from 'next/font/google';
import { siteMetadata } from '@/config/metadata';

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

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = {
  themeColor: '#112A46',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceCodePro.variable}`}
    >
      <head>
        <meta name="theme-color" content="#112A46" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
