
import Header from '@/components/Header';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main id="main-content" className="container section">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Marketplace</h1>
          <p className="text-lg text-secondary">
            Discover and trade premium digital cards from verified creators
          </p>
        </div>

        <MarketplaceGrid />
      </main>
    </div>
  );
};

export default Marketplace;
