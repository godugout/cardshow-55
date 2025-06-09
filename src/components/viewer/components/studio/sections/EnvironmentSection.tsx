
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Globe, Mountain, Sparkles, Eye } from 'lucide-react';
import type { EnvironmentScene, EnvironmentControls } from '../../../types';
import { ENVIRONMENT_SCENES } from '../../../constants';

interface EnvironmentSectionProps {
  selectedScene: EnvironmentScene;
  environmentControls: EnvironmentControls;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSceneChange: (scene: EnvironmentScene) => void;
  onControlsChange: (controls: EnvironmentControls) => void;
}

export const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({
  selectedScene,
  environmentControls,
  isOpen,
  onToggle,
  onSceneChange,
  onControlsChange
}) => {
  const categories = ['natural', 'fantasy', 'futuristic', 'architectural'] as const;
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'natural': return '🌿';
      case 'fantasy': return '✨';
      case 'futuristic': return '🚀';
      case 'architectural': return '🏛️';
      default: return '🌍';
    }
  };

  const updateControl = (key: keyof EnvironmentControls, value: number) => {
    onControlsChange({
      ...environmentControls,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center">
          <Globe className="w-4 h-4 text-crd-green mr-2" />
          Environment
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onToggle(!isOpen)}
          className="text-white hover:text-white"
        >
          {isOpen ? 'Hide' : 'Show'}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Environment Categories */}
          {categories.map((category) => {
            const categoryScenes = ENVIRONMENT_SCENES.filter(s => s.category === category);
            if (categoryScenes.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-white font-medium text-sm flex items-center capitalize">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {category}
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {categoryScenes.map((scene) => (
                    <button
                      key={scene.id}
                      onClick={() => onSceneChange(scene)}
                      className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                        selectedScene.id === scene.id 
                          ? 'ring-2 ring-crd-green scale-105' 
                          : 'hover:scale-102 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={scene.previewUrl}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                        <div className="text-white text-xs">
                          <div className="font-medium">{scene.name}</div>
                          <div className="opacity-75">{scene.description}</div>
                        </div>
                      </div>
                      {selectedScene.id === scene.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-crd-green rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Environment Controls */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <h4 className="text-white font-medium flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Environment Controls
            </h4>

            {/* Depth of Field */}
            <div>
              <Label className="text-white text-sm mb-2 block">
                Depth of Field: {environmentControls.depthOfField.toFixed(1)}
              </Label>
              <Slider
                value={[environmentControls.depthOfField]}
                onValueChange={([value]) => updateControl('depthOfField', value)}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Parallax Intensity */}
            <div>
              <Label className="text-white text-sm mb-2 block">
                Parallax Intensity: {environmentControls.parallaxIntensity.toFixed(1)}
              </Label>
              <Slider
                value={[environmentControls.parallaxIntensity]}
                onValueChange={([value]) => updateControl('parallaxIntensity', value)}
                min={0}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Field of View */}
            <div>
              <Label className="text-white text-sm mb-2 block">
                Field of View: {environmentControls.fieldOfView}°
              </Label>
              <Slider
                value={[environmentControls.fieldOfView]}
                onValueChange={([value]) => updateControl('fieldOfView', value)}
                min={60}
                max={120}
                step={5}
                className="w-full"
              />
            </div>

            {/* Atmospheric Density */}
            <div>
              <Label className="text-white text-sm mb-2 block">
                Atmospheric Density: {(environmentControls.atmosphericDensity * 100).toFixed(0)}%
              </Label>
              <Slider
                value={[environmentControls.atmosphericDensity]}
                onValueChange={([value]) => updateControl('atmosphericDensity', value)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
