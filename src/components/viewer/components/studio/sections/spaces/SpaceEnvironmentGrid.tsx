
import React from 'react';
import { Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpaceEnvironment } from '../../../../spaces/types';
import { SPACE_ENVIRONMENTS } from './constants';

interface SpaceEnvironmentGridProps {
  selectedSpace: SpaceEnvironment;
  onSpaceChange: (space: SpaceEnvironment) => void;
}

export const SpaceEnvironmentGrid: React.FC<SpaceEnvironmentGridProps> = ({
  selectedSpace,
  onSpaceChange
}) => {
  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <h4 className="text-white font-medium text-sm flex items-center">
        <Orbit className="w-4 h-4 text-purple-400 mr-2" />
        3D Spaces
      </h4>
      
      <div className="grid grid-cols-2 gap-2">
        {SPACE_ENVIRONMENTS.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceChange(space)}
            className={cn(
              "relative aspect-video rounded-lg overflow-hidden transition-all border-2",
              selectedSpace.id === space.id 
                ? 'border-purple-400 scale-105 shadow-lg shadow-purple-400/20' 
                : 'border-white/20 hover:border-white/40 opacity-80 hover:opacity-100'
            )}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${space.config.backgroundColor}80, ${space.config.ambientColor}40)`
              }}
            >
              {space.emoji}
            </div>
            <div className="absolute inset-0 bg-black/20 flex items-end p-2">
              <div className="text-white text-xs font-medium">
                {space.name}
              </div>
            </div>
            {selectedSpace.id === space.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
