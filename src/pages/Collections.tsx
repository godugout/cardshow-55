
import React from 'react';
import { Link } from 'react-router-dom';
import { useCollections } from '@/hooks/useCollections';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { EnhancedSearch } from '@/components/common/EnhancedSearch';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';
import { Button } from '@/components/ui/button';
import { Plus, Grid, Search } from 'lucide-react';
import { toast } from 'sonner';

const Collections = () => {
  const { collections, isLoading, error } = useCollections();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEdit = (collection: any) => {
    console.log('Edit collection:', collection);
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = (collectionId: string) => {
    console.log('Delete collection:', collectionId);
    toast.info('Delete functionality coming soon');
  };

  const handleView = (collection: any) => {
    console.log('View collection:', collection);
    toast.info('View functionality coming soon');
  };

  const handleCreate = async (collectionData: any) => {
    console.log('Create collection:', collectionData);
    toast.success('Collection created successfully!');
  };

  const filteredCollections = collections?.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return <LoadingState message="Loading collections..." fullPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Failed to load collections</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Collections</h1>
              <p className="text-gray-400 mt-2">Organize and manage your card collections</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/collections/catalog">
                <Button
                  variant="outline"
                  className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Catalog
                </Button>
              </Link>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-crd-purple hover:bg-crd-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Collection
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <EnhancedSearch
              placeholder="Search collections..."
              onSearch={handleSearch}
              className="max-w-md"
            />
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No collections found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
              </p>
              {!searchQuery && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-crd-purple hover:bg-crd-purple/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                  <Link to="/collections/catalog">
                    <Button
                      variant="outline"
                      className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
                    >
                      <Grid className="w-4 h-4 mr-2" />
                      Browse Catalog
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCollections.map(collection => (
                <CollectionCard 
                  key={collection.id} 
                  collection={collection}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}

          {/* Create Collection Modal */}
          <CreateCollectionModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreate}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Collections;
