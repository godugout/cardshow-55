
import React, { useState } from 'react';
import { SpaceTemplateSection } from './spaces/SpaceTemplateSection';
import { SpacePreviewSection } from './spaces/SpacePreviewSection';
import { SpaceCardManagement } from './spaces/SpaceCardManagement';
import { SpaceConfigurationControls } from './spaces/SpaceConfigurationControls';
import { useSpacesState } from '../../../hooks/useSpacesState';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface EnhancedSpacesSectionProps {
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  currentCard?: CardData;
}

export const EnhancedSpacesSection: React.FC<EnhancedSpacesSectionProps> = ({
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  currentCard
}) => {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  const {
    spaceState,
    templates,
    setSelectedTemplate,
    addCard,
    removeCard,
    toggleCardSelection,
    setEditMode,
    exportConfiguration,
    resetSpace
  } = useSpacesState();

  const handleAddCurrentCard = () => {
    if (currentCard) {
      addCard(currentCard);
    }
  };

  const handleExportConfiguration = () => {
    const config = exportConfiguration();
    if (config) {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleRemoveSelectedCards = () => {
    spaceState.selectedCardIds.forEach(removeCard);
  };

  return (
    <div className="space-y-4">
      <SpaceTemplateSection
        templates={templates}
        selectedTemplate={spaceState.selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
      />

      <SpacePreviewSection
        selectedTemplate={spaceState.selectedTemplate}
        isExpanded={isPreviewExpanded}
        onToggleExpanded={() => setIsPreviewExpanded(!isPreviewExpanded)}
        spaceCards={spaceState.cards}
        effectValues={effectValues}
        selectedScene={selectedScene}
        selectedLighting={selectedLighting}
        materialSettings={materialSettings}
        overallBrightness={overallBrightness}
        interactiveLighting={interactiveLighting}
        isEditMode={spaceState.isEditMode}
        onCardSelect={toggleCardSelection}
        onCardPositionChange={() => {}}
      />

      {spaceState.selectedTemplate && isPreviewExpanded && (
        <>
          <SpaceCardManagement
            selectedTemplate={spaceState.selectedTemplate}
            spaceCards={spaceState.cards}
            selectedCardIds={spaceState.selectedCardIds}
            isEditMode={spaceState.isEditMode}
            currentCard={currentCard}
            onAddCurrentCard={handleAddCurrentCard}
            onSetEditMode={setEditMode}
            onRemoveSelectedCards={handleRemoveSelectedCards}
          />

          <SpaceConfigurationControls
            spaceCards={spaceState.cards}
            onExportConfiguration={handleExportConfiguration}
            onResetSpace={resetSpace}
          />
        </>
      )}
    </div>
  );
};
