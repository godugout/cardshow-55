
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Eye, Heart, Share2, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { mockCards } from '@/lib/mockData';
import type { CardData } from '@/hooks/useCardEditor';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showViewer, setShowViewer] = useState(false);

  const categories = ['all', 'sports', 'entertainment', 'art', 'gaming'];

  const filteredCards = useMemo(() => {
    return mockCards.filter(card => {
      const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCardClick = (card: CardData, index: number) => {
    setSelectedCard(card);
    setCurrentCardIndex(index);
    setShowViewer(true);
  };

  const handleCardChange = (card: CardData, index: number) => {
    setCurrentCardIndex(index);
    setSelectedCard(card);
  };

  const handleShare = (card: CardData) => {
    const shareUrl = `${window.location.origin}/card/${card.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    }
  };

  const handleDownload = (cards: CardData[]) => {
    if (cards.length === 0) return;
    
    const card = cards[0];
    const dataStr = JSON.stringify(card, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.title.replace(/\s+/g, '_')}_card.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Card downloaded successfully');
  };

  const handleLike = (card: CardData) => {
    toast.success(`Liked "${card.title}"`);
  };

  return (
    <div className="min-h-screen bg-crd-darkest text-white">
      {/* Header */}
      <div className="border-b border-crd-dark bg-crd-dark/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-crd-green to-crd-orange bg-clip-text text-transparent">
                Gallery
              </h1>
              <p className="text-crd-lightGray mt-2">
                Discover and explore amazing cards from our community
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80 bg-crd-dark border-crd-medium text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  selectedCategory === category
                    ? 'bg-crd-green text-black hover:bg-crd-green/90'
                    : 'border-crd-medium text-crd-lightGray hover:border-crd-green hover:text-crd-green'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredCards.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-crd-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-crd-lightGray" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No cards found</h3>
            <p className="text-crd-lightGray">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={viewMode === 'grid' 
                  ? 'group cursor-pointer'
                  : 'group cursor-pointer bg-crd-dark rounded-xl p-4 flex items-center gap-4 hover:bg-crd-medium transition-colors'
                }
                onClick={() => handleCardClick(card, index)}
              >
                {viewMode === 'grid' ? (
                  <div className="bg-crd-dark rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={card.image_url || '/placeholder-card.jpg'}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(card);
                          }}
                          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(card);
                          }}
                          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
                        <p className="text-gray-300 text-sm">Rarity: {card.rarity}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={card.image_url || '/placeholder-card.jpg'}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{card.title}</h3>
                      <p className="text-crd-lightGray text-sm mb-2">{card.description}</p>
                      <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                        <span>Rarity: {card.rarity}</span>
                        {card.category && <span>Category: {card.category}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(card);
                        }}
                        className="border-crd-medium hover:bg-crd-medium"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(card);
                        }}
                        className="border-crd-medium hover:bg-crd-medium"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Immersive Card Viewer */}
      {showViewer && selectedCard && (
        <ImmersiveCardViewer
          card={selectedCard}
          cards={filteredCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      )}
    </div>
  );
};

export default Gallery;
