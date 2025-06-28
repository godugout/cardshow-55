
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Palette, Wand2, Sparkles } from 'lucide-react';
import { getRarityColor } from '@/utils/cardEffectUtils';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface DesignStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DesignStep = ({ mode, cardData, onFieldUpdate }: DesignStepProps) => {
  console.log('🎨 DesignStep: Rendering with mode:', mode);

  const handleRarityChange = (rarity: CardData['rarity']) => {
    onFieldUpdate('rarity', rarity);
  };

  const handleVisibilityChange = (visibility: CardData['visibility']) => {
    onFieldUpdate('visibility', visibility);
  };

  const getRarityButtonStyle = (rarity: CardData['rarity']) => {
    const rarityColor = getRarityColor(rarity);
    const isSelected = cardData.rarity === rarity;
    
    if (isSelected) {
      return {
        backgroundColor: rarityColor + '20',
        borderColor: rarityColor,
        color: rarityColor,
        border: `2px solid ${rarityColor}`
      };
    }
    
    return {};
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Design Your Card</h2>
        <p className="text-crd-lightGray">
          {mode === 'advanced' 
            ? 'Full control over your card design and appearance'
            : 'Customize the appearance and rarity of your card'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Card Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Card Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[2.5/3.5] bg-crd-mediumGray/20 rounded-lg flex items-center justify-center overflow-hidden">
              {cardData.image_url ? (
                <img 
                  src={cardData.image_url} 
                  alt="Card preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center text-crd-lightGray">
                  <Palette className="w-12 h-12 mx-auto mb-2" />
                  <p>Your card will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Design Options */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Design Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rarity Selection with enhanced colors */}
            <div>
              <label className="block text-crd-white font-medium mb-3">Card Rarity</label>
              <div className="grid grid-cols-2 gap-3">
                {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
                  <CRDButton
                    key={rarity}
                    variant={cardData.rarity === rarity ? 'primary' : 'outline'}
                    onClick={() => handleRarityChange(rarity)}
                    className={`capitalize transition-all duration-200 hover:scale-105 ${
                      cardData.rarity === rarity 
                        ? '' 
                        : 'border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white'
                    }`}
                    style={getRarityButtonStyle(rarity)}
                  >
                    {rarity}
                  </CRDButton>
                ))}
              </div>
            </div>

            {/* Visibility Settings */}
            <div>
              <label className="block text-crd-white font-medium mb-3">Visibility</label>
              <div className="space-y-2">
                {(['private', 'public', 'shared'] as const).map((visibility) => (
                  <CRDButton
                    key={visibility}
                    variant={cardData.visibility === visibility ? 'primary' : 'outline'}
                    onClick={() => handleVisibilityChange(visibility)}
                    className={`w-full capitalize transition-all duration-200 ${
                      cardData.visibility === visibility 
                        ? 'bg-crd-green text-black' 
                        : 'border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white'
                    }`}
                  >
                    {visibility}
                  </CRDButton>
                ))}
              </div>
            </div>

            {/* Advanced Mode Features */}
            {mode === 'advanced' && (
              <div className="space-y-4">
                <h4 className="text-crd-white font-medium">Advanced Options</h4>
                <div className="space-y-3">
                  <CRDButton
                    variant="outline"
                    className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  >
                    Add Special Effects
                  </CRDButton>
                  <CRDButton
                    variant="outline"
                    className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  >
                    Custom Frame
                  </CRDButton>
                  <CRDButton
                    variant="outline"
                    className="w-full border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white"
                  >
                    Add Watermark
                  </CRDButton>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Design Tips with enhanced rarity badges */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 mt-8">
        <CardContent className="pt-6">
          <h4 className="text-crd-white font-medium mb-3">Design Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-crd-lightGray">
            <div>
              <strong className="text-crd-white">Rarity Guide:</strong>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  • Common: Standard everyday cards
                  <Badge 
                    className="text-xs transition-all duration-200 hover:scale-105" 
                    style={{ 
                      backgroundColor: getRarityColor('common') + '20',
                      borderColor: getRarityColor('common'),
                      color: getRarityColor('common'),
                      border: `1px solid ${getRarityColor('common')}`
                    }}
                  >
                    Common
                  </Badge>
                </li>
                <li className="flex items-center gap-2">
                  • Uncommon: Special occasion cards
                  <Badge 
                    className="text-xs transition-all duration-200 hover:scale-105" 
                    style={{ 
                      backgroundColor: getRarityColor('uncommon') + '20',
                      borderColor: getRarityColor('uncommon'),
                      color: getRarityColor('uncommon'),
                      border: `1px solid ${getRarityColor('uncommon')}`
                    }}
                  >
                    Uncommon
                  </Badge>
                </li>
                <li className="flex items-center gap-2">
                  • Rare: Limited collection items
                  <Badge 
                    className="text-xs transition-all duration-200 hover:scale-105" 
                    style={{ 
                      backgroundColor: getRarityColor('rare') + '20',
                      borderColor: getRarityColor('rare'),
                      color: getRarityColor('rare'),
                      border: `1px solid ${getRarityColor('rare')}`
                    }}
                  >
                    Rare
                  </Badge>
                </li>
                <li className="flex items-center gap-2">
                  • Epic: Powerful premium cards
                  <Badge 
                    className="text-xs transition-all duration-200 hover:scale-105" 
                    style={{ 
                      backgroundColor: getRarityColor('epic') + '20',
                      borderColor: getRarityColor('epic'),
                      color: getRarityColor('epic'),
                      border: `1px solid ${getRarityColor('epic')}`
                    }}
                  >
                    Epic
                  </Badge>
                </li>
                <li className="flex items-center gap-2">
                  • Legendary: Ultimate rare finds
                  <Badge 
                    className="text-xs transition-all duration-200 hover:scale-105" 
                    style={{ 
                      backgroundColor: getRarityColor('legendary') + '20',
                      borderColor: getRarityColor('legendary'),
                      color: getRarityColor('legendary'),
                      border: `1px solid ${getRarityColor('legendary')}`
                    }}
                  >
                    Legendary
                  </Badge>
                </li>
              </ul>
            </div>
            <div>
              <strong className="text-crd-white">Visibility Options:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Private: Only you can see it</li>
                <li>• Shared: Shared with connections</li>
                <li>• Public: Visible to everyone</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
