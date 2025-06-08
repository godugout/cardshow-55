
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ENVIRONMENT_SCENES } from '../../../constants';
import { EnhancedSpacesSection } from './EnhancedSpacesSection';
import type { EnvironmentScene, MaterialSettings } from '../../../types';
import type { EffectValues } from '../../../hooks/useEnhancedCardEffects';
import type { CardData } from '@/hooks/useCardEditor';

interface EnvSectionProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
  effectValues: EffectValues;
  materialSettings: MaterialSettings;
  overallBrightness: number[];
  interactiveLighting: boolean;
  currentCard?: CardData;
}

export const EnvSection: React.FC<EnvSectionProps> = ({
  selectedScene,
  onSceneChange,
  effectValues,
  materialSettings,
  overallBrightness,
  interactiveLighting,
  currentCard
}) => {
  return (
    <div className="space-y-4">
      {/* Environment Scene Selection */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">3D Environments</h4>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENT_SCENES.map((scene) => (
            <Button
              key={scene.id}
              onClick={() => onSceneChange(scene)}
              variant="ghost"
              className={cn(
                "h-auto p-3 flex flex-col items-center space-y-2 transition-all duration-200",
                selectedScene.id === scene.id
                  ? "bg-crd-green/20 border-crd-green text-white shadow-md"
                  : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30"
              )}
              style={selectedScene.id === scene.id ? {
                borderColor: '#00C851',
                backgroundColor: '#00C85120',
                boxShadow: '0 0 15px #00C85130'
              } : {}}
            >
              <div className="text-lg">{scene.emoji}</div>
              <div className="text-center">
                <div className="text-xs font-medium text-white">{scene.name}</div>
                <div className="text-xs text-gray-400 mt-1">{scene.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* 3D Spaces Section */}
      <div>
        <h4 className="text-white font-medium text-sm mb-3">3D Card Spaces</h4>
        <EnhancedSpacesSection
          effectValues={effectValues}
          selectedScene={selectedScene}
          selectedLighting={{ id: 'default', name: 'Default', description: '', color: '#ffffff' }}
          materialSettings={materialSettings}
          overallBrightness={overallBrightness}
          interactiveLighting={interactiveLighting}
          currentCard={currentCard}
        />
      </div>
    </div>
  );
};
