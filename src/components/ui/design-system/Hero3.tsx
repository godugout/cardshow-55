
import React from 'react';

interface Hero3Props {
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
}

export const Hero3: React.FC<Hero3Props> = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {} 
}) => {
  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Horizontal scrolling carousel with larger cards */}
      <div className="flex gap-6 animate-scroll-right">
        {/* Duplicate the cards array to create seamless loop */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-[432px] cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => onCardClick(card)}
          >
            <div className="bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20">
              <div className="aspect-[3/4] relative">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-crd-white font-semibold truncate">{card.title}</h3>
                <p className="text-crd-lightGray text-sm mt-1">
                  {card.rarity ? `${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)} Card` : 'Digital Card'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
