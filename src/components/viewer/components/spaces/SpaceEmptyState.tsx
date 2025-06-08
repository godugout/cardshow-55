
import React from 'react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceEmptyStateProps {
  template: SpaceTemplate | null;
}

export const SpaceEmptyState: React.FC<SpaceEmptyStateProps> = ({ template }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center text-gray-400">
        {template ? (
          <>
            <div className="text-4xl mb-2">{template.emoji}</div>
            <div className="text-sm font-medium">{template.name}</div>
            <div className="text-xs mt-1 opacity-75">{template.description}</div>
            <div className="text-xs mt-2 text-crd-green">Click "Add Current" to place cards</div>
          </>
        ) : (
          <>
            <div className="text-2xl mb-2">🌌</div>
            <div className="text-sm">Select a space template to begin</div>
          </>
        )}
      </div>
    </div>
  );
};
