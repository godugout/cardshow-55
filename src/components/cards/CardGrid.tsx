import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { CardData } from '@/types/card';

interface CardGridProps {
  cards: CardData[];
  loading: boolean;
  viewMode: 'grid' | 'masonry' | 'feed';
  onCardClick?: (cardId: string) => void;
}

const CardGridItem = ({ card, index, onCardClick }: { card: CardData; index: number; onCardClick?: (cardId: string) => void }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const getDisplayImage = () => {
    // Check for valid image URLs, avoiding blob URLs
    if (card.image_url && !card.image_url.startsWith('blob:') && !imageError) {
      return card.image_url;
    }
    if (card.thumbnail_url && !card.thumbnail_url.startsWith('blob:') && !imageError) {
      return card.thumbnail_url;
    }
    // Use placeholder image
    return '/placeholder.svg';
  };

  const displayImage = getDisplayImage();

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(card.id);
    }
  };

  // Format price for display
  const formatPrice = (price?: number) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return '1.5'; // Default fallback
  };

  return (
    <Card 
      className="group bg-crd-dark border-crd-mediumGray hover:border-crd-blue transition-all duration-300 overflow-hidden cursor-pointer" 
      onClick={handleClick}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-crd-mediumGray">
        {imageLoading && (
          <Skeleton className="absolute inset-0 bg-crd-mediumGray" />
        )}
        <img
          src={displayImage}
          alt={card.title || 'Card'}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
            {formatPrice(card.price)} ETH
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-crd-white font-semibold mb-1 line-clamp-1">{card.title || 'Untitled Card'}</h3>
        <p className="text-crd-lightGray text-sm line-clamp-2">{card.description || 'Digital collectible card'}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-crd-lightGray">3 in stock</span>
          <span className="text-xs text-crd-orange">0.001 ETH bid</span>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <Skeleton className="aspect-[3/4] rounded-t-lg bg-crd-mediumGray" />
    <div className="bg-crd-dark p-4 rounded-b-lg space-y-2">
      <Skeleton className="h-4 bg-crd-mediumGray rounded" />
      <Skeleton className="h-3 bg-crd-mediumGray rounded w-2/3" />
      <div className="flex justify-between mt-3">
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-16" />
        <Skeleton className="h-3 bg-crd-mediumGray rounded w-20" />
      </div>
    </div>
  </div>
);

export const CardGrid: React.FC<CardGridProps> = ({ cards, loading, viewMode, onCardClick }) => {
  if (loading) {
    return (
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          : viewMode === 'masonry'
          ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
          : 'space-y-6'
      }>
        {Array(8).fill(0).map((_, i) => (
          <LoadingSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-crd-lightGray mb-4">No cards found</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
        : viewMode === 'masonry'
        ? 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
        : 'space-y-6'
    }>
      {cards.map((card, index) => (
        <CardGridItem key={`card-${card.id}-${index}`} card={card} index={index} onCardClick={onCardClick} />
      ))}
    </div>
  );
};
