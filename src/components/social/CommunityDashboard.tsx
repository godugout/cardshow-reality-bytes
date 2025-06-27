
import { useState } from 'react';
import { Trophy, Users, Star, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCommunityLeaderboard, useCommunityStats } from '@/hooks/social/useCommunityFeatures';
import ActivityFeed from './ActivityFeed';

const CommunityDashboard = () => {
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');
  const { leaderboard, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(leaderboardTimeframe);
  const { stats, isLoading: isLoadingStats } = useCommunityStats();

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoadingStats ? '...' : stats?.totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cards</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoadingStats ? '...' : stats?.totalCards.toLocaleString()}
              </p>
            </div>
            <Star className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collections</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoadingStats ? '...' : stats?.totalCollections.toLocaleString()}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activities</p>
              <p className="text-2xl font-bold text-foreground">
                {isLoadingStats ? '...' : stats?.totalActivities.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Trending Today</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">#DigitalArt</span>
                    <Badge variant="secondary">1.2k posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">#CardCollection</span>
                    <Badge variant="secondary">856 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">#NewCreator</span>
                    <Badge variant="secondary">623 posts</Badge>
                  </div>
                </div>
              </Card>

              {/* Featured Creators */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Featured Creators</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>C{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Creator {i}</p>
                        <p className="text-sm text-muted-foreground">1.{i}k followers</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Community Leaderboard</h2>
                <div className="flex space-x-2">
                  {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={leaderboardTimeframe === timeframe ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLeaderboardTimeframe(timeframe)}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1).replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoadingLeaderboard ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded" />
                      <div className="w-10 h-10 bg-muted rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-32 mb-2" />
                        <div className="h-3 bg-muted rounded w-20" />
                      </div>
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        index < 3 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {index === 0 && <Trophy className="w-6 h-6 text-primary" />}
                        {index === 1 && <Award className="w-6 h-6 text-muted-foreground" />}
                        {index === 2 && <Award className="w-6 h-6 text-primary/70" />}
                        {index > 2 && (
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>

                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {user.full_name || user.username || 'Anonymous'}
                          </span>
                          {user.is_verified && (
                            <Star className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Level {user.level}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {user.experience_points.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <Card className="p-6 bg-card border-border text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">Community Challenges</h3>
            <p className="text-muted-foreground mb-4">
              Participate in exciting challenges and win amazing prizes
            </p>
            <Button>View Active Challenges</Button>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card className="p-6 bg-card border-border text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">Upcoming Events</h3>
            <p className="text-muted-foreground mb-4">
              Join live events, tournaments, and creator showcases
            </p>
            <Button>View Event Calendar</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;
