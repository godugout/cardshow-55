
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Share2, 
  Globe, 
  DollarSign, 
  Print, 
  Users,
  Star,
  Trophy,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import type { CardEditor } from '@/hooks/useCardEditor';

interface PublishingSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onPublish: () => void;
  onPrevious: () => void;
}

export const PublishingSection: React.FC<PublishingSectionProps> = ({
  cardEditor,
  onPublish,
  onPrevious
}) => {
  const [price, setPrice] = useState('');
  const [isMarketplace, setIsMarketplace] = useState(false);
  const [isPrintable, setIsPrintable] = useState(false);
  const [isCatalog, setIsCatalog] = useState(true);

  const handleVisibilityChange = (visibility: 'private' | 'public' | 'shared') => {
    cardEditor.updateCardField('visibility', visibility);
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
    cardEditor.updateCardField('publishing_options', {
      ...cardEditor.cardData.publishing_options,
      pricing: {
        ...cardEditor.cardData.publishing_options.pricing,
        base_price: newPrice ? parseFloat(newPrice) : undefined
      }
    });
  };

  const handleMarketplaceToggle = (enabled: boolean) => {
    setIsMarketplace(enabled);
    cardEditor.updateCardField('publishing_options', {
      ...cardEditor.cardData.publishing_options,
      marketplace_listing: enabled
    });
  };

  const handlePrintToggle = (enabled: boolean) => {
    setIsPrintable(enabled);
    cardEditor.updateCardField('publishing_options', {
      ...cardEditor.cardData.publishing_options,
      print_available: enabled
    });
  };

  const handleCatalogToggle = (enabled: boolean) => {
    setIsCatalog(enabled);
    cardEditor.updateCardField('publishing_options', {
      ...cardEditor.cardData.publishing_options,
      crd_catalog_inclusion: enabled
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-crd-white">Publish Your Card</h3>
        <p className="text-crd-lightGray">Configure sharing settings and publish to the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Publishing Options */}
        <div className="space-y-6">
          {/* Visibility Settings */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Visibility & Privacy
              </h4>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleVisibilityChange('public')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    cardEditor.cardData.visibility === 'public'
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-crd-green" />
                    <div>
                      <div className="font-medium text-crd-white">Public</div>
                      <div className="text-sm text-crd-lightGray">Visible to everyone in the community</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleVisibilityChange('shared')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    cardEditor.cardData.visibility === 'shared'
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-crd-blue" />
                    <div>
                      <div className="font-medium text-crd-white">Shared</div>
                      <div className="text-sm text-crd-lightGray">Only people with the link can view</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleVisibilityChange('private')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    cardEditor.cardData.visibility === 'private'
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded bg-crd-mediumGray" />
                    <div>
                      <div className="font-medium text-crd-white">Private</div>
                      <div className="text-sm text-crd-lightGray">Only visible to you</div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Settings */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Marketplace & Monetization
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white font-medium">List on Marketplace</Label>
                    <p className="text-sm text-crd-lightGray">Make your card available for purchase</p>
                  </div>
                  <Switch
                    checked={isMarketplace}
                    onCheckedChange={handleMarketplaceToggle}
                  />
                </div>
                
                {isMarketplace && (
                  <div>
                    <Label htmlFor="price" className="text-crd-white">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      placeholder="0.00"
                      className="bg-crd-darkGray border-crd-mediumGray/30 text-crd-white"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-crd-mediumGray mt-1">
                      Platform fee: 5% • You receive: ${price ? (parseFloat(price) * 0.95).toFixed(2) : '0.00'}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white font-medium">Print Available</Label>
                    <p className="text-sm text-crd-lightGray">Allow physical printing of this card</p>
                  </div>
                  <Switch
                    checked={isPrintable}
                    onCheckedChange={handlePrintToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white font-medium">Include in CRD Catalog</Label>
                    <p className="text-sm text-crd-lightGray">Feature in official CRD collections</p>
                  </div>
                  <Switch
                    checked={isCatalog}
                    onCheckedChange={handleCatalogToggle}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Benefits */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Publishing Benefits
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-crd-green/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-crd-green" />
                  </div>
                  <div>
                    <div className="text-crd-white font-medium">Community Recognition</div>
                    <div className="text-sm text-crd-lightGray">Get featured in trending cards</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-crd-blue/20 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-crd-blue" />
                  </div>
                  <div>
                    <div className="text-crd-white font-medium">Creator Portfolio</div>
                    <div className="text-sm text-crd-lightGray">Build your artist profile</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-crd-orange/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-crd-orange" />
                  </div>
                  <div>
                    <div className="text-crd-white font-medium">Community Feedback</div>
                    <div className="text-sm text-crd-lightGray">Receive comments and likes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Final Preview & Summary */}
        <div className="space-y-6">
          {/* Final Card Preview */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4">Final Preview</h4>
              
              <div className="aspect-[5/7] rounded-lg overflow-hidden bg-crd-darkGray border border-crd-mediumGray/30 mb-4">
                {cardEditor.cardData.image_url ? (
                  <img 
                    src={cardEditor.cardData.image_url} 
                    alt="Final card preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-crd-mediumGray/20 rounded mx-auto mb-2" />
                      <p className="text-crd-mediumGray text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-bold text-crd-white text-lg">{cardEditor.cardData.title}</h5>
                  <Badge className={`mt-1 ${
                    cardEditor.cardData.rarity === 'legendary' ? 'bg-orange-500/20 text-orange-300' :
                    cardEditor.cardData.rarity === 'ultra-rare' ? 'bg-purple-500/20 text-purple-300' :
                    cardEditor.cardData.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {cardEditor.cardData.rarity}
                  </Badge>
                </div>
                
                {cardEditor.cardData.description && (
                  <p className="text-crd-lightGray text-sm">{cardEditor.cardData.description}</p>
                )}
                
                {cardEditor.cardData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cardEditor.cardData.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {cardEditor.cardData.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cardEditor.cardData.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Publishing Summary */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-crd-white mb-4">Publishing Summary</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Visibility:</span>
                  <span className="text-crd-white capitalize">{cardEditor.cardData.visibility}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Marketplace:</span>
                  <span className="text-crd-white">{isMarketplace ? 'Listed' : 'Not listed'}</span>
                </div>
                
                {isMarketplace && price && (
                  <div className="flex justify-between">
                    <span className="text-crd-lightGray">Price:</span>
                    <span className="text-crd-white">${price} USD</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">Print Available:</span>
                  <span className="text-crd-white">{isPrintable ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-crd-lightGray">CRD Catalog:</span>
                  <span className="text-crd-white">{isCatalog ? 'Included' : 'Not included'}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-crd-green/10 rounded-lg border border-crd-green/20">
                <p className="text-crd-green text-sm">
                  ✓ Your card is ready to publish! It will appear in your gallery and be discoverable by the community.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <CRDButton variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </CRDButton>
        
        <div className="text-sm text-crd-lightGray">
          Step 5 of 5 - Ready to publish your masterpiece!
        </div>
        
        <CRDButton onClick={onPublish} className="min-w-[140px] bg-crd-green hover:bg-crd-green/90">
          <Share2 className="w-4 h-4 mr-2" />
          Publish Card
        </CRDButton>
      </div>
    </div>
  );
};
