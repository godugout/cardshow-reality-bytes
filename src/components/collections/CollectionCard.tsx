import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useCollectionMutations } from '@/hooks/useCollections';
import type { Collection } from '@/types/collection';
import { Heart, Eye, Users, MoreVertical, Edit, Trash2, Cube } from 'lucide-react';

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
    public: 'bg-green-500/20 text-green-400 border-green-500/30',
    private: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    shared: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-200 group overflow-hidden">
      <Link to={`/collections/${collection.id}`}>
        <div className="relative">
          {/* Cover Image */}
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
            {collection.cover_image_url ? (
              <img
                src={collection.cover_image_url}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-600 opacity-50">
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
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
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
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70 text-white border-0"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {user && user.id !== collection.owner_id && (
                    <DropdownMenuItem 
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                      onClick={handleFollowToggle}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
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
              <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
                {collection.title}
              </h3>
              {collection.description && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={collection.owner?.avatar_url} />
                <AvatarFallback className="bg-gray-700 text-xs">
                  {collection.owner?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-400 text-sm">
                {collection.owner?.username || 'Unknown'}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {collection.card_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {collection.follower_count || 0}
                </span>
              </div>
              
              {user && user.id !== collection.owner_id && collection.visibility === 'public' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFollowToggle}
                  className={`h-7 px-2 ${
                    isFollowing 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-gray-400 hover:text-white'
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
