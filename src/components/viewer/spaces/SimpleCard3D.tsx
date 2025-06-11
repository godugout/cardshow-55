
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

export const SimpleCard3D: React.FC<SimpleCard3DProps> = ({ card, isFlipped }) => {
  if (isFlipped) {
    // Card back - enhanced design to match trading card aesthetic
    return (
      <div 
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl transform-gpu border border-gray-600"
        style={{ 
          width: CARD_WIDTH, 
          height: CARD_HEIGHT,
          transform: 'rotateY(180deg)',
          pointerEvents: 'none' // No interaction on HTML elements
        }}
      >
        {/* Main logo area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              CRD
            </div>
            <div className="text-sm opacity-70 font-medium">Trading Card</div>
            <div className="text-xs opacity-50 mt-2">Digital Collection</div>
          </div>
        </div>
        
        {/* Decorative border pattern */}
        <div className="absolute inset-4 border border-gray-500 rounded-xl opacity-30"></div>
        
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-gray-400 opacity-50"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-gray-400 opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-gray-400 opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-gray-400 opacity-50"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>
      </div>
    );
  }

  // Card front - matching the 2D CardPreview exactly, no interactions
  return (
    <div 
      className="relative bg-[#353945] rounded-2xl overflow-hidden transform-gpu"
      style={{ 
        width: CARD_WIDTH, 
        height: CARD_HEIGHT,
        pointerEvents: 'none' // No interaction on HTML elements
      }}
    >
      {/* Tags - matching CardPreview positioning */}
      <div className="absolute top-6 left-6 flex gap-2 z-10">
        {card.tags && card.tags.length > 0 && (
          <span className="px-2 py-2 text-xs font-raleway font-semibold uppercase bg-white text-[#23262F] rounded">
            {card.tags[0]}
          </span>
        )}
        <span className={`px-2 py-2 text-xs font-raleway font-semibold uppercase rounded ${getRarityColor(card.rarity)}`}>
          {card.rarity || 'Common'}
        </span>
      </div>

      {/* Card Image - matching CardPreview */}
      {card.image_url ? (
        <img
          src={card.image_url}
          alt={card.title}
          className="absolute w-full h-full object-cover"
          style={{ 
            borderRadius: "1rem",
            pointerEvents: 'none' // No interaction on images
          }}
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

      {/* Title overlay - matching CardPreview but without action buttons */}
      <div className="absolute bottom-8 left-[40px] right-6">
        <h3 className="text-white font-bold text-lg truncate">
          {card.title}
        </h3>
      </div>

      {/* Removed hover effect overlay since it's handled by the 3D system */}
    </div>
  );
};
