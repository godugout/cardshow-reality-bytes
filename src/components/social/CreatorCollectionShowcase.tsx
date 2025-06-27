
import { useState } from 'react';
import { Star, Users, Eye, Heart, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { cn } from '@/lib/utils';

interface Creator {
  id: string;
  username: string;
  avatar_url?: string;
  is_verified?: boolean;
  follower_count: number;
  card_count: number;
  total_views: number;
  specialties: string[];
  recent_cards: any[];
  featured_collection?: any;
}

interface Collection {
  id: string;
  title: string;
  description?: string;
  owner: {
    username: string;
    avatar_url?: string;
  };
  card_count: number;
  follower_count: number;
  preview_cards: any[];
  is_featured: boolean;
  category: string;
}

interface CreatorCollectionShowcaseProps {
  className?: string;
}

const CreatorCollectionShowcase = ({ className }: CreatorCollectionShowcaseProps) => {
  const [activeTab, setActiveTab] = useState('trending');

  // Mock data - replace with real data from hooks
  const featuredCreators: Creator[] = [
    {
      id: '1',
      username: 'ArtMaster',
      avatar_url: '/placeholder-avatar.jpg',
      is_verified: true,
      follower_count: 1250,
      card_count: 45,
      total_views: 12500,
      specialties: ['Fantasy', 'Digital Art'],
      recent_cards: [],
      featured_collection: {
        id: '1',
        title: 'Mystic Realm',
        card_count: 12
      }
    },
    {
      id: '2',
      username: 'CardCrafter',
      follower_count: 890,
      card_count: 32,
      total_views: 8900,
      specialties: ['Sports', 'Trading Cards'],
      recent_cards: []
    }
  ];

  const trendingCollections: Collection[] = [
    {
      id: '1',
      title: 'Legendary Heroes',
      description: 'Epic characters from fantasy realms',
      owner: { username: 'ArtMaster' },
      card_count: 15,
      follower_count: 234,
      preview_cards: [],
      is_featured: true,
      category: 'Fantasy'
    },
    {
      id: '2',
      title: 'Sports Champions',
      description: 'Greatest athletes of all time',
      owner: { username: 'CardCrafter' },
      card_count: 28,
      follower_count: 189,
      preview_cards: [],
      is_featured: false,
      category: 'Sports'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover Creators & Collections</h2>
        <Button variant="outline">View All</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured Creator Spotlight */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Creator Spotlight</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CreatorSpotlight creator={featuredCreators[0]} />
              </CardContent>
            </Card>

            {/* Trending Collections Grid */}
            {trendingCollections.map((collection) => (
              <CollectionPreviewCard key={collection.id} collection={collection} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingCollections.map((collection) => (
              <CollectionPreviewCard key={collection.id} collection={collection} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Following Yet</h3>
            <p className="text-muted-foreground mb-4">
              Follow creators and collections to see their updates here
            </p>
            <Button>Discover Creators</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CreatorSpotlight = ({ creator }: { creator: Creator }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0">
      <Avatar className="w-16 h-16">
        <AvatarImage src={creator.avatar_url} />
        <AvatarFallback>{creator.username.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="text-xl font-bold">{creator.username}</h3>
        {creator.is_verified && (
          <Badge className="bg-blue-500">
            <Star className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {creator.follower_count} followers
        </div>
        <div className="flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          {creator.card_count} cards
        </div>
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {creator.total_views.toLocaleString()} views
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {creator.specialties.map((specialty) => (
          <Badge key={specialty} variant="outline" className="text-xs">
            {specialty}
          </Badge>
        ))}
      </div>
      
      {creator.featured_collection && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">Featured Collection</h4>
              <p className="text-xs text-muted-foreground">
                {creator.featured_collection.title} • {creator.featured_collection.card_count} cards
              </p>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button className="flex-1">Follow</Button>
        <Button variant="outline">View Profile</Button>
      </div>
    </div>
  </div>
);

const CreatorCard = ({ creator }: { creator: Creator }) => (
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={creator.avatar_url} />
          <AvatarFallback>{creator.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className="font-medium truncate">{creator.username}</h3>
            {creator.is_verified && (
              <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {creator.follower_count} followers
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
        <div>{creator.card_count} cards</div>
        <div>{creator.total_views.toLocaleString()} views</div>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {creator.specialties.slice(0, 2).map((specialty) => (
          <Badge key={specialty} variant="outline" className="text-xs">
            {specialty}
          </Badge>
        ))}
      </div>
      
      <Button className="w-full" size="sm">Follow</Button>
    </CardContent>
  </Card>
);

const CollectionPreviewCard = ({ collection }: { collection: Collection }) => (
  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium truncate">{collection.title}</h3>
            {collection.is_featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs">
                Featured
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {collection.description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src={collection.owner.avatar_url} />
          <AvatarFallback className="text-xs">
            {collection.owner.username.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">
          by {collection.owner.username}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center space-x-3">
          <span>{collection.card_count} cards</span>
          <div className="flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            {collection.follower_count}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {collection.category}
        </Badge>
      </div>
      
      <div className="flex space-x-2">
        <Button className="flex-1" size="sm">Follow</Button>
        <Button variant="outline" size="sm">View</Button>
      </div>
    </CardContent>
  </Card>
);

export default CreatorCollectionShowcase;
