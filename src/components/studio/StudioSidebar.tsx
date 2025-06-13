
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface StudioSidebarProps {
  selectedCard: CardData | null;
  onCardSelect: (card: CardData) => void;
}

// Sample cards for the sidebar
const sampleCards: CardData[] = [
  {
    id: 'sample-1',
    title: 'Cyber Knight',
    description: 'A futuristic warrior with advanced armor',
    rarity: 'ultra_rare',
    tags: ['Cyberpunk', 'Warrior'],
    image_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&q=80',
    design_metadata: {},
    visibility: 'public',
    is_public: true,
    creator_attribution: {
      creator_name: 'Studio Demo',
      creator_id: 'studio-demo',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: false,
      crd_catalog_inclusion: true,
      print_available: false,
      pricing: { currency: 'USD' },
      distribution: { limited_edition: false }
    },
    creator_id: 'studio-demo'
  }
];

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  selectedCard,
  onCardSelect
}) => {
  return (
    <div className="w-64 bg-crd-mediumGray border-r border-crd-lightGray p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-crd-blue" />
          <h2 className="text-lg font-semibold text-crd-white">Studio</h2>
        </div>
        <p className="text-sm text-crd-lightGray">
          Create and customize your trading cards with advanced 3D effects
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-crd-white mb-2">Current Demo</h3>
          <div className="bg-crd-blue/20 border border-crd-blue/40 rounded-lg p-3">
            <p className="text-sm text-crd-white">
              🎮 Interactive 3D Demo
            </p>
            <p className="text-xs text-crd-lightGray mt-1">
              Showcasing glowing edges and depth effects
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-crd-white mb-2">Sample Cards</h3>
          <div className="space-y-2">
            {sampleCards.map((card) => (
              <Card 
                key={card.id} 
                className="bg-crd-dark border-crd-lightGray cursor-pointer hover:border-crd-blue transition-colors"
                onClick={() => onCardSelect(card)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={card.thumbnail_url}
                      alt={card.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-crd-white">{card.title}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {card.rarity?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
