
import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CollectionCard from './CollectionCard';
import CreateCollectionDialog from './CreateCollectionDialog';
import type { CollectionFilters } from '@/types/collection';

const CollectionGrid = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<CollectionFilters>({
    visibility: ['public']
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { collections, isLoading, searchTerm, setSearchTerm } = useCollections(filters);

  const handleFilterChange = (newFilters: Partial<CollectionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filterOptions = [
    { key: 'all', label: 'All Collections', value: ['public', 'shared'] },
    { key: 'public', label: 'Public', value: ['public'] },
    { key: 'featured', label: 'Featured', value: ['public'], featured: true },
    ...(user ? [
      { key: 'mine', label: 'My Collections', value: ['public', 'private', 'shared'], owner: user.id },
      { key: 'following', label: 'Following', value: ['public'], following: true }
    ] : [])
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Collections</h1>
          <p className="text-gray-400 mt-1">
            Discover and organize amazing card collections
          </p>
        </div>
        
        {user && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-[#00C851] hover:bg-[#00a844] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              variant={
                (filters.visibility?.toString() === option.value.toString() &&
                 filters.is_featured === option.featured &&
                 filters.user_id === option.owner) ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleFilterChange({
                visibility: option.value as any,
                is_featured: option.featured,
                user_id: option.owner
              })}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No collections found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
          {user && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#00C851] hover:bg-[#00a844] text-white mt-4"
            >
              Create Your First Collection
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <CollectionCard 
              key={collection.id} 
              collection={collection}
            />
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default CollectionGrid;
