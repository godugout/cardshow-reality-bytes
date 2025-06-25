
import Header from '@/components/Header';
import TradesList from '@/components/trading/TradesList';

const Trading = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <TradesList />
      </div>
    </div>
  );
};

export default Trading;
