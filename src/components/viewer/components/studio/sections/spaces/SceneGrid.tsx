
import React from 'react';
import { cn } from '@/lib/utils';
import type { EnvironmentScene } from '../../../../types';
import { ENVIRONMENT_SCENES } from '../../../../constants';

interface SceneGridProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
}

export const SceneGrid: React.FC<SceneGridProps> = ({
  selectedScene,
  onSceneChange,
}) => {
  const categories = ['professional', 'luxury', 'natural', 'fantasy', 'futuristic', 'architectural', 'artistic'] as const;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'professional': return '💼';
      case 'luxury': return '💎';
      case 'natural': return '🌿';
      case 'fantasy': return '✨';
      case 'futuristic': return '🚀';
      case 'architectural': return '🏛️';
      case 'artistic': return '🎨';
      default: return '🌍';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium">Environments</h4>
      {categories.map((category) => {
        const categoryScenes = ENVIRONMENT_SCENES.filter(s => s.category === category);
        if (categoryScenes.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <h5 className="text-white/80 font-medium text-sm flex items-center capitalize">
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category}
            </h5>
            
            <div className="grid grid-cols-2 gap-2">
              {categoryScenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(scene)}
                  className={cn(
                    "relative group rounded-lg overflow-hidden transition-all",
                    "border-2 hover:scale-105",
                    selectedScene.id === scene.id
                      ? "border-green-400 shadow-lg shadow-green-400/20"
                      : "border-white/20 hover:border-white/40"
                  )}
                >
                  <img
                    src={scene.previewUrl}
                    alt={scene.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-1">
                    <div className="text-center">
                      <div className="text-lg mb-1">{scene.icon}</div>
                      <div className="text-xs text-white font-medium leading-tight">
                        {scene.name}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
