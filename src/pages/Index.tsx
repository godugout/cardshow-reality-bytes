
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';

const Index = () => {
  return (
    <PageErrorBoundary pageName="Home">
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <PageErrorBoundary pageName="Hero Section">
            <HeroSection />
          </PageErrorBoundary>
          <PageErrorBoundary pageName="Features Section">
            <FeaturesSection />
          </PageErrorBoundary>
          <PageErrorBoundary pageName="Stats Section">
            <StatsSection />
          </PageErrorBoundary>
        </main>
        <Footer />
      </div>
    </PageErrorBoundary>
  );
};

export default Index;
