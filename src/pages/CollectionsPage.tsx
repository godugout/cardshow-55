
import React, { useState } from 'react';
import { Plus, Grid, List, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';

// Mock collections data matching the Collection type
const mockCollections = [
  {
    id: '1',
    title: 'Sports Legends', // Changed from 'name' to 'title'
    description: 'A collection of legendary sports cards',
    cardCount: 25,
    coverImageUrl: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
    visibility: 'public' as const, // Added visibility
    createdAt: '2024-01-15T00:00:00Z', // Added createdAt as string
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Fantasy Collection', // Changed from 'name' to 'title'
    description: 'Mystical creatures and fantasy cards',
    cardCount: 18,
    coverImageUrl: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    visibility: 'private' as const, // Added visibility
    createdAt: '2024-01-10T00:00:00Z', // Added createdAt as string
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Rare Finds', // Changed from 'name' to 'title'
    description: 'Ultra-rare and special edition cards',
    cardCount: 7,
    coverImageUrl: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    visibility: 'public' as const, // Added visibility
    createdAt: '2024-01-05T00:00:00Z', // Added createdAt as string
    updatedAt: new Date('2024-01-05')
  }
];

export const CollectionsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCollections = mockCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-crd-green hover:bg-crd-green/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-darker border-crd-mediumGray/20 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-crd-mediumGray/20"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <div className="flex bg-crd-darker rounded-lg p-1 border border-crd-mediumGray/20">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-crd-green' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-crd-green' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        {filteredCollections.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={(collection) => console.log('Edit:', collection)}
                onDelete={(id) => console.log('Delete:', id)}
                onView={(collection) => console.log('View:', collection)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-crd-lightGray text-lg mb-4">
              {searchQuery ? 'No collections found matching your search.' : 'You haven\'t created any collections yet.'}
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-crd-green hover:bg-crd-green/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Collection
            </Button>
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(collectionData) => {
          console.log('Creating collection:', collectionData);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};
