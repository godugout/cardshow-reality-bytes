
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useCollectionMutations } from '@/hooks/useCollections';
import type { Collection } from '@/types/collection';
import { Heart, Eye, Users, MoreVertical, Star } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const { user } = useAuth();
  const { followCollection, unfollowCollection } = useCollectionMutations();
  const [isFollowing, setIsFollowing] = useState(collection.is_following || false);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;

    try {
      if (isFollowing) {
        await unfollowCollection.mutateAsync(collection.id);
        setIsFollowing(false);
      } else {
        await followCollection.mutateAsync(collection.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const visibilityColors = {
    public: 'bg-[#10B981] text-white',
    private: 'bg-gray-600 text-white',
    shared: 'bg-[#00C851] text-white'
  } as const;

  return (
    <Card className="hover:shadow-md transition-all duration-200 group overflow-hidden bg-card-bright border-gray-700 hover:border-gray-600">
      <Link to={`/collections/${collection.id}`}>
        <div className="relative">
          {/* Cover Image */}
          <div className="aspect-video bg-gray-800 relative overflow-hidden">
            {collection.cover_image_url ? (
              <img
                src={collection.cover_image_url}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-400 opacity-50">
                  {collection.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            
            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={visibilityColors[collection.visibility]}>
                {collection.visibility}
              </Badge>
              {collection.is_featured && (
                <Badge className="bg-[#F59E0B] text-black font-semibold">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-black/60 hover:bg-black/80 text-white border border-white/20"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
                  <DropdownMenuItem className="text-secondary-bright hover:text-primary-bright hover:bg-gray-700">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {user && user.id !== collection.user_id && (
                    <DropdownMenuItem 
                      onClick={handleFollowToggle}
                      className="text-secondary-bright hover:text-primary-bright hover:bg-gray-700"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-pink-400' : ''}`} />
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Title and Description */}
            <div className="mb-3">
              <h3 className="collection-title-bright text-lg mb-1 line-clamp-1">
                {collection.title}
              </h3>
              {collection.description && (
                <p className="collection-description-bright text-sm line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={collection.owner?.avatar_url} />
                <AvatarFallback className="bg-gray-600 text-white text-xs">
                  {collection.owner?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-tertiary-bright text-sm">
                {collection.owner?.username || 'Unknown'}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-tertiary-bright">
                  <Eye className="w-4 h-4 text-cyan-300" />
                  <span className="text-cyan-300">{collection.card_count || 0}</span>
                </span>
                <span className="flex items-center gap-1 text-tertiary-bright">
                  <Users className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-300">{collection.follower_count || 0}</span>
                </span>
              </div>
              
              {user && user.id !== collection.user_id && collection.visibility === 'public' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFollowToggle}
                  className={`transition-colors ${
                    isFollowing 
                      ? 'text-pink-400 hover:text-pink-300' 
                      : 'text-gray-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
};

export default CollectionCard;
