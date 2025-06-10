
import React from 'react';
import { cn } from '@/lib/utils';
import type { HDRIEnvironment } from '../../../../spaces/types';
import { HDRI_ENVIRONMENTS } from './index';

interface HDRIEnvironmentGridProps {
  selectedHDRI: HDRIEnvironment | null;
  onHDRIChange: (hdri: HDRIEnvironment) => void;
  isActive: boolean;
}

export const HDRIEnvironmentGrid: React.FC<HDRIEnvironmentGridProps> = ({
  selectedHDRI,
  onHDRIChange,
  isActive
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">HDRI Environments</h4>
        {isActive && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {HDRI_ENVIRONMENTS.map((hdri) => (
          <button
            key={hdri.id}
            onClick={() => onHDRIChange(hdri)}
            className={cn(
              "relative group rounded-lg overflow-hidden transition-all",
              "border-2 hover:scale-105",
              selectedHDRI?.id === hdri.id && isActive
                ? "border-green-400 shadow-lg shadow-green-400/20"
                : "border-white/20 hover:border-white/40"
            )}
          >
            <img
              src={hdri.previewUrl}
              alt={hdri.name}
              className="w-full h-20 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg mb-1">{hdri.emoji}</div>
                <div className="text-xs text-white font-medium">
                  {hdri.name}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
