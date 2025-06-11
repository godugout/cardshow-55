
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardContentOverlayProps {
  card: CardData;
}

export const CardContentOverlay: React.FC<CardContentOverlayProps> = ({ card }) => {
  return (
    <div className="absolute inset-0 p-6 flex flex-col z-40" style={{ pointerEvents: 'none' }}>
      <div className="mt-auto">
        <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-lg p-3 text-white">
          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
          {card.description && (
            <p className="text-sm mb-1">{card.description}</p>
          )}
          {card.rarity && (
            <p className="text-xs uppercase tracking-wide opacity-75">{card.rarity}</p>
          )}
        </div>
      </div>
    </div>
  );
};
