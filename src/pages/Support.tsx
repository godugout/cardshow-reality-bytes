
import Navigation from '@/components/layout/Navigation';
import SupportCenter from '@/components/support/SupportCenter';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <SupportCenter />
      </div>
    </div>
  );
};

export default Support;
