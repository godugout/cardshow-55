
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Map, FrameIcon, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpacesTab } from './tabs/SpacesTab';
import { FramesTab } from './tabs/FramesTab';
import { AdvancedStudioTab } from './tabs/AdvancedStudioTab';
import { LightingSection } from '../LightingSection';
import { CollapsibleSection } from '@/components/ui/design-system';
import { SpaceTemplateSelector } from '../spaces/SpaceTemplateSelector';
import { EnvironmentControls } from '../EnvironmentControls';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { SpaceState, SpaceTemplate } from '../../types/spaces';

interface TabbedStudioContentProps {
  selectedScene: EnvironmentScene;
  selectedLighting: LightingPreset;
  effectValues: EffectValues;
  overallBrightness: number[];
  interactiveLighting: boolean;
  materialSettings: MaterialSettings;
  onSceneChange: (scene: EnvironmentScene) => void;
  onLightingChange: (lighting: LightingPreset) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onBrightnessChange: (value: number[]) => void;
  onInteractiveLightingToggle: () => void;
  onMaterialSettingsChange: (settings: MaterialSettings) => void;
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onApplyCombo: (combo: any) => void;
  isApplyingPreset?: boolean;
  currentCard?: CardData;
  // Spaces integration props
  spaceState?: SpaceState;
  spacesTemplates?: SpaceTemplate[];
  onTemplateSelect?: (template: SpaceTemplate | null) => void;
  onAddCardToSpace?: () => void;
  onRemoveCardFromSpace?: (cardId: string) => void;
  onToggleEditMode?: () => void;
}

export const TabbedStudioContent: React.FC<TabbedStudioContentProps> = ({
  selectedScene,
  selectedLighting,
  effectValues,
  overallBrightness,
  interactiveLighting,
  materialSettings,
  onSceneChange,
  onLightingChange,
  onEffectChange,
  onBrightnessChange,
  onInteractiveLightingToggle,
  onMaterialSettingsChange,
  selectedPresetId,
  onPresetSelect,
  onApplyCombo,
  isApplyingPreset = false,
  currentCard,
  spaceState,
  spacesTemplates = [],
  onTemplateSelect,
  onAddCardToSpace,
  onRemoveCardFromSpace,
  onToggleEditMode
}) => {
  // Section state management
  const [sectionsOpen, setSectionsOpen] = useState({
    sceneEnvironment: true,
    lighting: false
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex-1 min-h-0">
      <Tabs defaultValue="spaces" className="h-full flex flex-col">
        {/* Tab Navigation */}
        <div className="p-4 border-b border-white/10">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger 
              value="spaces" 
              className="flex items-center space-x-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Spaces</span>
            </TabsTrigger>
            <TabsTrigger 
              value="frames" 
              className="flex items-center space-x-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <FrameIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Frames</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center space-x-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="spaces" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              <SpacesTab
                currentCard={currentCard}
                spaceState={spaceState}
                spacesTemplates={spacesTemplates}
                onTemplateSelect={onTemplateSelect}
                onAddCardToSpace={onAddCardToSpace}
                onRemoveCardFromSpace={onRemoveCardFromSpace}
                onToggleEditMode={onToggleEditMode}
              />

              {/* Combined Scene & Environment Section */}
              <CollapsibleSection
                title="Scene & Environment"
                emoji="🌍"
                statusText={`${selectedScene.name} • ${spaceState?.selectedTemplate ? '3D Mode' : 'Standard'}`}
                isOpen={sectionsOpen.sceneEnvironment}
                onToggle={() => toggleSection('sceneEnvironment')}
              >
                <div className="space-y-6">
                  {/* 3D Space Templates */}
                  <div>
                    <h4 className="text-white font-medium text-sm mb-3">3D Environment Templates</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Switch to 3D space mode with multi-card environments
                    </p>
                    <SpaceTemplateSelector
                      templates={spacesTemplates}
                      selectedTemplate={spaceState?.selectedTemplate || null}
                      onTemplateSelect={onTemplateSelect || (() => {})}
                    />
                  </div>

                  {/* Background Environments */}
                  <div>
                    <h4 className="text-white font-medium text-sm mb-3">Background Environments</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Standard single-card viewing environments
                    </p>
                    <EnvironmentControls
                      selectedScene={selectedScene}
                      selectedLighting={selectedLighting}
                      overallBrightness={overallBrightness}
                      interactiveLighting={interactiveLighting}
                      onSceneChange={onSceneChange}
                      onLightingChange={onLightingChange}
                      onBrightnessChange={onBrightnessChange}
                      onInteractiveLightingToggle={onInteractiveLightingToggle}
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Separate Lighting Section */}
              <CollapsibleSection
                title="Lighting"
                emoji="💡"
                statusText={selectedLighting.name}
                isOpen={sectionsOpen.lighting}
                onToggle={() => toggleSection('lighting')}
              >
                <LightingSection
                  selectedLighting={selectedLighting}
                  overallBrightness={overallBrightness}
                  interactiveLighting={interactiveLighting}
                  onLightingChange={onLightingChange}
                  onBrightnessChange={onBrightnessChange}
                  onInteractiveLightingToggle={onInteractiveLightingToggle}
                />
              </CollapsibleSection>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="frames" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <FramesTab
                effectValues={effectValues}
                selectedPresetId={selectedPresetId}
                onPresetSelect={onPresetSelect}
                onApplyCombo={onApplyCombo}
                isApplyingPreset={isApplyingPreset}
                onEffectChange={onEffectChange}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="advanced" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <AdvancedStudioTab
                materialSettings={materialSettings}
                onMaterialSettingsChange={onMaterialSettingsChange}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
