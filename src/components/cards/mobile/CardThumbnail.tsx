
import React, { useState } from 'react';
import { Card } from '@/types/card';
import { getRarityConfig } from '../config/cardRarities';
import { OptimizedImage } from '../shared/OptimizedImage';

interface CardThumbnailProps {
  card: Card;
  size?: 'xs' | 'sm' | 'md';
  onClick?: (card: Card) => void;
  showRarity?: boolean;
  showPrice?: boolean;
  className?: string;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  card,
  size = 'sm',
  onClick,
  showRarity = true,
  showPrice = false,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const rarityConfig = getRarityConfig(card.rarity);

  const sizeClasses = {
    xs: 'w-16 h-22',
    sm: 'w-20 h-28',
    md: 'w-24 h-32'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        relative rounded-lg overflow-hidden cursor-pointer 
        transform transition-all duration-200 
        hover:scale-105 active:scale-95
        ${className}
      `}
      onClick={() => onClick?.(card)}
    >
      {/* Card Image */}
      <OptimizedImage
        src={card.thumbnail_url || card.image_url || ''}
        alt={card.title}
        className="w-full h-full object-cover"
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />

      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-crd-mediumGray animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 bg-crd-lightGray rounded animate-pulse" />
        </div>
      )}

      {/* Rarity Border */}
      {showRarity && (
        <div
          className={`absolute inset-0 border-2 rounded-lg pointer-events-none ${rarityConfig.border}`}
          style={{
            boxShadow: `0 0 10px ${rarityConfig.color}40`
          }}
        />
      )}

      {/* Rarity Indicator */}
      {showRarity && (
        <div
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${rarityConfig.border}`}
          style={{ backgroundColor: rarityConfig.color }}
        />
      )}

      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
        <p className={`text-white font-medium truncate ${textSizes[size]}`}>
          {card.title}
        </p>
        {showPrice && card.price && (
          <p className={`text-crd-green font-bold ${textSizes[size]}`}>
            ${card.price}
          </p>
        )}
      </div>

      {/* Touch Feedback */}
      <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors pointer-events-none" />
    </div>
  );
};
