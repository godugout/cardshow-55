import React from 'react';
import type { CardData } from '@/types/card';

interface BaseCardProps {
  card: CardData;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Clean, virgin card component with NO effects, animations, or interactions
 * This is the pure base that all other layers build upon
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  card,
  className = "",
  style = {},
  children
}) => {
  return (
    <div 
      className={`relative bg-white rounded-lg overflow-hidden shadow-lg ${className}`}
      style={{
        width: '300px',
        height: '420px',
        ...style
      }}
    >
      {/* Pure card image - no effects, optimized loading */}
      <div className="absolute inset-0">
        <img
          src={card.image_url || '/placeholder.svg'}
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder.svg') {
              target.src = '/placeholder.svg';
            }
          }}
        />
      </div>
      
      {/* Card title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white font-bold text-lg truncate">
          {card.title}
        </h3>
        {card.description && (
          <p className="text-gray-200 text-sm truncate">
            {card.description}
          </p>
        )}
      </div>
      
      {/* Children for layered content */}
      {children}
    </div>
  );
};