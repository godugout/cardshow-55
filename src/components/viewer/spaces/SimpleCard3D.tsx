
import React from 'react';

interface SimpleCard3DProps {
  card: {
    id: string;
    title: string;
    image_url?: string;
    rarity?: string;
    tags?: string[];
  };
  isFlipped: boolean;
  onFlip: () => void;
}

// Card dimensions optimized for 3D viewing
const CARD_WIDTH = 240;
const CARD_HEIGHT = 336;

const getRarityColor = (rarity: string = 'common') => {
  switch (rarity.toLowerCase()) {
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    case 'rare':
      return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
    case 'uncommon':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    case 'common':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const SimpleCard3D: React.FC<SimpleCard3DProps> = ({ card, isFlipped, onFlip }) => {
  if (isFlipped) {
    // Card back - simple design
    return (
      <div 
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl cursor-pointer transform-gpu"
        style={{ 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT,
          transform: 'rotateY(180deg)'
        }}
        onClick={onFlip}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-2xl font-bold mb-2">CRD</div>
            <div className="text-sm opacity-70">Trading Card</div>
          </div>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Card front - based on CardPreview style
  return (
    <div 
      className="relative bg-[#353945] rounded-2xl overflow-hidden cursor-pointer transform-gpu"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      onClick={onFlip}
    >
      {/* Tags */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {card.tags && card.tags.length > 0 && (
          <span className="px-2 py-1 text-xs font-semibold uppercase bg-white text-[#23262F] rounded">
            {card.tags[0]}
          </span>
        )}
        <span className={`px-2 py-1 text-xs font-semibold uppercase rounded ${getRarityColor(card.rarity)}`}>
          {card.rarity || 'Common'}
        </span>
      </div>

      {/* Card Image */}
      {card.image_url ? (
        <img
          src={card.image_url}
          alt={card.title}
          className="absolute w-full h-full object-cover"
          style={{ borderRadius: "1rem" }}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-lg font-bold">{card.title}</div>
            <div className="text-sm opacity-70 mt-2">No Image</div>
          </div>
        </div>
      )}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3">
        <h3 className="text-white font-bold text-sm truncate">
          {card.title}
        </h3>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
    </div>
  );
};
