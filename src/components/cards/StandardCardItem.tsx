
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Lock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/integrations/supabase/types';

type DbCard = Tables<'cards'>;

interface StandardCardItemProps {
  card: DbCard;
  onView3D?: (card: DbCard) => void;
  showPrivacyBadge?: boolean;
  className?: string;
}

export const StandardCardItem: React.FC<StandardCardItemProps> = ({
  card,
  onView3D,
  showPrivacyBadge = true,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleThumbnailClick = () => {
    if (onView3D) {
      onView3D(card);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/card/${card.id}`);
  };

  const isPrivate = card.visibility === 'private' || !card.is_public;
  const displayImage = card.thumbnail_url || card.image_url || 
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-600';
      case 'epic': return 'bg-purple-600';
      case 'rare': return 'bg-blue-600';
      case 'uncommon': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className={`group bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-all duration-300 overflow-hidden cursor-pointer ${className}`}>
      {/* Thumbnail - Click for 3D Viewer */}
      <div 
        className="aspect-[3/4] relative overflow-hidden bg-crd-mediumGray"
        onClick={handleThumbnailClick}
      >
        <img
          src={displayImage}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="text-white text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">View in 3D</p>
          </div>
        </div>

        {/* Privacy Badge */}
        {showPrivacyBadge && isPrivate && (
          <Badge className="absolute top-2 left-2 bg-red-600/90 text-white">
            <Lock className="w-3 h-3 mr-1" />
            Private
          </Badge>
        )}

        {/* Rarity Badge */}
        {card.rarity && (
          <Badge className={`absolute top-2 right-2 ${getRarityColor(card.rarity)} text-white`}>
            {card.rarity}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Description */}
          <div>
            <h3 className="text-crd-white font-semibold text-lg line-clamp-1 group-hover:text-crd-green transition-colors">
              {card.title}
            </h3>
            {card.description && (
              <p className="text-crd-lightGray text-sm line-clamp-2 mt-1">
                {card.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{card.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleThumbnailClick}
              variant="outline"
              size="sm"
              className="flex-1 border-crd-mediumGray text-crd-lightGray hover:bg-crd-green hover:text-black hover:border-crd-green transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View 3D
            </Button>
            <Button
              onClick={handleViewDetails}
              variant="outline"
              size="sm"
              className="flex-1 border-crd-mediumGray text-crd-lightGray hover:bg-crd-blue hover:text-white hover:border-crd-blue transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>

          {/* Card Info */}
          <div className="flex items-center justify-between text-xs text-crd-lightGray pt-2 border-t border-crd-mediumGray">
            <span>
              {new Date(card.created_at).toLocaleDateString()}
            </span>
            {card.series && (
              <span className="text-crd-orange">
                {card.series}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
