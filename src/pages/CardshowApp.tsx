
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CardshowLayout } from '@/components/cardshow/CardshowLayout';
import { CardshowMarketplace } from './CardshowMarketplace';
import { CardshowTrade } from './CardshowTrade';
import CardshowAdvanced from './CardshowAdvanced';
import { CardGrid } from '@/components/cardshow/CardGrid';
import { CardDetailModal } from '@/components/cardshow/CardDetailModal';
import { MobileCreationStudio } from '@/components/cardshow/creation/MobileCreationStudio';
import type { CardData } from '@/hooks/useCardEditor';
import type { Card } from '@/types/cardshow';

// Mock card data that matches CardData interface
const mockCards: CardData[] = [
  {
    id: '1',
    title: 'Lightning Dragon',
    description: 'A legendary dragon with the power of thunder',
    image_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
    rarity: 'legendary',
    tags: ['legendary', 'dragon', 'fantasy'],
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Demo Creator',
      creator_id: 'demo-creator-1'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false
    },
    design_metadata: {
      effects: {
        holographic: true,
        chrome: false,
        foil: false,
        intensity: 0.8
      }
    }
  },
  {
    id: '2',
    title: 'Ice Phoenix',
    description: 'A mystical bird of ice and snow',
    image_url: '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    rarity: 'rare',
    tags: ['rare', 'phoenix', 'ice'],
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Demo Creator',
      creator_id: 'demo-creator-1'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false
    },
    design_metadata: {
      effects: {
        holographic: false,
        chrome: true,
        foil: false,
        intensity: 0.6
      }
    }
  },
  {
    id: '3',
    title: 'Fire Sprite',
    description: 'A small but fierce fire elemental',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    rarity: 'common',
    tags: ['common', 'sprite', 'fire'],
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Demo Creator',
      creator_id: 'demo-creator-1'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: false
    },
    design_metadata: {
      effects: {
        holographic: false,
        chrome: false,
        foil: true,
        intensity: 0.4
      }
    }
  }
];

export const CardshowApp: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Convert CardData to Card for modal and grid components
  const convertToCard = (cardData: CardData): Card => ({
    id: cardData.id || '',
    name: cardData.title,
    image: cardData.image_url || '/placeholder-card.jpg',
    rarity: cardData.rarity as Card['rarity'],
    type: 'creature',
    description: cardData.description
  });

  // Convert CardData array to Card array
  const convertedCards: Card[] = mockCards.map(convertToCard);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCardTrade = (card: Card) => {
    console.log('Trading card:', card.name);
  };

  const handleCardShare = (card: Card) => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `Check out this amazing card: ${card.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out ${card.name}!`);
    }
  };

  return (
    <CardshowLayout>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CardGrid
                cards={convertedCards}
                onCardSelect={handleCardSelect}
                onCardTrade={handleCardTrade}
                onCardShare={handleCardShare}
              />
              
              <CardDetailModal
                card={selectedCard}
                isOpen={!!selectedCard}
                onClose={() => setSelectedCard(null)}
                onTrade={(card) => console.log('Trading:', card.name)}
                onShare={(card) => handleCardShare(card)}
              />
            </>
          }
        />
        
        <Route path="/marketplace" element={<CardshowMarketplace />} />
        <Route path="/trade" element={<CardshowTrade />} />
        <Route path="/create" element={<MobileCreationStudio />} />
        <Route path="/advanced" element={<CardshowAdvanced />} />
        
        <Route
          path="/profile"
          element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
              <p className="text-gray-400">Profile features coming soon!</p>
            </div>
          }
        />
        
        <Route path="*" element={<Navigate to="/cardshow" replace />} />
      </Routes>
    </CardshowLayout>
  );
};
