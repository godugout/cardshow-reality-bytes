
import { useState, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Eye, Star, Users, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { useSocialActivities } from '@/hooks/social/useSocialActivities';
import { useCardFavorites } from '@/hooks/cards/useCardFavorites';
import { formatDistanceToNow } from 'date-fns';
import type { SocialActivity } from '@/types/social';

interface UnifiedSocialFeedProps {
  className?: string;
}

const UnifiedSocialFeed = ({ className }: UnifiedSocialFeedProps) => {
  const { activities, isLoading } = useSocialActivities();
  const { toggleFavorite } = useCardFavorites();
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((activityId: string) => {
    setExpandedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_created': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'collection_created': return <Users className="w-4 h-4 text-green-500" />;
      case 'card_shared': return <Share2 className="w-4 h-4 text-purple-500" />;
      case 'achievement_unlocked': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'follow': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatActivity = (activity: SocialActivity) => {
    const username = activity.username || 'Someone';
    switch (activity.activity_type) {
      case 'card_created':
        return `${username} created a new ${activity.metadata?.card_rarity || 'card'}`;
      case 'collection_created':
        return `${username} started a new collection`;
      case 'card_shared':
        return `${username} shared a card with the community`;
      case 'achievement_unlocked':
        return `${username} unlocked "${activity.metadata?.achievement_name}"`;
      case 'follow':
        return `${username} started following ${activity.metadata?.target_username}`;
      default:
        return `${username} was active`;
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-48 mb-2" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
            </div>
            <div className="h-32 bg-muted rounded mb-3" />
            <div className="flex space-x-4">
              <div className="h-8 bg-muted rounded w-16" />
              <div className="h-8 bg-muted rounded w-16" />
              <div className="h-8 bg-muted rounded w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {activities.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Welcome to the Community</h3>
          <p className="text-muted-foreground mb-4">
            Follow creators and collections to see their latest activities here
          </p>
          <Button>Discover Creators</Button>
        </Card>
      ) : (
        activities.map((activity) => (
          <SocialActivityCard
            key={activity.id}
            activity={activity}
            isExpanded={expandedActivities.has(activity.id)}
            onToggleExpanded={() => toggleExpanded(activity.id)}
            onToggleFavorite={toggleFavorite}
            getActivityIcon={getActivityIcon}
            formatActivity={formatActivity}
          />
        ))
      )}
    </div>
  );
};

interface SocialActivityCardProps {
  activity: SocialActivity;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleFavorite: any;
  getActivityIcon: (type: string) => JSX.Element;
  formatActivity: (activity: SocialActivity) => string;
}

const SocialActivityCard = ({
  activity,
  isExpanded,
  onToggleExpanded,
  onToggleFavorite,
  getActivityIcon,
  formatActivity
}: SocialActivityCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(activity.reaction_count || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const hasCardContent = activity.metadata?.card_id && activity.metadata?.card_image_url;
  const hasCollectionContent = activity.metadata?.collection_id;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Activity Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activity.avatar_url} />
            <AvatarFallback>
              {activity.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {getActivityIcon(activity.activity_type)}
              <p className="text-sm font-medium text-foreground">
                {formatActivity(activity)}
              </p>
              {activity.featured_status && (
                <Badge variant="secondary" className="text-xs">Featured</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.activity_timestamp), { addSuffix: true })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            className="text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Activity Content */}
      {hasCardContent && isExpanded && (
        <div className="px-4 pb-3">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-32 flex-shrink-0">
              <InteractiveCard
                size="sm"
                card={{
                  id: activity.metadata.card_id,
                  title: activity.metadata.card_title || 'Untitled',
                  image_url: activity.metadata.card_image_url,
                  creator_id: activity.user_id || '',
                  rarity: (activity.metadata.card_rarity as any) || 'common'
                }}
                className="w-full h-full"
              >
                <img
                  src={activity.metadata.card_image_url}
                  alt={activity.metadata.card_title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </InteractiveCard>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1">
                {activity.metadata.card_title}
              </h4>
              {activity.metadata.card_description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                  {activity.metadata.card_description}
                </p>
              )}
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {activity.metadata.card_rarity}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="w-3 h-3 mr-1" />
                  {activity.metadata.card_views || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCollectionContent && isExpanded && (
        <div className="px-4 pb-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">
                {activity.metadata.collection_title}
              </h4>
            </div>
            {activity.metadata.collection_description && (
              <p className="text-xs text-muted-foreground mb-2">
                {activity.metadata.collection_description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {activity.metadata.collection_card_count || 0} cards
              </span>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                View Collection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Actions */}
      <div className="px-4 pb-4 pt-1 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground hover:text-green-500"
            >
              <Share2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>

          {(hasCardContent || hasCollectionContent) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
              className="h-8 px-2 text-muted-foreground"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UnifiedSocialFeed;
