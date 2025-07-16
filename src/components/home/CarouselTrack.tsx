import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { usePerformanceMarks } from '@/hooks/usePerformanceMarks';

interface Card {
  id: string;
  title: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: string;
  creator_id?: string;
}

interface CardItemProps {
  card: Card;
}

const CardItem = memo(({ card }: CardItemProps) => {
  const imageUrl = card.image_url || card.thumbnail_url || '/placeholder.svg';
  
  return (
    <Link 
      to={`/card/${card.id}`}
      className="carousel-card flex-shrink-0 relative group cursor-pointer"
    >
      <div className="w-48 h-64 bg-crd-darker rounded-lg border border-crd-darkGray/20 overflow-hidden hover:border-crd-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-crd-blue/20">
        {/* Card Image */}
        <div className="w-full h-48 bg-crd-dark flex items-center justify-center overflow-hidden">
          <img 
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        {/* Card Info */}
        <div className="p-3 h-16 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-crd-white truncate">
            {card.title}
          </h3>
          {card.rarity && (
            <p className="text-xs text-crd-mediumGray mt-1">
              {card.rarity}
            </p>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-crd-blue/0 group-hover:bg-crd-blue/10 transition-all duration-300 rounded-lg" />
      </div>
    </Link>
  );
});

CardItem.displayName = 'CardItem';

interface CarouselTrackProps {
  cards: Card[];
}

// Use CSS-only animation with GPU acceleration
export const CarouselTrack = memo(({ cards }: CarouselTrackProps) => {
  // Performance monitoring in development
  usePerformanceMarks('CarouselTrack');

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {/* Double the cards for seamless loop */}
        {[...cards, ...cards].map((card, i) => (
          <CardItem key={`${card.id}-${i}`} card={card} />
        ))}
      </div>
    </div>
  );
});

CarouselTrack.displayName = 'CarouselTrack';