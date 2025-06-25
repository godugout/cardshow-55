
import React, { useState } from 'react';
import { AdvancedCardPreview } from '@/components/platform/AdvancedCardPreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CardData } from '@/hooks/useCardEditor';

// Sample cards for the viewer gallery
const sampleCards: CardData[] = [
  {
    id: 'viewer-dragon',
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
    id: 'viewer-phoenix',
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
    id: 'viewer-sprite',
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

const ViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(sampleCards[0]);
  const [showGallery, setShowGallery] = useState(false);

  const handleCardSelect = (card: CardData) => {
    setSelectedCard(card);
    setShowGallery(false);
  };

  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">3D Card Viewer</h1>
          <p className="text-gray-400 mb-6">Select a card to view in the immersive 3D experience</p>
          <Button
            onClick={() => setShowGallery(true)}
            className="bg-crd-green hover:bg-crd-green/80 text-black"
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Choose Card
          </Button>
        </div>
      </div>
    );
  }

  if (showGallery) {
    return (
      <div className="min-h-screen bg-crd-darkest p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Choose a Card</h1>
            <Button
              onClick={() => setShowGallery(false)}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Viewer
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className="bg-crd-darker border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-crd-green transition-colors"
              >
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{card.description}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  card.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                  card.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {card.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:text-white bg-black/50 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          onClick={() => setShowGallery(true)}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:text-white bg-black/50 backdrop-blur-sm"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Gallery
        </Button>
      </div>

      {/* Card Title */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/50 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-2">
          <h2 className="text-white font-semibold">{selectedCard.title}</h2>
          <p className="text-gray-400 text-sm">{selectedCard.rarity}</p>
        </div>
      </div>

      {/* Immersive 3D Viewer */}
      <AdvancedCardPreview
        card={selectedCard}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default ViewerPage;
