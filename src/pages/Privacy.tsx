
import Navigation from '@/components/layout/Navigation';
import GDPRCompliance from '@/components/enterprise/GDPRCompliance';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <GDPRCompliance />
      </div>
    </div>
  );
};

export default Privacy;
