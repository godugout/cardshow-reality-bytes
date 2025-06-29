
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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
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
      <div className="section">
        <div className="container">
          <div className="grid-cards mb-12">
            <ContentCard
              title="Creator Challenges"
              description="Participate in weekly design challenges, showcase your skills, and win exclusive rewards and recognition."
              badge={{ text: "Weekly Events", variant: "success" }}
              icon={Trophy}
              action={{
                text: "View Challenges",
                onClick: () => console.log('View challenges')
              }}
              stats={[
                { label: "Active", value: "12" },
                { label: "Winners", value: "156" }
              ]}
            />

            <ContentCard
              title="Community Forums"
              description="Join discussions, share tips, get feedback on your work, and connect with fellow creators and collectors."
              badge={{ text: "24/7 Active", variant: "default" }}
              icon={MessageCircle}
              action={{
                text: "Join Discussion",
                onClick: () => console.log('Join discussion')
              }}
              stats={[
                { label: "Topics", value: "2.3K" },
                { label: "Daily Posts", value: "450+" }
              ]}
            />

            <ContentCard
              title="Trending Creators"
              description="Discover rising stars in the community, follow your favorite creators, and get inspired by their latest work."
              badge={{ text: "Updated Daily" }}
              icon={TrendingUp}
              action={{
                text: "Explore Creators",
                onClick: () => console.log('Explore creators')
              }}
              stats={[
                { label: "Featured", value: "24" },
                { label: "This Week", value: "156" }
              ]}
            />

            <ContentCard
              title="Creator Showcase"
              description="Feature your best work in our community gallery, get votes from peers, and gain recognition."
              badge={{ text: "Curated Weekly" }}
              icon={Star}
              action={{
                text: "Submit Work",
                onClick: () => console.log('Submit work')
              }}
              stats={[
                { label: "Featured", value: "89" },
                { label: "Votes Cast", value: "12K+" }
              ]}
            />

            <ContentCard
              title="Collaboration Hub"
              description="Find creative partners, join collaborative projects, and create amazing collections together."
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
              description="Unlock badges, earn reputation points, and climb the leaderboards as you contribute to the community."
              badge={{ text: "Gamified Experience" }}
              icon={Award}
              action={{
                text: "View Achievements",
                onClick: () => console.log('View achievements')
              }}
              stats={[
                { label: "Badges", value: "45" },
                { label: "Top Players", value: "500" }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Community Dashboard */}
      <div className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-title mb-4" style={{ color: 'var(--primary)' }}>
              Community Activity Feed
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto">
              Stay updated with the latest happenings, featured content, and community highlights.
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
  <div className="space-y-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-8 animate-pulse">
          <div className="h-16 w-full rounded-lg skeleton" />
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-8 animate-pulse">
            <div className="h-32 w-full rounded-lg skeleton" />
          </div>
        ))}
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-8 animate-pulse">
            <div className="h-24 w-full rounded-lg skeleton" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Community;
