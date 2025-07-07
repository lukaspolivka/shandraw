import DashboardHeader from '@/components/layout/DashboardHeader';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
