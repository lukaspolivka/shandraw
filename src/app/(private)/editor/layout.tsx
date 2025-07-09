'use client';

import Footer from '@/components/layout/Footer';
import EditorHeader from '@/components/layout/EditorHeader';
import config from '@/config';

const title = `Schema Editor - ${config.app_name}`;
const description = `Design, edit, and visualize your database schemas using the powerful editor in ${config.app_name}.`;

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <EditorHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
