import Footer from '@/components/layout/Footer';
import { ShareHeader } from '@/components/layout/ShareHeader';
import config from '@/config';

export const metadata = {
  title: `Shared Schema - ${config.app_name}`,
  description: `View a publicly shared database schema created using ${config.app_name}.`,
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ShareHeader />
      <main className="flex-1 h-[calc(100vh-4rem-1px)]">{children}</main>
      <Footer />
    </div>
  );
}
