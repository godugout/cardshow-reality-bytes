
import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import CollectionCard from './CollectionCard';
import CreateCollectionDialog from './CreateCollectionDialog';
import type { CollectionFilters } from '@/types/collection';

const CollectionGrid = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<CollectionFilters>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { collections, isLoading, searchTerm, setSearchTerm } = useCollections(filters);

  const handleFilterChange = (newFilters: Partial<CollectionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filterOptions = [
    { key: 'all', label: 'All Collections', value: {} },
    { key: 'featured', label: 'Featured', value: { is_featured: true } },
    ...(user ? [
      { key: 'mine', label: 'My Collections', value: { user_id: user.id } }
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
          <h1 className="text-3xl font-bold text-foreground">Collections</h1>
          <p className="text-muted-foreground mt-1">
            Discover and organize amazing card collections
          </p>
        </div>
        
        {user && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Create Collection
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Label htmlFor="collections-search" className="sr-only">
            Search collections
          </Label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
          <Input
            id="collections-search"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-describedby="collections-search-help"
          />
          <div id="collections-search-help" className="sr-only">
            Search through available collections by name or description
          </div>
        </div>
        
        <div 
          className="flex gap-2 flex-wrap"
          role="group"
          aria-label="Collection filters"
        >
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              variant={
                JSON.stringify(filters) === JSON.stringify(option.value) ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleFilterChange(option.value)}
              className="border-border text-foreground hover:text-foreground hover:bg-accent"
              aria-pressed={JSON.stringify(filters) === JSON.stringify(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <Card className="bg-card border-border p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p className="text-lg">No collections found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
          {user && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-success hover:bg-success/90 text-success-foreground mt-4"
            >
              Create Your First Collection
            </Button>
          )}
        </Card>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="grid"
          aria-label="Collections grid"
        >
          {collections.map((collection, index) => (
            <div key={collection.id} role="gridcell">
              <CollectionCard 
                collection={collection}
              />
            </div>
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
