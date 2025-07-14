
import React from 'react';
import { Link } from 'react-router-dom';
import { useCollections, useHotCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  ArrowRight, 
  Users, 
  Star, 
  TrendingUp,
  Grid3X3,
  Heart,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const Collections = () => {
  const { collections, isLoading: collectionsLoading, error } = useCollections();
  const { hotCollections, loading: hotLoading } = useHotCollections();
  const { featuredCards, loading: cardsLoading } = useCards();
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleCreate = async (collectionData: any) => {
    console.log('Create collection:', collectionData);
    toast.success('Collection created successfully!');
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover, Collect, <span className="text-crd-purple">Connect</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Explore an immersive world of digital cards, curate your personal collections, 
              and connect with creators and collectors from around the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections/gallery">
                <Button size="lg" className="bg-crd-purple hover:bg-crd-purple/90 text-white px-8 py-4 text-lg">
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  Explore Gallery
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowCreateModal(true)}
                className="border-crd-mediumGray text-white hover:bg-crd-mediumGray px-8 py-4 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Collection
              </Button>
            </div>
          </div>

          {/* Gallery Preview Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Featured Cards</h2>
                <p className="text-gray-400">Discover the most captivating cards from our community</p>
              </div>
              <Link to="/collections/gallery">
                <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
                  View All in Gallery
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            {cardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="bg-crd-dark border-crd-mediumGray">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] bg-crd-mediumGray animate-pulse rounded-t-lg"></div>
                      <div className="p-4">
                        <div className="h-4 bg-crd-mediumGray animate-pulse rounded mb-2"></div>
                        <div className="h-3 bg-crd-mediumGray animate-pulse rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCards.slice(0, 4).map((card, index) => (
                  <Card key={card.id || index} className="bg-crd-dark border-crd-mediumGray hover:border-crd-purple transition-colors group">
                    <CardContent className="p-0">
                      <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                        {card.image_url ? (
                          <img 
                            src={card.image_url} 
                            alt={card.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-crd-purple/20 to-crd-blue/20 flex items-center justify-center">
                            <Grid3X3 className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-1 line-clamp-1">{card.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{card.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {card.view_count || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {card.favorite_count || 0}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Your Collections Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Collections</h2>
                <p className="text-gray-400">Manage and organize your personal card collections</p>
              </div>
              <div className="flex gap-3">
                <Link to="/collections/catalog">
                  <Button variant="outline" className="border-crd-mediumGray text-white hover:bg-crd-mediumGray">
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

            {collectionsLoading ? (
              <LoadingState message="Loading your collections..." />
            ) : collections.length === 0 ? (
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Create Your First Collection</h3>
                  <p className="text-gray-400 mb-6">
                    Start organizing your cards into themed collections. Group by style, rarity, or any way you like!
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-crd-purple hover:bg-crd-purple/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections.slice(0, 8).map(collection => (
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
          </section>

          {/* Hot Collections Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  <TrendingUp className="w-8 h-8 inline mr-3 text-crd-orange" />
                  Trending Collections
                </h2>
                <p className="text-gray-400">Popular collections from the community</p>
              </div>
            </div>

            {hotLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-crd-dark border-crd-mediumGray">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-crd-mediumGray animate-pulse rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-crd-mediumGray animate-pulse rounded mb-2"></div>
                          <div className="h-3 bg-crd-mediumGray animate-pulse rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="h-32 bg-crd-mediumGray animate-pulse rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotCollections.slice(0, 3).map((collection, index) => (
                  <Card key={collection.id || index} className="bg-crd-dark border-crd-mediumGray hover:border-crd-orange transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-crd-orange/20 to-crd-purple/20 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-crd-orange" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{collection.title}</h3>
                          <p className="text-sm text-gray-400">
                            {collection.profiles?.full_name || 'Community Collection'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-crd-orange/20 text-crd-orange">
                          Hot
                        </Badge>
                      </div>
                      <div className="aspect-video bg-gradient-to-br from-crd-mediumGray/20 to-crd-mediumGray/5 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Community Activity Section */}
          <section>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Join the Community</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Connect with fellow collectors, participate in collaborative projects, 
                and discover new ways to enjoy digital card collecting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-crd-dark border-crd-mediumGray">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-crd-blue mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Group Collections</h3>
                    <p className="text-gray-400 text-sm">
                      Collaborate with friends to build shared collections
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-crd-dark border-crd-mediumGray">
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-crd-purple mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Curated Lists</h3>
                    <p className="text-gray-400 text-sm">
                      Discover expertly curated card collections
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-crd-dark border-crd-mediumGray">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-crd-green mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Community Challenges</h3>
                    <p className="text-gray-400 text-sm">
                      Participate in themed collection challenges
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

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
