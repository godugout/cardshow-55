
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
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
  isOpen,
  onToggle,
  onSceneChange
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
        </div>
      )}
    </div>
  );
};
