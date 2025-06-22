
import React, { useState } from 'react';
import { AdvancedCardPreview } from '@/components/platform/AdvancedCardPreview';
import type { CardData } from '@/hooks/useCardEditor';

// Mock card data for demonstration
const mockCard: CardData = {
  id: 'advanced-demo',
  title: 'Lightning Dragon',
  description: 'A legendary dragon card with stunning holographic effects',
  image_url: '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
  rarity: 'legendary',
  tags: ['legendary', 'dragon', 'fantasy'],
  visibility: 'public',
  creator_attribution: 'Demo Creator',
  publishing_options: {
    allow_downloads: true,
    allow_prints: false,
    license_type: 'standard'
  },
  design_metadata: {
    effects: {
      holographic: true,
      chrome: false,
      foil: false,
      intensity: 0.8
    }
  }
};

export const CardshowAdvanced: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);
  
  if (!showPreview) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-[#00C851] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00a844] transition-colors"
        >
          Open Advanced Features Demo
        </button>
      </div>
    );
  }
  
  return (
    <AdvancedCardPreview
      card={mockCard}
      onClose={() => setShowPreview(false)}
    />
  );
};
