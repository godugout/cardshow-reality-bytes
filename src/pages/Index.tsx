
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import UserTestimonials from "@/components/landing/UserTestimonials";
import DemoSection from "@/components/landing/DemoSection";
import SocialProofTicker from "@/components/landing/SocialProofTicker";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Demo Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <ErrorBoundary>
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Loading demo...</div>}>
              <DemoSection />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
      
      <ErrorBoundary>
        <FeaturesSection />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <StatsSection />
      </ErrorBoundary>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our community of artists, collectors, and traders have to say about Cardshow
            </p>
          </div>
          <ErrorBoundary>
            <Suspense fallback={<div className="h-32 flex items-center justify-center text-gray-400">Loading testimonials...</div>}>
              <UserTestimonials />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
      
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      
      {/* Social Proof Ticker */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <SocialProofTicker />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
