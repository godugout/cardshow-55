
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Palette, Sparkles, Frame, Layers } from 'lucide-react';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface DesignStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const DesignStep = ({ mode, cardData, onFieldUpdate }: DesignStepProps) => {
  const handleTemplateSelect = (templateId: string) => {
    onFieldUpdate('template_id', templateId);
  };

  const handleEffectToggle = (effect: string) => {
    const currentMetadata = cardData.design_metadata as any || {};
    const currentEffects = currentMetadata.effects || [];
    
    const updatedEffects = currentEffects.includes(effect)
      ? currentEffects.filter((e: string) => e !== effect)
      : [...currentEffects, effect];
    
    onFieldUpdate('design_metadata', {
      ...currentMetadata,
      effects: updatedEffects
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Design Your Card</h2>
        <p className="text-crd-lightGray">
          Customize the visual appearance and effects for your card
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Frame className="w-5 h-5" />
              Card Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[3/4] bg-crd-darkest rounded-lg border border-crd-mediumGray/20 overflow-hidden">
              {cardData.image_url ? (
                <img 
                  src={cardData.image_url} 
                  alt="Card preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-crd-mediumGray">
                  <Frame className="w-12 h-12" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Design Options */}
        <div className="space-y-6">
          {/* Templates */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Card Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['classic', 'modern', 'vintage', 'minimal'].map((template) => (
                  <CRDButton
                    key={template}
                    variant={cardData.template_id === template ? 'primary' : 'outline'}
                    onClick={() => handleTemplateSelect(template)}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    <span className="text-xs capitalize">{template}</span>
                  </CRDButton>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Effects */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'holographic', name: 'Holographic Foil', description: 'Shimmering rainbow effect' },
                  { id: 'metallic', name: 'Metallic Finish', description: 'Chrome-like reflection' },
                  { id: 'glow', name: 'Edge Glow', description: 'Glowing border effect' },
                  { id: 'particles', name: 'Particle Effects', description: 'Floating sparkles' }
                ].map((effect) => {
                  const currentEffects = (cardData.design_metadata as any)?.effects || [];
                  const isActive = currentEffects.includes(effect.id);
                  
                  return (
                    <div key={effect.id} className="flex items-center justify-between p-3 bg-crd-darkest rounded-lg">
                      <div>
                        <h4 className="text-crd-white font-medium">{effect.name}</h4>
                        <p className="text-crd-lightGray text-sm">{effect.description}</p>
                      </div>
                      <CRDButton
                        variant={isActive ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleEffectToggle(effect.id)}
                      >
                        {isActive ? 'Remove' : 'Add'}
                      </CRDButton>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
