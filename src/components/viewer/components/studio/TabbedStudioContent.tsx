
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Map, FrameIcon, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpacesTab } from './tabs/SpacesTab';
import { FramesTab } from './tabs/FramesTab';
import { AdvancedStudioTab } from './tabs/AdvancedStudioTab';
import type { EffectValues } from '../../hooks/useEnhancedCardEffects';
import type { EnvironmentScene, LightingPreset, MaterialSettings } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';

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
  currentCard
}) => {
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
            <div className="p-4">
              <SpacesTab
                selectedScene={selectedScene}
                selectedLighting={selectedLighting}
                overallBrightness={overallBrightness}
                interactiveLighting={interactiveLighting}
                onSceneChange={onSceneChange}
                onLightingChange={onLightingChange}
                onBrightnessChange={onBrightnessChange}
                onInteractiveLightingToggle={onInteractiveLightingToggle}
                effectValues={effectValues}
                materialSettings={materialSettings}
                currentCard={currentCard}
              />
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
