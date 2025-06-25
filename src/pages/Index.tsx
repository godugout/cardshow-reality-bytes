
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
      <Header />
      <HeroSection />
      
      {/* Demo Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <DemoSection />
        </div>
      </section>
      
      <FeaturesSection />
      <StatsSection />
      
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
          <UserTestimonials />
        </div>
      </section>
      
      <Footer />
      
      {/* Social Proof Ticker */}
      <SocialProofTicker />
    </div>
  );
};

export default Index;
