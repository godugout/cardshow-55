
import React from 'react';
import { cn } from '@/lib/utils';
import type { SpaceEnvironment } from '../../../../spaces/types';
import { SPACE_ENVIRONMENTS } from './index';

interface SpaceEnvironmentGridProps {
  selectedSpace: SpaceEnvironment;
  onSpaceChange: (space: SpaceEnvironment) => void;
  isActive: boolean;
}

export const SpaceEnvironmentGrid: React.FC<SpaceEnvironmentGridProps> = ({
  selectedSpace,
  onSpaceChange,
  isActive
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">3D Spaces</h4>
        {isActive && (
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {SPACE_ENVIRONMENTS.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceChange(space)}
            className={cn(
              "relative group rounded-lg overflow-hidden transition-all",
              "border-2 hover:scale-105",
              selectedSpace?.id === space.id && isActive
                ? "border-blue-400 shadow-lg shadow-blue-400/20"
                : "border-white/20 hover:border-white/40"
            )}
          >
            <img
              src={space.previewUrl}
              alt={space.name}
              className="w-full h-20 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg mb-1">{space.emoji}</div>
                <div className="text-xs text-white font-medium">
                  {space.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
