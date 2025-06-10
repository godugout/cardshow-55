
import React from 'react';
import { cn } from '@/lib/utils';
import type { SpaceEnvironment } from '../../../../spaces/types';
import { SPACE_ENVIRONMENTS } from './constants';

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
  // Remove duplicates and filter out basic spaces for cleaner display
  const uniqueSpaces = SPACE_ENVIRONMENTS.filter((space, index, arr) => 
    arr.findIndex(s => s.config.panoramicPhotoId === space.config.panoramicPhotoId) === index
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">3D Spaces</h4>
        {isActive && (
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      {/* Unified Spaces Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
        {uniqueSpaces.map((space) => (
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
                <div className="text-xs text-white font-medium px-1">
                  {space.name}
                </div>
              </div>
            </div>
            {selectedSpace?.id === space.id && isActive && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            )}
            {space.type === 'panoramic' && (
              <div className="absolute bottom-1 left-1">
                <span className="text-xs text-blue-300 bg-blue-500/30 px-1 rounded">360°</span>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Simple Description */}
      <div className="text-xs text-gray-400 bg-black/20 rounded p-2">
        <strong>3D Immersive Spaces:</strong> Choose from photorealistic 360° environments to showcase your cards in stunning detail.
      </div>
    </div>
  );
};
