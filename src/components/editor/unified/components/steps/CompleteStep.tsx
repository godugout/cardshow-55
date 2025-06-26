
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CheckCircle, Eye, Share2, Plus } from 'lucide-react';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface CompleteStepProps {
  mode: CreationMode;
  cardData: CardData;
  onGoToGallery: () => void;
  onStartOver: () => void;
}

export const CompleteStep = ({ mode, cardData, onGoToGallery, onStartOver }: CompleteStepProps) => {
  const handleShare = () => {
    if (navigator.share && cardData.id) {
      navigator.share({
        title: cardData.title,
        text: `Check out my new trading card: ${cardData.title}`,
        url: `${window.location.origin}/cards/${cardData.id}`
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/cards/${cardData.id}`;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-crd-green rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-crd-white mb-2">Card Created Successfully!</h2>
        <p className="text-crd-lightGray">
          Your card "{cardData.title}" has been {cardData.is_public ? 'published' : 'saved'} to your collection.
        </p>
      </div>

      {/* Card Preview */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 max-w-sm mx-auto mb-8">
        <CardContent className="p-6">
          <div className="aspect-[3/4] bg-crd-darkest rounded-lg border border-crd-mediumGray/20 overflow-hidden mb-4">
            {cardData.image_url ? (
              <img 
                src={cardData.image_url} 
                alt={cardData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-crd-mediumGray">
                No Image
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-crd-white mb-1">{cardData.title}</h3>
          <p className="text-crd-lightGray text-sm capitalize">{cardData.rarity || 'common'} card</p>
        </CardContent>
      </Card>

      {/* Success Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-crd-green">✓</div>
          <p className="text-sm text-crd-lightGray">Created</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-crd-green">
            {cardData.is_public ? '✓' : '○'}
          </div>
          <p className="text-sm text-crd-lightGray">Published</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-crd-green">
            {cardData.marketplace_listing ? '✓' : '○'}
          </div>
          <p className="text-sm text-crd-lightGray">Listed</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CRDButton
          onClick={onGoToGallery}
          variant="primary"
          className="bg-crd-green hover:bg-crd-green/80 text-black"
        >
          <Eye className="w-4 h-4 mr-2" />
          View in Gallery
        </CRDButton>
        
        {cardData.is_public && (
          <CRDButton
            onClick={handleShare}
            variant="outline"
            className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Card
          </CRDButton>
        )}
        
        <CRDButton
          onClick={onStartOver}
          variant="outline"
          className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Another
        </CRDButton>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-crd-mediumGray/10 rounded-lg">
        <h4 className="text-crd-white font-medium mb-2">What's Next?</h4>
        <div className="text-sm text-crd-lightGray space-y-1">
          <p>• Visit your gallery to manage all your cards</p>
          <p>• Share your card with the community</p>
          <p>• Create more cards to build your collection</p>
          {cardData.marketplace_listing && <p>• Monitor your card's performance in the marketplace</p>}
        </div>
      </div>
    </div>
  );
};
