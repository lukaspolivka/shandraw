import Footer from '@/components/layout/Footer';
import { ShareHeader } from '@/components/layout/ShareHeader';

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ShareHeader />
      <main className="flex-1 h-[calc(100vh-4rem-1px)]">{children}</main>
      <Footer />
    </div>
  );
}
