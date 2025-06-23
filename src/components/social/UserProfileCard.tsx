
import { useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, Users, Star, Trophy, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile, useUserStats } from '@/hooks/social/useUserProfiles';
import { useUserRelationships } from '@/hooks/social/useUserRelationships';
import { useCommunityAchievements } from '@/hooks/social/useCommunityFeatures';
import { useAuth } from '@/hooks/useAuth';
import ActivityFeed from './ActivityFeed';

interface UserProfileCardProps {
  userId?: string;
  onEditProfile?: () => void;
}

const UserProfileCard = ({ userId, onEditProfile }: UserProfileCardProps) => {
  const { user } = useAuth();
  const { profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { stats, isLoading: isLoadingStats } = useUserStats(userId);
  const { achievements, isLoading: isLoadingAchievements } = useCommunityAchievements(userId);
  const { followUser, unfollowUser, isFollowing, isFollowingUser, isUnfollowingUser } = useUserRelationships();

  const isOwnProfile = !userId || userId === user?.id;

  if (isLoadingProfile) {
    return (
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-6 bg-gray-700 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="p-6 bg-gray-900 border-gray-700 text-center">
        <p className="text-gray-400">Profile not found</p>
      </Card>
    );
  }

  const handleFollowToggle = () => {
    if (!profile.id) return;
    
    if (isFollowing(profile.id)) {
      unfollowUser(profile.id);
    } else {
      followUser(profile.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-900 border-gray-700 overflow-hidden">
        {profile.cover_image_url && (
          <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <img 
              src={profile.cover_image_url} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 border-4 border-gray-800">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg">
                  {profile.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">
                    {profile.full_name || profile.username || 'Anonymous User'}
                  </h1>
                  {profile.is_verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {profile.is_creator && (
                    <Badge className="text-xs bg-purple-600">
                      Creator
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400">@{profile.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>Level {profile.level}</span>
                  <span>{profile.experience_points.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              {isOwnProfile ? (
                <Button onClick={onEditProfile} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleFollowToggle}
                  disabled={isFollowingUser || isUnfollowingUser}
                  variant={isFollowing(profile.id) ? "outline" : "default"}
                  size="sm"
                >
                  {isFollowing(profile.id) ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-300 mb-4">{profile.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            {profile.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>
            )}
            {profile.website_url && (
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                <a 
                  href={profile.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Website
                </a>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Stats */}
          {!isLoadingStats && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.total_followers}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.total_following}</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.total_cards}</div>
                <div className="text-xs text-gray-400">Cards</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{stats.achievements_count}</div>
                <div className="text-xs text-gray-400">Achievements</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <ActivityFeed userId={profile.id} />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingAchievements ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-4 bg-gray-900 border-gray-700">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-3" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-full" />
                  </div>
                </Card>
              ))
            ) : achievements.length === 0 ? (
              <Card className="p-6 text-center bg-gray-900 border-gray-700 col-span-full">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No achievements yet</p>
              </Card>
            ) : (
              achievements.map((achievement) => (
                <Card key={achievement.id} className="p-4 bg-gray-900 border-gray-700">
                  <div className="flex items-center space-x-3">
                    {achievement.badge_image_url ? (
                      <img 
                        src={achievement.badge_image_url} 
                        alt={achievement.achievement_name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{achievement.achievement_name}</h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.points_awarded} XP • {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <Card className="p-6 bg-gray-900 border-gray-700 text-center">
            <p className="text-gray-400">Card collection will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileCard;
