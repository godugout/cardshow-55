
import React from 'react';
import { Edit3, Hand } from 'lucide-react';

interface SpaceEditModeOverlayProps {
  isEditMode: boolean;
}

export const SpaceEditModeOverlay: React.FC<SpaceEditModeOverlayProps> = ({ isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="flex items-center space-x-2 bg-crd-green/90 text-black px-3 py-2 rounded-lg backdrop-blur-sm">
        <Edit3 className="w-4 h-4" />
        <span className="text-sm font-semibold">Edit Mode</span>
      </div>
      <div className="mt-2 text-xs text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
        Click cards to select • Ctrl+click for multi-select
      </div>
    </div>
  );
};
