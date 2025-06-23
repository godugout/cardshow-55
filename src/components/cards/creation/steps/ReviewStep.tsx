
import React from 'react';
import { Card } from '@/types/card';
import { OptimizedImage } from '../../shared/OptimizedImage';
import { getRarityConfig } from '../../config/cardRarities';
import { Badge } from '@/components/ui/badge';

interface ReviewStepProps {
  cardData: Partial<Card>;
  onUpdate: (updates: Partial<Card>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  cardData,
  onUpdate,
  onValidationChange
}) => {
  const rarityConfig = getRarityConfig(cardData.rarity || 'common');

  React.useEffect(() => {
    const isValid = Boolean(
      cardData.title && 
      cardData.image_url && 
      cardData.template_id
    );
    onValidationChange(isValid);
  }, [cardData, onValidationChange]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Review Your Card</h2>
        <p className="text-crd-lightGray">
          Review all details before creating your card
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Preview */}
        <div className="flex justify-center">
          <div 
            className="w-80 bg-crd-mediumGray rounded-xl overflow-hidden border-2"
            style={{ 
              borderColor: rarityConfig.color,
              boxShadow: `0 0 20px ${rarityConfig.color}40`
            }}
          >
            {cardData.image_url ? (
              <OptimizedImage
                src={cardData.image_url}
                alt={cardData.title || 'Card preview'}
                className="w-full aspect-[2.5/3.5]"
              />
            ) : (
              <div className="w-full aspect-[2.5/3.5] bg-crd-darkGray flex items-center justify-center">
                <p className="text-crd-lightGray">No image uploaded</p>
              </div>
            )}
            
            {cardData.title && (
              <div className="p-4 bg-crd-darker">
                <h3 className="text-white font-bold text-lg mb-2">{cardData.title}</h3>
                {cardData.description && (
                  <p className="text-crd-lightGray text-sm mb-2">{cardData.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge 
                    style={{ backgroundColor: rarityConfig.color }}
                    className="text-white"
                  >
                    {rarityConfig.label}
                  </Badge>
                  {cardData.edition_size && (
                    <span className="text-crd-lightGray text-sm">
                      Edition: {cardData.edition_size}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          <div className="bg-crd-mediumGray/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Card Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Title:</span>
                <span className="text-white">{cardData.title || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Type:</span>
                <span className="text-white">{cardData.card_type || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Rarity:</span>
                <span className="text-white">{rarityConfig.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-crd-lightGray">Template:</span>
                <span className="text-white">{cardData.template_id || 'Not selected'}</span>
              </div>
              {cardData.edition_size && (
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Edition Size:</span>
                  <span className="text-white">{cardData.edition_size}</span>
                </div>
              )}
            </div>
          </div>

          {cardData.description && (
            <div className="bg-crd-mediumGray/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Description</h4>
              <p className="text-crd-lightGray text-sm">{cardData.description}</p>
            </div>
          )}

          {cardData.tags && cardData.tags.length > 0 && (
            <div className="bg-crd-mediumGray/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {cardData.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-crd-green/20 text-crd-green"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
