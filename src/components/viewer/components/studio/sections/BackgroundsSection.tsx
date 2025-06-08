
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe, Image } from 'lucide-react';
import { EnvSection } from './EnvSection';
import { WallpaperSection } from './WallpaperSection';
import type { EnvironmentScene, MaterialSettings } from '../../../types';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

interface BackgroundsSectionProps {
  selectedBackgroundType: 'env' | 'wallpaper';
  selectedScene: EnvironmentScene;
  selectedWallpaper: string | null;
  onBackgroundTypeChange: (type: 'env' | 'wallpaper') => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onWallpaperChange: (wallpaper: string | null) => void;
  effectValues: EffectValues;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  currentCard?: CardData;
}

export const BackgroundsSection: React.FC<BackgroundsSectionProps> = ({
  selectedBackgroundType,
  selectedScene,
  selectedWallpaper,
  onBackgroundTypeChange,
  onSceneChange,
  onWallpaperChange,
  effectValues,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  currentCard
}) => {
  return (
    <div className="space-y-4">
      <Tabs 
        value={selectedBackgroundType} 
        onValueChange={(value) => onBackgroundTypeChange(value as 'env' | 'wallpaper')}
        className="w-full"
      >
        {/* Background Type Tabs */}
        <TabsList className="grid w-full grid-cols-2 bg-white/5">
          <TabsTrigger 
            value="env" 
            className="flex items-center space-x-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <Globe className="w-4 h-4" />
            <span>Env</span>
          </TabsTrigger>
          <TabsTrigger 
            value="wallpaper" 
            className="flex items-center space-x-2 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <Image className="w-4 h-4" />
            <span>Wallpaper</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="env" className="mt-4">
          <EnvSection
            selectedScene={selectedScene}
            onSceneChange={onSceneChange}
            effectValues={effectValues}
            materialSettings={materialSettings}
            overallBrightness={overallBrightness}
            interactiveLighting={interactiveLighting}
            currentCard={currentCard}
          />
        </TabsContent>

        <TabsContent value="wallpaper" className="mt-4">
          <WallpaperSection
            selectedWallpaper={selectedWallpaper}
            onWallpaperChange={onWallpaperChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
