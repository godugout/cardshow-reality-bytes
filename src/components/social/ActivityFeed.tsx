
import { useState } from 'react';
import { Heart, MessageCircle, Share, Trophy, Star, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocialActivities, useActivityReactions } from '@/hooks/social/useSocialActivities';
import type { SocialActivity } from '@/types/social';

interface ActivityFeedProps {
  userId?: string;
  className?: string;
}

const ActivityFeed = ({ userId, className }: ActivityFeedProps) => {
  const { activities, isLoading } = useSocialActivities(userId);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 bg-gray-900 border-gray-700">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2" />
                  <div className="h-3 bg-gray-700 rounded w-20" />
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.length === 0 ? (
        <Card className="p-8 text-center bg-gray-900 border-gray-700">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-2">No activities yet</h3>
          <p className="text-gray-400">
            Follow some creators to see their latest activities in your feed
          </p>
        </Card>
      ) : (
        activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))
      )}
    </div>
  );
};

interface ActivityCardProps {
  activity: SocialActivity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { toggleReaction, isToggling } = useActivityReactions(activity.id);
  const [isLiked, setIsLiked] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_created':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'collection_created':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'achievement_unlocked':
        return <Trophy className="w-4 h-4 text-green-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityMessage = (activity: SocialActivity) => {
    switch (activity.activity_type) {
      case 'card_created':
        return `created a new card "${activity.metadata?.card_title || 'Untitled'}"`;
      case 'collection_created':
        return `created a new collection "${activity.metadata?.collection_title || 'Untitled'}"`;
      case 'achievement_unlocked':
        return `unlocked the "${activity.metadata?.achievement_name || 'Unknown'}" achievement`;
      case 'follow':
        return `started following ${activity.metadata?.target_username || 'someone'}`;
      default:
        return 'shared an update';
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toggleReaction();
  };

  return (
    <Card className="p-4 bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={activity.avatar_url || ''} />
          <AvatarFallback>
            {activity.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-white">
              {activity.username || 'Anonymous User'}
            </span>
            {getActivityIcon(activity.activity_type)}
            <span className="text-gray-300 text-sm">
              {getActivityMessage(activity)}
            </span>
            {activity.featured_status && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-3">
            {new Date(activity.activity_timestamp).toLocaleString()}
          </p>

          {activity.metadata?.description && (
            <p className="text-gray-300 mb-3">
              {activity.metadata.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isToggling}
              className={`h-8 px-2 ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {activity.reaction_count + (isLiked ? 1 : 0)}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Reply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-400 hover:text-green-500"
            >
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityFeed;
