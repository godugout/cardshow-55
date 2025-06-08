
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Enhanced3DSpaceCanvas } from '../../../spaces/Enhanced3DSpaceCanvas';
import type { SpaceTemplate, SpaceCard } from '../../../../types/spaces';
import type { EffectValues } from '../../../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../../types';

interface SpacePreviewSectionProps {
  selectedTemplate: SpaceTemplate | null;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  spaceCards: SpaceCard[];
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  isEditMode: boolean;
  onCardSelect: (spaceCardId: string, multiSelect?: boolean) => void;
  onCardPositionChange: () => void;
}

export const SpacePreviewSection: React.FC<SpacePreviewSectionProps> = ({
  selectedTemplate,
  isExpanded,
  onToggleExpanded,
  spaceCards,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  isEditMode,
  onCardSelect,
  onCardPositionChange
}) => {
  const getStatusText = () => {
    if (!selectedTemplate) return 'No template selected';
    const cardCount = spaceCards.length;
    const maxCards = selectedTemplate.maxCards;
    return `${cardCount}/${maxCards} cards`;
  };

  if (!selectedTemplate) return null;

  return (
    <div className="space-y-4">
      {/* Preview Toggle */}
      <div>
        <Button
          onClick={onToggleExpanded}
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-between text-white border-white/20 hover:border-white/40"
        >
          <span>3D Preview ({getStatusText()})</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Collapsible 3D Preview */}
      {isExpanded && (
        <Enhanced3DSpaceCanvas
          spaceCards={spaceCards}
          template={selectedTemplate}
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={selectedLighting}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          isEditMode={isEditMode}
          onCardSelect={onCardSelect}
          onCardPositionChange={onCardPositionChange}
        />
      )}
    </div>
  );
};
