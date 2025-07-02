
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAllCollections } from '@/hooks/useCollections';
import { useFrames } from '@/hooks/useFrames';
import { Loader, Image, Grid, Plus, Users, Palette, Star, Crown, Gem } from 'lucide-react';

export default function Creators() {
  const [activeTab, setActiveTab] = useState<'frames' | 'collections'>('frames');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { collections, loading: collectionsLoading } = useAllCollections();
  const { frames, trendingFrames, categories, loading: framesLoading } = useFrames(selectedCategory === 'all' ? undefined : selectedCategory);
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-4 w-4 text-orange-400" />;
      case 'epic': return <Gem className="h-4 w-4 text-purple-400" />;
      default: return <Star className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-orange-400 shadow-orange-400/20';
      case 'epic': return 'border-purple-400 shadow-purple-400/20';
      default: return 'border-blue-400 shadow-blue-400/20';
    }
  };

  const getFrameRarity = (price: number) => {
    if (price >= 20) return 'legendary';
    if (price >= 5) return 'epic';
    return 'common';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--primary-bg)' }}>
      <div className="container mx-auto py-8 px-4 space-y-8 fade-in">
        {/* Hero Section */}
        <div className="text-center py-12 px-8 rounded-2xl" style={{ background: 'var(--secondary-bg)' }}>
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Creators Hub
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover artists and collectors who create and curate cards, frames, and collections
          </p>
          <button className="crd-button-primary">
            <Plus className="mr-2 h-5 w-5" />
            Become a Creator
          </button>
        </div>
        
        {/* Creator Types Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105" 
               style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                 style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <Palette className="h-8 w-8" style={{ color: 'var(--accent-blue)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Frame Designers
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Create custom frames for the community or monetize your premium designs
            </p>
          </div>
          
          <div className="text-center p-8 rounded-2xl transition-all duration-300 hover:scale-105" 
               style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                 style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <Users className="h-8 w-8" style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Collectors & Curators
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Build collections and curate galleries featuring your favorite cards and artists
            </p>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <Tabs defaultValue="frames" value={activeTab} onValueChange={(value) => setActiveTab(value as 'frames' | 'collections')}>
          <TabsList className="w-full justify-start mb-8 p-1 rounded-xl" 
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <TabsTrigger value="frames" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <Palette className="mr-2 h-4 w-4" />
              Frames
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500">
              <Grid className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="frames" className="space-y-12">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    selectedCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {framesLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--text-secondary)' }} />
              </div>
            ) : (
              <>
                {/* Trending Frames Section */}
                {trendingFrames.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                      Trending Frames
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingFrames.map((frame) => {
                        const frameRarity = getFrameRarity(frame.price);
                        return (
                          <div key={frame.id} 
                               className={`card-item ${frameRarity} rounded-xl overflow-hidden`}
                               style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                            <div className="relative h-48 overflow-hidden">
                              {frame.preview_images && frame.preview_images.length > 0 ? (
                                <img src={frame.preview_images[0]} alt={frame.name} 
                                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center">
                                  <Palette className="h-12 w-12 text-white opacity-50" />
                                </div>
                              )}
                              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                                   style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                                {getRarityIcon(frameRarity)}
                                <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                                  {frameRarity}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                                {frame.name}
                              </h3>
                              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                {frame.description || 'Custom frame design'}
                              </p>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  By: {frame.creator_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {frame.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold" style={{ color: frame.price === 0 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                                  {frame.price === 0 ? "Free" : `$${frame.price}`}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  {frame.sales_count} uses
                                </span>
                              </div>
                              <button className="crd-button-primary w-full mt-4">
                                Use Frame
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* All Frames Section */}
                <section>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    {selectedCategory === 'all' ? 'All Frames' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Frames`}
                  </h2>
                  {frames.length === 0 ? (
                    <p className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                      No frames found in this category. Be the first to create one!
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {frames.map((frame) => {
                        const frameRarity = getFrameRarity(frame.price);
                        return (
                          <div key={frame.id} 
                               className={`card-item ${frameRarity} rounded-xl overflow-hidden`}
                               style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                            <div className="relative h-48 overflow-hidden">
                              {frame.preview_images && frame.preview_images.length > 0 ? (
                                <img src={frame.preview_images[0]} alt={frame.name} 
                                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                  <Palette className="h-12 w-12 text-white opacity-50" />
                                </div>
                              )}
                              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full"
                                   style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                                {getRarityIcon(frameRarity)}
                                <span className="text-xs font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                                  {frameRarity}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                                {frame.name}
                              </h3>
                              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                                {frame.description || 'Custom frame design'}
                              </p>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  By: {frame.creator_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {frame.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold" style={{ color: frame.price === 0 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                                  {frame.price === 0 ? "Free" : `$${frame.price}`}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                  {frame.sales_count} uses
                                </span>
                              </div>
                              <button className="crd-button-primary w-full mt-4">
                                Use Frame
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* CTA Section */}
            <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Become a CRD Frame Creator
              </h3>
              <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Ready to design and share new frames? Create your designer profile, submit to the community, 
                or set your own price for premium frames. Join our creator program to get featured and monetize your designs!
              </p>
              <button className="crd-button-primary">
                Start Designing
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-8">
            {collectionsLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin" style={{ color: 'var(--text-secondary)' }} />
              </div>
            ) : (
              <>
                <section>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                    Featured Collections
                  </h2>
                  {collections.length === 0 ? (
                    <p className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                      No collections found. Create the first one!
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                      {collections.slice(0, 6).map((collection) => (
                        <div key={collection.id} className="card-item rounded-xl overflow-hidden" 
                             style={{ aspectRatio: 'auto', background: 'var(--card-bg)' }}>
                          <div className="h-40" style={{ background: collection.cover_image_url ? `url(${collection.cover_image_url})` : 'var(--secondary-bg)' }}></div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                              {collection.title}
                            </h3>
                            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                              {collection.description || 'A curated collection of unique cards showcasing the best in digital art.'}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              Collection
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
                
                <div className="text-center p-8 rounded-2xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Create Your Own Collection
                  </h3>
                  <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Start curating your own gallery of cards. Create themed collections, collaborate with others, or showcase your personal favorites.
                  </p>
                  <button className="crd-button-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
