
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Globe } from 'lucide-react';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface PublishStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const PublishStep = ({ mode, cardData, onFieldUpdate }: PublishStepProps) => {
  const handleVisibilityChange = (isPublic: boolean) => {
    onFieldUpdate('visibility', isPublic ? 'public' : 'private');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Publish Your Card</h2>
        <p className="text-crd-lightGray">
          Set visibility and sharing options for your new card
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Summary */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white">Card Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[3/4] max-w-48 mx-auto bg-crd-darkest rounded-lg border border-crd-mediumGray/20 overflow-hidden">
              {cardData.image_url ? (
                <img 
                  src={cardData.image_url} 
                  alt="Card preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crd-mediumGray">
                  No Image
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-crd-white">{cardData.title || 'Untitled Card'}</h3>
              {cardData.description && (
                <p className="text-crd-lightGray text-sm">{cardData.description}</p>
              )}
              <div className="flex justify-center">
                <Badge variant="outline" className="capitalize">
                  {cardData.rarity || 'common'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <div className="space-y-6">
          {/* Visibility Settings */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cardData.visibility === 'public' ? (
                    <Eye className="w-5 h-5 text-crd-green" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-crd-mediumGray" />
                  )}
                  <div>
                    <Label className="text-crd-white">Public Card</Label>
                    <p className="text-sm text-crd-lightGray">
                      {cardData.visibility === 'public'
                        ? 'Visible to everyone in the gallery'
                        : 'Only visible to you'
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cardData.visibility === 'public'}
                  onCheckedChange={handleVisibilityChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Publishing Info */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                Publishing Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-crd-lightGray">
                  <span>Visibility:</span>
                  <span className="text-crd-white capitalize">
                    {cardData.visibility || 'Private'}
                  </span>
                </div>
                <div className="flex justify-between text-crd-lightGray">
                  <span>Rarity:</span>
                  <span className="text-crd-white capitalize">{cardData.rarity || 'Common'}</span>
                </div>
                {cardData.tags && cardData.tags.length > 0 && (
                  <div className="flex justify-between text-crd-lightGray">
                    <span>Tags:</span>
                    <span className="text-crd-white">
                      {cardData.tags.length} tag{cardData.tags.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
