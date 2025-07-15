
import React from 'react';

export interface Hero3Props {
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
      <div className="flex gap-4 animate-scroll-right">
        {/* Duplicate the cards array to create seamless loop */}
        {[...featuredCards, ...featuredCards].map((card, index) => {
          // Create variety in card shapes and sizes
          const shapeVariants = [
            // Square cards
            { width: "w-48 md:w-56 lg:w-64", aspect: "aspect-square" },
            { width: "w-52 md:w-60 lg:w-72", aspect: "aspect-square" },
            // Wide rectangles
            { width: "w-56 md:w-64 lg:w-80", aspect: "aspect-[4/3]" },
            { width: "w-60 md:w-72 lg:w-84", aspect: "aspect-[5/4]" },
            // Tall rectangles
            { width: "w-44 md:w-52 lg:w-60", aspect: "aspect-[3/4]" },
            { width: "w-48 md:w-56 lg:w-68", aspect: "aspect-[2/3]" },
          ];
          
          const variant = shapeVariants[index % shapeVariants.length];
          
          return (
            <div 
              key={`${card.id}-${index}`}
              className={`flex-shrink-0 ${variant.width} cursor-pointer hover:scale-105 transition-transform duration-300`}
              onClick={() => onCardClick(card)}
            >
              <div className="bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20 h-full">
                <div className={`${variant.aspect} relative`}>
                  {card.image_url || card.thumbnail_url ? (
                    <img 
                      src={card.image_url || card.thumbnail_url} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                      <div className="text-3xl opacity-50">🎨</div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-crd-white font-semibold truncate text-sm">{card.title}</h3>
                  <p className="text-crd-lightGray text-xs mt-1">
                    {card.rarity ? `${card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)} Card` : 'Digital Card'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
