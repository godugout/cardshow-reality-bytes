
import MarketplaceCard from '../MarketplaceCard';
import type { MarketplaceListing } from '@/types/marketplace';

interface MarketplaceResultsProps {
  listings: MarketplaceListing[];
  isLoading: boolean;
}

const MarketplaceResults = ({ listings, isLoading }: MarketplaceResultsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {listings.length} listings found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <MarketplaceCard key={listing.id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No listings found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </>
  );
};

export default MarketplaceResults;
