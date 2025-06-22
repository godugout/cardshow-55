
import React, { useState, useCallback, useEffect } from 'react';
import { CardGrid } from '@/components/cardshow/CardGrid';
import { CardDetailModal } from '@/components/cardshow/CardDetailModal';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { Card } from '@/types/cardshow';
import { mockCards } from '@/data/mockCards';
import { RefreshCw, Search, Filter } from 'lucide-react';

export const CardshowApp: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCards([...mockCards]);
    setLoading(false);
  }, []);

  const handleCardSelect = useCallback((card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  }, []);

  const handleCardFavorite = useCallback((cardId: string) => {
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, favorite: !card.favorite }
          : card
      )
    );
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  }, []);

  const handleShare = useCallback((card: Card) => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `Check out this ${card.rarity} ${card.type} card!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(`${card.name} - ${window.location.href}`);
    }
  }, []);

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1a1a1a]/95 backdrop-blur-lg border-b border-gray-700">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-white">Cardshow</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="ml-auto p-2 text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d2d2d] text-white pl-10 pr-12 py-3 rounded-lg border border-gray-600 focus:border-[#00C851] focus:outline-none transition-colors"
            />
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                filterOpen ? 'bg-[#00C851] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Filter options */}
          {filterOpen && (
            <div className="mt-3 p-3 bg-[#2d2d2d] rounded-lg border border-gray-600">
              <p className="text-gray-300 text-sm font-medium mb-2">Filter by rarity:</p>
              <div className="flex flex-wrap gap-2">
                {['all', 'common', 'rare', 'epic', 'legendary'].map((rarity) => (
                  <button
                    key={rarity}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full hover:bg-gray-500 transition-colors capitalize"
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card grid with pull-to-refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <CardGrid
          cards={filteredCards}
          onCardSelect={handleCardSelect}
          onCardFavorite={handleCardFavorite}
          loading={loading}
        />
      </PullToRefresh>

      {/* Card detail modal */}
      <CardDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onFavorite={handleCardFavorite}
        onShare={handleShare}
      />
    </div>
  );
};
