
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Star, 
  Zap, 
  Trophy,
  Heart,
  MessageSquare,
  Share2,
  Filter
} from 'lucide-react';
import UnifiedSocialFeed from './UnifiedSocialFeed';
import CreatorCollectionShowcase from './CreatorCollectionShowcase';
import { useCommunityStats } from '@/hooks/social/useCommunityFeatures';

interface IntegratedCommunityDashboardProps {
  className?: string;
}

const IntegratedCommunityDashboard = ({ className }: IntegratedCommunityDashboardProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const { stats, isLoading: isLoadingStats } = useCommunityStats();

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Community Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
            <p className="text-muted-foreground">
              Discover creators, collections, and connect with the community
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search creators, collections, cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Creators"
            value={isLoadingStats ? '...' : stats?.totalUsers?.toLocaleString() || '0'}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            trend="+12%"
          />
          <StatCard
            title="Total Cards"
            value={isLoadingStats ? '...' : stats?.totalCards?.toLocaleString() || '0'}
            icon={<Zap className="w-5 h-5 text-green-500" />}
            trend="+8%"
          />
          <StatCard
            title="Collections"
            value={isLoadingStats ? '...' : stats?.totalCollections?.toLocaleString() || '0'}
            icon={<Star className="w-5 h-5 text-purple-500" />}
            trend="+15%"
          />
          <StatCard
            title="Community Posts"
            value={isLoadingStats ? '...' : stats?.totalActivities?.toLocaleString() || '0'}
            icon={<MessageSquare className="w-5 h-5 text-orange-500" />}
            trend="+22%"
          />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
              <UnifiedSocialFeed />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Card
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    New Collection
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Challenge
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Content
                  </Button>
                </CardContent>
              </Card>

              {/* Trending Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <TrendingTag tag="DigitalArt" count="1.2k" />
                    <TrendingTag tag="FantasyCards" count="856" />
                    <TrendingTag tag="NewCreator" count="623" />
                    <TrendingTag tag="CollectionDrop" count="445" />
                    <TrendingTag tag="CommunityChallenge" count="338" />
                  </div>
                </CardContent>
              </Card>

              {/* Featured Community Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Spotlight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CommunityMember
                      name="ArtMaster"
                      role="Creator"
                      achievement="Card of the Week"
                      avatar="/placeholder-avatar.jpg"
                    />
                    <CommunityMember
                      name="CollectorPro"
                      role="Collector"
                      achievement="1000+ Cards"
                    />
                    <CommunityMember
                      name="TradingKing"
                      role="Trader"
                      achievement="Top Trader"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discover">
          <CreatorCollectionShowcase />
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TrendingCard
              type="card"
              title="Mystic Dragon"
              creator="ArtMaster"
              metric="2.1k views"
              trend="+45%"
            />
            <TrendingCard
              type="collection"
              title="Epic Heroes"
              creator="CardCrafter"
              metric="890 followers"
              trend="+23%"
            />
            <TrendingCard
              type="creator"
              title="NewArtist"
              creator=""
              metric="1.5k followers"
              trend="+112%"
            />
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community Challenges</h3>
              <p className="text-muted-foreground text-center mb-4">
                Participate in community challenges and showcase your creativity
              </p>
              <Button>View Active Challenges</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community Events</h3>
              <p className="text-muted-foreground text-center mb-4">
                Join live streams, workshops, and community meetups
              </p>
              <Button>Discover Events</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-4">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex items-center text-xs text-green-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </div>
      </div>
      {icon}
    </CardContent>
  </Card>
);

const TrendingTag = ({ tag, count }: { tag: string; count: string }) => (
  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
    <span className="font-medium">#{tag}</span>
    <Badge variant="secondary" className="text-xs">{count} posts</Badge>
  </div>
);

const CommunityMember = ({ name, role, achievement, avatar }: {
  name: string;
  role: string;
  achievement: string;
  avatar?: string;
}) => (
  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="text-xs font-medium">{name.charAt(0)}</span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{name}</p>
      <p className="text-xs text-muted-foreground">{role} • {achievement}</p>
    </div>
  </div>
);

const TrendingCard = ({ type, title, creator, metric, trend }: {
  type: 'card' | 'collection' | 'creator';
  title: string;
  creator: string;
  metric: string;
  trend: string;
}) => (
  <Card className="transition-all duration-200 hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs capitalize">{type}</Badge>
        <div className="flex items-center text-xs text-green-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </div>
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      {creator && (
        <p className="text-sm text-muted-foreground mb-2">by {creator}</p>
      )}
      <p className="text-xs text-muted-foreground">{metric}</p>
    </CardContent>
  </Card>
);

export default IntegratedCommunityDashboard;
