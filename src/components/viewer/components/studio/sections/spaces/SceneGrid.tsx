
import React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnvironmentScene } from '../../../../types';
import { ENVIRONMENT_SCENES } from '../../../../constants';

interface SceneGridProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
  isActive?: boolean;
}

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

export const SceneGrid: React.FC<SceneGridProps> = ({
  selectedScene,
  onSceneChange,
  isActive = true
}) => {
  return (
    <div className={cn("space-y-3", !isActive && "opacity-50")}>
      <h4 className="text-white font-medium text-sm flex items-center">
        <Globe className={cn("w-4 h-4 mr-2", isActive ? "text-blue-400" : "text-gray-500")} />
        Scenes
        {isActive && <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full"></span>}
      </h4>
      
      {categories.map((category) => {
        const categoryScenes = ENVIRONMENT_SCENES.filter(s => s.category === category);
        if (categoryScenes.length === 0) return null;

        return (
          <div key={category} className="space-y-2">
            <h5 className="text-white/70 font-medium text-xs flex items-center capitalize">
              <span className="mr-2">{getCategoryIcon(category)}</span>
              {category}
            </h5>
            
            <div className="grid grid-cols-2 gap-2">
              {categoryScenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => onSceneChange(scene)}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden transition-all border-2",
                    isActive && selectedScene.id === scene.id 
                      ? 'border-blue-400 scale-105 shadow-lg shadow-blue-400/20' 
                      : 'border-white/20 hover:border-white/40 opacity-80 hover:opacity-100'
                  )}
                >
                  <img
                    src={scene.previewUrl}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                    <div className="text-white text-xs font-medium">
                      {scene.name}
                    </div>
                  </div>
                  {isActive && selectedScene.id === scene.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
