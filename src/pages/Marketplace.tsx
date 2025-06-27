
import Header from '@/components/Header';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="cdg-container py-8">
        <div className="mb-8">
          <h1 className="cdg-headline-1 mb-4">Marketplace</h1>
          <p className="cdg-body-1 text-muted-foreground">
            Discover and trade premium digital cards from verified creators
          </p>
        </div>

        <MarketplaceGrid />
      </main>
    </div>
  );
};

export default Marketplace;
