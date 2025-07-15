
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
  shouldStartAnimation?: boolean;
}

export const Hero3: React.FC<Hero3Props> = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {},
  shouldStartAnimation = false
}) => {
  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Horizontal scrolling carousel with larger cards */}
      <div className={`flex gap-6 ${shouldStartAnimation ? 'animate-scroll-right' : ''}`}>
        {/* Duplicate the cards array to create seamless loop */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-64 md:w-80 lg:w-96 cursor-pointer group"
            onClick={() => onCardClick(card)}
          >
            <div className="relative bg-crd-dark rounded-xl overflow-hidden shadow-lg border border-crd-mediumGray/20 transition-transform duration-300 group-hover:scale-105">
              {/* Card Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                {card.image_url || card.thumbnail_url ? (
                  <img 
                    src={card.image_url || card.thumbnail_url} 
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                    <div className="text-4xl opacity-50">🎨</div>
                  </div>
                )}
                
                {/* Hover Details Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1 truncate">{card.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-crd-lightGray">Creator: {card.creator_name || 'Unknown'}</p>
                        {card.curator && (
                          <p className="text-crd-lightGray">Curated by: {card.curator}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {card.rarity && (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            card.rarity === 'legendary' ? 'bg-crd-orange text-black' :
                            card.rarity === 'rare' ? 'bg-crd-purple text-white' :
                            card.rarity === 'uncommon' ? 'bg-crd-blue text-white' :
                            'bg-crd-mediumGray text-white'
                          }`}>
                            {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                          </span>
                        )}
                        {card.view_count && (
                          <p className="text-crd-lightGray mt-1">{card.view_count} views</p>
                        )}
                        {card.price && (
                          <p className="text-crd-green font-bold mt-1">${card.price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
