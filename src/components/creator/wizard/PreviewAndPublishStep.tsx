
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Globe, Lock, Share2, Download, Sparkles } from 'lucide-react';
import type { CardData, DesignTemplate } from '@/hooks/useCardEditor';

interface PreviewAndPublishStepProps {
  cardData: CardData;
  selectedTemplate: DesignTemplate | null;
  uploadedPhoto: string | null;
  visualEffects: {
    holographic: boolean;
    chrome: boolean;
    foil: boolean;
    intensity: number;
  };
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const PreviewAndPublishStep = ({ 
  cardData, 
  selectedTemplate, 
  uploadedPhoto, 
  visualEffects,
  onFieldUpdate 
}: PreviewAndPublishStepProps) => {
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      'ultra-rare': 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getEffectsList = () => {
    const effects = [];
    if (visualEffects.holographic) effects.push('Holographic');
    if (visualEffects.chrome) effects.push('Chrome');
    if (visualEffects.foil) effects.push('Rainbow Foil');
    return effects;
  };

  const handleVisibilityChange = (isPublic: boolean) => {
    onFieldUpdate('visibility', isPublic ? 'public' : 'private');
  };

  const handleMarketplaceToggle = (enabled: boolean) => {
    onFieldUpdate('publishing_options', {
      ...cardData.publishing_options,
      marketplace_listing: enabled
    });
  };

  const handlePrintToggle = (enabled: boolean) => {
    onFieldUpdate('publishing_options', {
      ...cardData.publishing_options,
      print_available: enabled
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Preview & Publish</h2>
        <p className="text-crd-lightGray">
          Review your card and choose how to share it with the world
        </p>
      </div>

      {/* Card Preview */}
      <div className="bg-crd-mediumGray/20 rounded-lg p-6 border border-crd-mediumGray/30">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Card Preview
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview Card */}
          <div className="flex justify-center">
            <div className="w-64 aspect-[5/7] bg-gradient-to-br from-crd-mediumGray to-crd-darkGray rounded-lg border border-crd-mediumGray/50 p-4 relative overflow-hidden">
              {uploadedPhoto && (
                <img
                  src={uploadedPhoto}
                  alt="Card preview"
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg truncate">
                  {cardData.title || 'Card Title'}
                </h4>
                
                {selectedTemplate && (
                  <p className="text-crd-lightGray text-sm">
                    {selectedTemplate.name}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge className={`${getRarityColor(cardData.rarity)} text-white text-xs`}>
                    {cardData.rarity?.toUpperCase()}
                  </Badge>
                  
                  {getEffectsList().length > 0 && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-crd-green" />
                      <span className="text-xs text-crd-green">
                        {getEffectsList().length} Effect{getEffectsList().length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Effect overlay simulation */}
              {getEffectsList().length > 0 && (
                <div className="absolute inset-0 pointer-events-none rounded-lg">
                  <div className={`absolute inset-0 opacity-20 rounded-lg ${
                    visualEffects.holographic ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500' :
                    visualEffects.chrome ? 'bg-gradient-to-br from-gray-300 to-gray-600' :
                    visualEffects.foil ? 'bg-gradient-to-br from-yellow-400 to-purple-600' : ''
                  }`} />
                </div>
              )}
            </div>
          </div>
          
          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <Label className="text-white font-medium">Title</Label>
              <p className="text-crd-lightGray">{cardData.title || 'Not set'}</p>
            </div>
            
            <div>
              <Label className="text-white font-medium">Template</Label>
              <p className="text-crd-lightGray">{selectedTemplate?.name || 'Not selected'}</p>
            </div>
            
            <div>
              <Label className="text-white font-medium">Rarity</Label>
              <p className="text-crd-lightGray capitalize">{cardData.rarity}</p>
            </div>
            
            <div>
              <Label className="text-white font-medium">Visual Effects</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {getEffectsList().length > 0 ? (
                  getEffectsList().map((effect) => (
                    <Badge key={effect} variant="secondary" className="bg-crd-green/20 text-crd-green text-xs">
                      {effect}
                    </Badge>
                  ))
                ) : (
                  <p className="text-crd-lightGray text-sm">None</p>
                )}
              </div>
            </div>
            
            {cardData.description && (
              <div>
                <Label className="text-white font-medium">Description</Label>
                <p className="text-crd-lightGray text-sm">{cardData.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publishing Options */}
      <div className="bg-crd-mediumGray/20 rounded-lg p-6 border border-crd-mediumGray/30">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Publishing Options
        </h3>
        
        <div className="space-y-4">
          {/* Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {cardData.visibility === 'public' ? (
                <Globe className="w-5 h-5 text-crd-green" />
              ) : (
                <Lock className="w-5 h-5 text-crd-lightGray" />
              )}
              <div>
                <Label className="text-white font-medium">Public Visibility</Label>
                <p className="text-crd-lightGray text-sm">
                  Make your card discoverable by other users
                </p>
              </div>
            </div>
            <Switch
              checked={cardData.visibility === 'public'}
              onCheckedChange={handleVisibilityChange}
            />
          </div>
          
          {/* Marketplace */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Marketplace Listing</Label>
              <p className="text-crd-lightGray text-sm">
                Allow others to trade or purchase this card
              </p>
            </div>
            <Switch
              checked={cardData.publishing_options?.marketplace_listing || false}
              onCheckedChange={handleMarketplaceToggle}
            />
          </div>
          
          {/* Print Option */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white font-medium">Print Available</Label>
              <p className="text-crd-lightGray text-sm">
                Allow users to order physical prints of this card
              </p>
            </div>
            <Switch
              checked={cardData.publishing_options?.print_available || false}
              onCheckedChange={handlePrintToggle}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Preview
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Link
        </Button>
      </div>
    </div>
  );
};
