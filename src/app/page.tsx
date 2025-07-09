import PublicHeader from '@/components/layout/PublicHeader';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PricingSection from '@/components/home/PricingSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="flex min-h-screen  flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 max-w-7xl mx-auto p-5">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
