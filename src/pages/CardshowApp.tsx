import React, { useState, useCallback } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { mockCards } from '@/data/mockCards';
import { CardGrid } from '@/components/cardshow/CardGrid';
import { AdvancedCardItem } from '@/components/cardshow/AdvancedCardItem';
import { CardDetailModal } from '@/components/cardshow/CardDetailModal';
import { Card } from '@/types/cardshow';

export const CardshowApp: React.FC = () => {
  const [cards] = useState(mockCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleFavorite = useCallback((cardId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(cardId)) {
        newFavorites.delete(cardId);
      } else {
        newFavorites.add(cardId);
      }
      return newFavorites;
    });
  }, []);

  const handleTrade = useCallback((cardId: string) => {
    console.log('Trade card:', cardId);
    // Navigate to trade page with pre-selected card
  }, []);

  const handleShare = useCallback((cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card && navigator.share) {
      navigator.share({
        title: card.name,
        text: `Check out this ${card.rarity} ${card.type} card!`,
        url: window.location.href
      });
    }
  }, [cards]);

  const handleCompare = useCallback((card: Card) => {
    console.log('Compare card:', card);
    // Implement comparison feature
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-700 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d2d2d] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00C851] touch-target"
            />
          </div>
          <button className="bg-[#2d2d2d] border border-gray-600 rounded-lg p-3 text-gray-400 hover:text-white transition-colors touch-target">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 overflow-x-auto">
            {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors touch-target ${
                  selectedRarity === rarity
                    ? 'bg-[#00C851] text-black'
                    : 'bg-[#2d2d2d] text-gray-400 hover:text-white'
                }`}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors touch-target ${
                viewMode === 'grid' ? 'bg-[#00C851] text-black' : 'bg-[#2d2d2d] text-gray-400'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors touch-target ${
                viewMode === 'list' ? 'bg-[#00C851] text-black' : 'bg-[#2d2d2d] text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Card Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <AdvancedCardItem
              key={card.id}
              card={{ ...card, favorite: favorites.has(card.id) }}
              onView={setSelectedCard}
              onFavorite={handleFavorite}
              onTrade={handleTrade}
              onShare={handleShare}
              onCompare={handleCompare}
            />
          ))}
        </div>
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onFavorite={handleFavorite}
        onTrade={handleTrade}
        onShare={handleShare}
      />
    </div>
  );
};
