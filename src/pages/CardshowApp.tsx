
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CardshowLayout } from '@/components/cardshow/CardshowLayout';
import { CardshowMarketplace } from './CardshowMarketplace';
import { CardshowTrade } from './CardshowTrade';
import { CardshowAdvanced } from './CardshowAdvanced';
import { CardGrid } from '@/components/cardshow/CardGrid';
import { CardDetailModal } from '@/components/cardshow/CardDetailModal';
import { MobileCreationStudio } from '@/components/cardshow/creation/MobileCreationStudio';
import type { CardData } from '@/hooks/useCardEditor';

// Mock card data
const mockCards = [
  {
    id: '1',
    title: 'Lightning Dragon',
    description: 'A legendary dragon with the power of thunder',
    image_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
    rarity: 'Legendary',
    design_metadata: {
      effects: {
        holographic: true,
        chrome: false,
        foil: false,
        intensity: 0.8
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Ice Phoenix',
    description: 'A mystical bird of ice and snow',
    image_url: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    rarity: 'Rare',
    design_metadata: {
      effects: {
        holographic: false,
        chrome: true,
        foil: false,
        intensity: 0.6
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Fire Sprite',
    description: 'A small but fierce fire elemental',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    rarity: 'Common',
    design_metadata: {
      effects: {
        holographic: false,
        chrome: false,
        foil: true,
        intensity: 0.4
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
] as CardData[];

interface Card {
  id: string;
  title: string;
  image: string;
  rarity: string;
  price?: number;
  description?: string;
}

export const CardshowApp: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCreationStudio, setShowCreationStudio] = useState(false);

  // Convert CardData to Card for modal
  const convertToCard = (cardData: CardData): Card => ({
    id: cardData.id,
    title: cardData.title,
    image: cardData.image_url || '/placeholder-card.jpg',
    rarity: cardData.rarity || 'Common',
    description: cardData.description
  });

  const handleCardSelect = (card: CardData) => {
    setSelectedCard(convertToCard(card));
  };

  const handleCardTrade = (card: CardData) => {
    console.log('Trading card:', card.title);
    // Implement trading logic
  };

  const handleCardShare = (card: CardData) => {
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: `Check out this amazing card: ${card.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out ${card.title}!`);
    }
  };

  return (
    <CardshowLayout>
      <Routes>
        {/* Main Cards View */}
        <Route
          path="/"
          element={
            <>
              <CardGrid
                cards={mockCards}
                onCardSelect={handleCardSelect}
                onCardTrade={handleCardTrade}
                onCardShare={handleCardShare}
              />
              
              {selectedCard && (
                <CardDetailModal
                  card={selectedCard}
                  onClose={() => setSelectedCard(null)}
                  onTrade={(card) => console.log('Trading:', card.title)}
                  onShare={(card) => handleCardShare(mockCards.find(c => c.id === card.id)!)}
                />
              )}
            </>
          }
        />
        
        {/* Marketplace */}
        <Route path="/marketplace" element={<CardshowMarketplace />} />
        
        {/* Trading */}
        <Route path="/trade" element={<CardshowTrade />} />
        
        {/* Card Creation */}
        <Route
          path="/create"
          element={
            <MobileCreationStudio
              onClose={() => setShowCreationStudio(false)}
              onSave={(cardData) => {
                console.log('Card created:', cardData);
                setShowCreationStudio(false);
              }}
            />
          }
        />
        
        {/* Advanced Features Demo */}
        <Route path="/advanced" element={<CardshowAdvanced />} />
        
        {/* Profile (placeholder) */}
        <Route
          path="/profile"
          element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
              <p className="text-gray-400">Profile features coming soon!</p>
            </div>
          }
        />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/cardshow" replace />} />
      </Routes>
    </CardshowLayout>
  );
};
