
import React from 'react';
import { CollapsibleSection } from '@/components/ui/design-system';
import { SpaceTemplateSelector } from '../../spaces/SpaceTemplateSelector';
import { SpaceCanvas } from '../../spaces/SpaceCanvas';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Download, Upload, RotateCcw } from 'lucide-react';
import { useSpacesState } from '../../../hooks/useSpacesState';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../../types';
import type { CardData } from '@/hooks/useCardEditor';

interface SpacesSectionProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  effectValues: EffectValues;
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  currentCard?: CardData;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({
  isOpen,
  onToggle,
  effectValues,
  selectedScene,
  selectedLighting,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  currentCard
}) => {
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

  const getStatusText = () => {
    if (!spaceState.selectedTemplate) return 'No template selected';
    const cardCount = spaceState.cards.length;
    const maxCards = spaceState.selectedTemplate.maxCards;
    return `${cardCount}/${maxCards} cards`;
  };

  return (
    <CollapsibleSection
      title="Spaces"
      emoji="🌌"
      statusText={getStatusText()}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <h4 className="text-white font-medium text-sm mb-3">Environment Templates</h4>
          <SpaceTemplateSelector
            templates={templates}
            selectedTemplate={spaceState.selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />
        </div>

        {/* Space Canvas */}
        {spaceState.selectedTemplate && (
          <div>
            <h4 className="text-white font-medium text-sm mb-3">3D Space Preview</h4>
            <SpaceCanvas
              spaceCards={spaceState.cards}
              template={spaceState.selectedTemplate}
              effectValues={effectValues}
              selectedScene={selectedScene}
              selectedLighting={selectedLighting}
              materialSettings={materialSettings}
              overallBrightness={overallBrightness}
              interactiveLighting={interactiveLighting}
              isEditMode={spaceState.isEditMode}
              onCardSelect={toggleCardSelection}
              onCardPositionChange={() => {}} // TODO: Implement in Phase 2
            />
          </div>
        )}

        {/* Card Management Controls */}
        {spaceState.selectedTemplate && (
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Card Management</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleAddCurrentCard}
                disabled={!currentCard || spaceState.cards.length >= spaceState.selectedTemplate.maxCards}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Current</span>
              </Button>
              
              <Button
                onClick={() => setEditMode(!spaceState.isEditMode)}
                variant="outline"
                size="sm"
                className={`flex items-center space-x-1 text-xs ${
                  spaceState.isEditMode ? 'bg-crd-green/20 text-crd-green' : ''
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        )}

        {/* Selected Cards Info */}
        {spaceState.selectedCardIds.length > 0 && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-2">
              {spaceState.selectedCardIds.length} card(s) selected
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => spaceState.selectedCardIds.forEach(removeCard)}
                variant="outline"
                size="sm"
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
              <Button
                onClick={() => {}} // TODO: Group operations in Phase 2
                variant="outline"
                size="sm"
                className="text-xs"
                disabled
              >
                Group
              </Button>
            </div>
          </div>
        )}

        {/* Import/Export Controls */}
        {spaceState.selectedTemplate && spaceState.cards.length > 0 && (
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Configuration</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleExportConfiguration}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-xs"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </Button>
              
              <Button
                onClick={() => {}} // TODO: Import functionality
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-xs"
                disabled
              >
                <Upload className="w-3 h-3" />
                <span>Import</span>
              </Button>
              
              <Button
                onClick={resetSpace}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 text-xs text-yellow-400 hover:text-yellow-300"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};
