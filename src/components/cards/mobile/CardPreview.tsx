
import React, { useState } from 'react';
import { Heart, Share2, MoreVertical, Eye } from 'lucide-react';
import { Card } from '@/types/card';
import { getRarityConfig } from '../config/cardRarities';
import { OptimizedImage } from '../shared/OptimizedImage';
import { Button } from '@/components/ui/button';

interface CardPreviewProps {
  card: Card;
  onCardClick?: (card: Card) => void;
  onFavorite?: (card: Card) => void;
  onShare?: (card: Card) => void;
  onMoreActions?: (card: Card) => void;
  showActions?: boolean;
  className?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  onCardClick,
  onFavorite,
  onShare,
  onMoreActions,
  showActions = true,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const rarityConfig = getRarityConfig(card.rarity);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(card);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(card);
  };

  const handleMoreActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreActions?.(card);
  };

  return (
    <div
      className={`
        bg-crd-darker rounded-xl border border-crd-mediumGray/30 
        overflow-hidden cursor-pointer transform transition-all duration-200 
        hover:scale-102 active:scale-98 hover:border-crd-mediumGray/50
        ${className}
      `}
      onClick={() => onCardClick?.(card)}
    >
      {/* Card Image Container */}
      <div className="relative aspect-[2.5/3.5] bg-crd-mediumGray">
        <OptimizedImage
          src={card.image_url || card.thumbnail_url || ''}
          alt={card.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-crd-mediumGray animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-crd-lightGray rounded animate-pulse" />
          </div>
        )}

        {/* Rarity Glow Effect */}
        <div
          className={`absolute inset-0 border-2 rounded-t-xl ${rarityConfig.border} opacity-60`}
          style={{
            boxShadow: `inset 0 0 20px ${rarityConfig.color}20`
          }}
        />

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border-0 p-0"
              onClick={handleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border-0 p-0"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 text-white" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 border-0 p-0"
              onClick={handleMoreActions}
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </Button>
          </div>
        )}

        {/* Rarity Badge */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-white`}
          style={{
            backgroundColor: rarityConfig.color,
            boxShadow: `0 2px 8px ${rarityConfig.color}40`
          }}
        >
          {rarityConfig.label}
        </div>

        {/* View Count */}
        {card.view_count && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
            <Eye className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">{card.view_count}</span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm mb-1 truncate">
          {card.title}
        </h3>
        
        {card.description && (
          <p className="text-crd-lightGray text-xs line-clamp-2 mb-2">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {card.price ? (
            <span className="text-crd-green font-bold text-sm">
              ${card.price}
            </span>
          ) : (
            <span className="text-crd-lightGray text-xs">
              Not for sale
            </span>
          )}

          {card.edition_number && card.total_supply && (
            <span className="text-crd-lightGray text-xs">
              #{card.edition_number}/{card.total_supply}
            </span>
          )}
        </div>

        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-crd-mediumGray/50 text-crd-lightGray text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 2 && (
              <span className="text-crd-lightGray text-xs">
                +{card.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
