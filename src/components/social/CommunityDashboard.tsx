
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
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : stats?.totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Cards</p>
              <p className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : stats?.totalCards.toLocaleString()}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Collections</p>
              <p className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : stats?.totalCollections.toLocaleString()}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Activities</p>
              <p className="text-2xl font-bold text-white">
                {isLoadingStats ? '...' : stats?.totalActivities.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
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
              <Card className="p-6 bg-gray-900 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Trending Today</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">#DigitalArt</span>
                    <Badge variant="secondary">1.2k posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">#CardCollection</span>
                    <Badge variant="secondary">856 posts</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">#NewCreator</span>
                    <Badge variant="secondary">623 posts</Badge>
                  </div>
                </div>
              </Card>

              {/* Featured Creators */}
              <Card className="p-6 bg-gray-900 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Featured Creators</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>C{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">Creator {i}</p>
                        <p className="text-sm text-gray-400">1.{i}k followers</p>
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
          <Card className="bg-gray-900 border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Community Leaderboard</h2>
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
                      <div className="w-8 h-8 bg-gray-700 rounded" />
                      <div className="w-10 h-10 bg-gray-700 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-700 rounded w-20" />
                      </div>
                      <div className="h-6 bg-gray-700 rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20' : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                        {index === 1 && <Award className="w-6 h-6 text-gray-400" />}
                        {index === 2 && <Award className="w-6 h-6 text-amber-600" />}
                        {index > 2 && (
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
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
                          <span className="font-medium text-white">
                            {user.full_name || user.username || 'Anonymous'}
                          </span>
                          {user.is_verified && (
                            <Star className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">Level {user.level}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {user.experience_points.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <Card className="p-6 bg-gray-900 border-gray-700 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">Community Challenges</h3>
            <p className="text-gray-400 mb-4">
              Participate in exciting challenges and win amazing prizes
            </p>
            <Button>View Active Challenges</Button>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card className="p-6 bg-gray-900 border-gray-700 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-2">Upcoming Events</h3>
            <p className="text-gray-400 mb-4">
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
