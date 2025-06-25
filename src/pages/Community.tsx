
import { Suspense } from 'react';
import CommunityDashboard from '@/components/social/CommunityDashboard';
import { Skeleton } from '@/components/ui/skeleton';

const Community = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Community</h1>
          <p className="text-gray-400">
            Connect with creators, collectors, and fellow enthusiasts in the Cardshow community
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        }>
          <CommunityDashboard />
        </Suspense>
      </div>
    </div>
  );
};

export default Community;
