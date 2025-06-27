
import { useState } from 'react';
import Header from '@/components/Header';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import type { ListingFilters } from '@/types/marketplace';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="cdg-container py-8">
        <div className="mb-8">
          <h1 className="cdg-headline-1 mb-4">Marketplace</h1>
          <p className="cdg-body-1 text-muted-foreground">
            Discover and trade premium digital cards from verified creators
          </p>
        </div>

        <MarketplaceGrid />
      </div>
    </div>
  );
};

export default Marketplace;
