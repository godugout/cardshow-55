
import React from 'react';
import { ImmersiveCardViewer } from '@/components/viewer/ImmersiveCardViewer';
import type { CardData } from '@/hooks/useCardEditor';

// Demo card showcasing 3D effects and glowing edges
const demoCard: CardData = {
  id: 'demo-3d-card',
  title: 'Legendary Dragon Warrior',
  description: 'A mythical warrior with the power of ancient dragons. This demo card showcases the full 3D viewer experience with glowing edges and depth effects.',
  rarity: 'legendary',
  tags: ['Fantasy', 'Legendary', 'Demo'],
  image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80',
  thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80',
  design_metadata: {
    effects: {
      holographic: { intensity: 0.8 },
      chrome: { intensity: 0.6 },
      gold: { intensity: 0.7 }
    }
  },
  visibility: 'public',
  is_public: true,
  creator_attribution: {
    creator_name: 'CRD Demo Studio',
    creator_id: 'crd-demo',
    collaboration_type: 'solo'
  },
  publishing_options: {
    marketplace_listing: true,
    crd_catalog_inclusion: true,
    print_available: false,
    pricing: {
      currency: 'ETH'
    },
    distribution: {
      limited_edition: true
    }
  },
  creator_id: 'crd-demo'
};

interface DemoCardViewerProps {
  onClose?: () => void;
}

export const DemoCardViewer: React.FC<DemoCardViewerProps> = ({ onClose }) => {
  return (
    <div className="relative w-full h-full">
      {/* Demo Banner */}
      <div className="absolute top-4 left-4 z-50 bg-crd-blue/90 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-white text-sm font-medium">
          🎮 Interactive Demo - Experience 3D card effects
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-white text-sm mb-2">
          <strong>Try the 3D effects:</strong> Drag to rotate • Use studio controls to adjust effects • See glowing edges and depth
        </p>
        <p className="text-white/70 text-xs">
          This demo showcases the full card viewing experience with enhanced 3D depth and visual effects
        </p>
      </div>

      {/* Full 3D Card Viewer */}
      <ImmersiveCardViewer
        card={demoCard}
        isOpen={true}
        onClose={onClose}
        allowRotation={true}
        showStats={true}
        ambient={true}
      />
    </div>
  );
};
