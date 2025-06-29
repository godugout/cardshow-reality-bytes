
import { Suspense } from 'react';
import Header from '@/components/Header';
import PageHeader from '@/components/ui/page-header';
import ContentCard from '@/components/ui/content-card';
import IntegratedCommunityDashboard from '@/components/social/IntegratedCommunityDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MessageCircle, 
  Users, 
  Trophy, 
  TrendingUp,
  Star,
  Award
} from 'lucide-react';

const Community = () => {
  const handleJoinCommunity = () => {
    console.log('Joining community...');
  };

  const handleViewForums = () => {
    console.log('Viewing forums...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <Header />
      
      <PageHeader
        badge={{
          icon: MessageCircle,
          text: "Active Community Hub"
        }}
        title="Creator"
        subtitle="Community"
        description="Connect with passionate creators and collectors worldwide. Share your work, discover new talent, and build lasting relationships in our thriving digital collectibles community."
        primaryAction={{
          text: "Join Community",
          onClick: handleJoinCommunity
        }}
        secondaryAction={{
          text: "Browse Forums",
          onClick: handleViewForums
        }}
        stats={[
          { value: "12.5K+", label: "Active Members" },
          { value: "8.2K+", label: "Creators" },
          { value: "150K+", label: "Posts Shared" },
          { value: "2.4M+", label: "Interactions" }
        ]}
      />

      {/* Community Features Grid */}
      <div className="py-20 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Community Features
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover all the ways you can connect, create, and grow within our vibrant community ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ContentCard
              title="Creator Challenges"
              description="Participate in weekly design challenges, showcase your skills, and win exclusive rewards and recognition from the community."
              badge={{ text: "Weekly Events", variant: "success" }}
              icon={Trophy}
              action={{
                text: "View Challenges",
                onClick: () => console.log('View challenges')
              }}
              stats={[
                { label: "Active Challenges", value: "12" },
                { label: "Total Winners", value: "156" }
              ]}
            />

            <ContentCard
              title="Community Forums"
              description="Join discussions, share tips, get feedback on your work, and connect with fellow creators and collectors in our active forums."
              badge={{ text: "24/7 Active", variant: "default" }}
              icon={MessageCircle}
              action={{
                text: "Join Discussion",
                onClick: () => console.log('Join discussion')
              }}
              stats={[
                { label: "Active Topics", value: "2.3K" },
                { label: "Daily Posts", value: "450+" }
              ]}
            />

            <ContentCard
              title="Trending Creators"
              description="Discover rising stars in the community, follow your favorite creators, and get inspired by their latest innovative work."
              badge={{ text: "Updated Daily" }}
              icon={TrendingUp}
              action={{
                text: "Explore Creators",
                onClick: () => console.log('Explore creators')
              }}
              stats={[
                { label: "Featured Today", value: "24" },
                { label: "This Week", value: "156" }
              ]}
            />

            <ContentCard
              title="Creator Showcase"
              description="Feature your best work in our community gallery, get votes from peers, and gain recognition for your creative achievements."
              badge={{ text: "Curated Weekly" }}
              icon={Star}
              action={{
                text: "Submit Work",
                onClick: () => console.log('Submit work')
              }}
              stats={[
                { label: "Featured Works", value: "89" },
                { label: "Community Votes", value: "12K+" }
              ]}
            />

            <ContentCard
              title="Collaboration Hub"
              description="Find creative partners, join collaborative projects, and create amazing collections together with like-minded creators."
              badge={{ text: "Project Matching" }}
              icon={Users}
              action={{
                text: "Find Partners",
                onClick: () => console.log('Find partners')
              }}
              stats={[
                { label: "Active Projects", value: "34" },
                { label: "Completed", value: "128" }
              ]}
            />

            <ContentCard
              title="Achievement System"
              description="Unlock badges, earn reputation points, and climb the leaderboards as you contribute to and engage with the community."
              badge={{ text: "Gamified Experience" }}
              icon={Award}
              action={{
                text: "View Achievements",
                onClick: () => console.log('View achievements')
              }}
              stats={[
                { label: "Total Badges", value: "45" },
                { label: "Top Players", value: "500" }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Community Dashboard */}
      <div className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Community Activity Feed
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest happenings, featured content, and community highlights from creators you follow.
            </p>
          </div>
          
          <Suspense fallback={<CommunityDashboardSkeleton />}>
            <IntegratedCommunityDashboard />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const CommunityDashboardSkeleton = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8">
          <div className="h-20 w-full bg-slate-600/50 rounded-xl mb-4 animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-600/50 rounded animate-pulse" />
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8">
            <div className="h-40 w-full bg-slate-600/50 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-2xl p-8">
            <div className="h-32 w-full bg-slate-600/50 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Community;
