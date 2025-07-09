
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Palette, Wand2, Sparkles, Eye } from 'lucide-react';
import { getRarityColor } from '@/utils/cardEffectUtils';
import { CreationLayout } from '../shared/CreationLayout';
import { CreationPanels } from '../shared/CreationPanels';
import { CRDDetailsSection } from '../shared/CRDDetailsSection';
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

  const leftPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Wand2 className="w-5 h-5" />
          Design Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rarity Selection */}
        <div>
          <label className="block text-crd-lightGray font-medium mb-3 text-sm">Card Rarity</label>
          <div className="grid grid-cols-1 gap-3">
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => (
              <CRDButton
                key={rarity}
                variant={cardData.rarity === rarity ? 'primary' : 'outline'}
                onClick={() => handleRarityChange(rarity)}
                className={`capitalize transition-all duration-200 hover:scale-105 ${
                  cardData.rarity === rarity 
                    ? '' 
                    : 'border-crd-mediumGray/40 text-crd-lightGray hover:text-crd-white'
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
          <label className="block text-crd-lightGray font-medium mb-3 text-sm">Visibility</label>
          <div className="space-y-2">
            {(['private', 'public', 'shared'] as const).map((visibility) => (
              <CRDButton
                key={visibility}
                variant={cardData.visibility === visibility ? 'primary' : 'outline'}
                onClick={() => handleVisibilityChange(visibility)}
                className={`w-full capitalize transition-all duration-200 ${
                  cardData.visibility === visibility 
                    ? 'bg-crd-green text-black' 
                    : 'border-crd-mediumGray/40 text-crd-lightGray hover:text-crd-white'
                }`}
              >
                {visibility}
              </CRDButton>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const centerPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1 flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="text-crd-white flex items-center gap-3 text-lg">
          <Eye className="w-5 h-5" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="flex justify-center items-center mb-6">
          <div className="aspect-[5/7] w-full max-w-md bg-crd-mediumGray/10 rounded-2xl border-2 border-crd-mediumGray/40 overflow-hidden relative shadow-2xl"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}>
            {cardData.image_url ? (
              <img 
                src={cardData.image_url} 
                alt="Card preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center text-crd-lightGray">
                <div>
                  <Palette className="w-12 h-12 mx-auto mb-2" />
                  <p>Your card will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="text-crd-white font-semibold text-base mb-1">
            {cardData.title || 'Your Card Title'}
          </h4>
          <p className="text-crd-lightGray text-sm capitalize">
            {cardData.rarity} Card • {cardData.visibility}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const rightPanel = (
    <Card className="bg-crd-darker/90 border-crd-mediumGray/40 backdrop-blur-sm flex-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-crd-white text-lg">Design Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong className="text-crd-white text-sm">Rarity Guide:</strong>
          <ul className="mt-2 space-y-2 text-xs text-crd-lightGray">
            <li className="flex items-center gap-2">
              • Common: Standard cards
              <Badge 
                className="text-xs" 
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
              • Rare: Limited items
              <Badge 
                className="text-xs" 
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
              • Legendary: Ultimate finds
              <Badge 
                className="text-xs" 
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
        
        {/* Advanced Mode Features */}
        {mode === 'advanced' && (
          <div className="space-y-3">
            <strong className="text-crd-white text-sm">Advanced Options:</strong>
            <div className="space-y-2">
              <CRDButton
                variant="outline"
                size="sm"
                className="w-full border-crd-mediumGray/40 text-crd-lightGray hover:text-crd-white"
              >
                Add Special Effects
              </CRDButton>
              <CRDButton
                variant="outline"
                size="sm"
                className="w-full border-crd-mediumGray/40 text-crd-lightGray hover:text-crd-white"
              >
                Custom Frame
              </CRDButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <CreationLayout
      title="Design Your Card"
      subtitle={mode === 'advanced' 
        ? 'Full control over your card design and appearance'
        : 'Customize the appearance and rarity of your card'
      }
      currentStep={2}
      totalSteps={4}
    >
      <CreationPanels
        leftPanel={leftPanel}
        centerPanel={centerPanel}
        rightPanel={rightPanel}
        bottomSection={<CRDDetailsSection cardData={cardData} />}
      />
    </CreationLayout>
  );
};
