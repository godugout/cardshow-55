
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, Image } from 'lucide-react';
import { CardRepository } from '@/repositories/cardRepository';
import type { Card as CardType } from '@/types/card';

interface BulkRecropSelectorProps {
  onCardsSelected: (cards: CardType[]) => void;
  onBack: () => void;
}

export const BulkRecropSelector = ({ onCardsSelected, onBack }: BulkRecropSelectorProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserCards();
  }, []);

  const loadUserCards = async () => {
    try {
      setIsLoading(true);
      const userCards = await CardRepository.getUserCards();
      setCards(userCards || []);
    } catch (error) {
      console.error('Failed to load user cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCards.size === filteredCards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredCards.map(card => card.id)));
    }
  };

  const handleProceed = () => {
    const selectedCardObjects = cards.filter(card => selectedCards.has(card.id));
    onCardsSelected(selectedCardObjects);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading your cards...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Select Cards to Re-crop</h2>
        <Button onClick={onBack} variant="outline" className="text-white border-crd-mediumGray">
          Back
        </Button>
      </div>

      {/* Search and controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
          <Input
            placeholder="Search your cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-crd-darker border-crd-mediumGray text-white"
          />
        </div>
        <Button
          onClick={handleSelectAll}
          variant="outline"
          className="text-white border-crd-mediumGray"
        >
          {selectedCards.size === filteredCards.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between bg-crd-darker rounded-lg p-4">
        <span className="text-white">
          {selectedCards.size} of {filteredCards.length} cards selected
        </span>
        <Button
          onClick={handleProceed}
          disabled={selectedCards.size === 0}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Image className="w-4 h-4 mr-2" />
          Re-crop {selectedCards.size} Cards
        </Button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            className="bg-crd-darker border-crd-mediumGray/20 overflow-hidden cursor-pointer hover:border-crd-green/50 transition-colors"
            onClick={() => toggleCardSelection(card.id)}
          >
            <div className="relative">
              <img
                src={card.image_url || card.thumbnail_url || '/placeholder.svg'}
                alt={card.title}
                className="w-full aspect-[3/4] object-cover"
              />
              
              {/* Selection overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Checkbox
                  checked={selectedCards.has(card.id)}
                  onChange={() => toggleCardSelection(card.id)}
                  className="w-6 h-6"
                />
              </div>

              {/* Selection indicator */}
              {selectedCards.has(card.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
                  <span className="text-black text-sm font-bold">✓</span>
                </div>
              )}
            </div>
            
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate">
                {card.title}
              </p>
              <p className="text-crd-lightGray text-xs truncate">
                {card.description || 'No description'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">
            {searchTerm ? 'No cards found matching your search.' : 'You have no cards to re-crop.'}
          </p>
        </div>
      )}
    </div>
  );
};
