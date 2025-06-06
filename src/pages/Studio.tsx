import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { CardData } from '@/hooks/useCardEditor';

// Mock card data - in a real app, this would come from an API
const mockCards: CardData[] = [
  {
    id: 'card-1',
    title: 'Legendary Dragon',
    description: 'A powerful ancient dragon with mystical powers',
    rarity: 'legendary',
    image_url: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
    template_id: 'premium',
    tags: ['dragon', 'legendary', 'fire'],
    design_metadata: {
      effects: {
        holographic: 70,
        gold: 50,
        chrome: 30
      }
    },
    visibility: 'public',
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: { currency: 'USD', base_price: 25 },
      distribution: { limited_edition: true, edition_size: 100 }
    }
  },
  {
    id: 'card-2',
    title: 'Mystic Warrior',
    description: 'A brave warrior wielding ancient magic',
    rarity: 'rare',
    image_url: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
    template_id: 'neon',
    tags: ['warrior', 'magic', 'rare'],
    design_metadata: {
      effects: {
        holographic: 40,
        refractor: 60,
        prizm: 30
      }
    },
    visibility: 'public',
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    }
  },
  {
    id: 'card-3',
    title: 'Forest Guardian',
    description: 'Ancient protector of the enchanted forest',
    rarity: 'uncommon',
    image_url: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
    template_id: 'vintage',
    tags: ['nature', 'guardian', 'forest'],
    design_metadata: {
      effects: {
        vintage: 80,
        brushedmetal: 20
      }
    },
    visibility: 'public',
    creator_attribution: {
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: { currency: 'USD', base_price: 15 },
      distribution: { limited_edition: false }
    }
  }
];

const Studio = () => {
  const { cardId, presetId } = useParams<{ cardId?: string; presetId?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load card data based on URL params
  useEffect(() => {
    const loadCard = async () => {
      setIsLoading(true);
      
      if (cardId) {
        // Find the specific card
        const card = mockCards.find(c => c.id === cardId);
        if (card) {
          setSelectedCard(card);
          const index = mockCards.findIndex(c => c.id === cardId);
          setCurrentCardIndex(index);
        } else {
          toast.error('Card not found');
          navigate('/studio');
          return;
        }
      } else {
        // Default to first card if no ID specified
        setSelectedCard(mockCards[0]);
        setCurrentCardIndex(0);
      }
      
      setIsLoading(false);
    };

    loadCard();
  }, [cardId, navigate]);

  // Handle card navigation
  const handleCardChange = (index: number) => {
    const newCard = mockCards[index];
    if (newCard) {
      setSelectedCard(newCard);
      setCurrentCardIndex(index);
      
      // Update URL without preset if we're changing cards
      navigate(`/studio/${newCard.id}`, { replace: true });
    }
  };

  // Handle sharing - generates shareable URL
  const handleShare = (card: CardData) => {
    const shareUrl = `${window.location.origin}/studio/${card.id}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Studio link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'));
    } else {
      toast.error('Sharing not supported in this browser');
    }
  };

  // Handle download/export
  const handleDownload = () => {
    if (selectedCard) {
      toast.success(`Exporting ${selectedCard.title}...`);
    }
  };

  // Handle closing studio
  const handleClose = () => {
    navigate('/gallery');
  };

  if (isLoading) {
    return <LoadingState message="Loading studio..." fullPage />;
  }

  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No card selected</h2>
          <p className="text-gray-400 mb-6">Choose a card to view in the studio</p>
          <Button onClick={() => navigate('/gallery')} className="bg-crd-purple hover:bg-crd-purple/90">
            Browse Cards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        {/* Studio Header */}
        <div className="absolute top-4 left-4 z-50">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/10 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cards/create')}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/10 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Card
            </Button>
          </div>
        </div>

        {/* Immersive Card Viewer */}
        <ImmersiveCardViewer
          card={selectedCard}
          cards={mockCards}
          currentCardIndex={currentCardIndex}
          onCardChange={handleCardChange}
          isOpen={true}
          onClose={handleClose}
          onShare={handleShare}
          onDownload={handleDownload}
          allowRotation={true}
          showStats={true}
          ambient={true}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Studio;
