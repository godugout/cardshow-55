
import React from 'react';
import { cn } from '@/lib/utils';
import type { EnvironmentScene } from '../../../../types';
import { ENVIRONMENT_SCENES } from '../../../../constants';

interface SceneGridProps {
  selectedScene: EnvironmentScene;
  onSceneChange: (scene: EnvironmentScene) => void;
  isActive: boolean;
}

export const SceneGrid: React.FC<SceneGridProps> = ({
  selectedScene,
  onSceneChange,
  isActive
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">2D Environments</h4>
        {isActive && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {ENVIRONMENT_SCENES.slice(0, 4).map((scene) => (
          <button
            key={scene.id}
            onClick={() => onSceneChange(scene)}
            className={cn(
              "relative group rounded-lg overflow-hidden transition-all",
              "border-2 hover:scale-105",
              selectedScene.id === scene.id && isActive
                ? "border-green-400 shadow-lg shadow-green-400/20"
                : "border-white/20 hover:border-white/40"
            )}
          >
            <img
              src={scene.previewUrl}
              alt={scene.name}
              className="w-full h-20 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg mb-1">{scene.icon}</div>
                <div className="text-xs text-white font-medium">
                  {scene.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
