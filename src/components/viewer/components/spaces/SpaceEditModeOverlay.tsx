
import React from 'react';

interface SpaceEditModeOverlayProps {
  isEditMode: boolean;
}

export const SpaceEditModeOverlay: React.FC<SpaceEditModeOverlayProps> = ({ isEditMode }) => {
  if (!isEditMode) return null;

  return (
    <div className="absolute top-3 right-3 bg-crd-green/20 border border-crd-green/40 text-crd-green px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
        <span>Edit Mode</span>
      </div>
    </div>
  );
};
