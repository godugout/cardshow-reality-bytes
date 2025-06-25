
import Header from '@/components/Header';
import SupportCenter from '@/components/support/SupportCenter';

const Support = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SupportCenter />
      </div>
    </div>
  );
};

export default Support;
