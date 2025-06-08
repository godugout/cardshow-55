
import React from 'react';
import { Plus, Image } from 'lucide-react';
import type { SpaceTemplate } from '../../types/spaces';

interface SpaceEmptyStateProps {
  template: SpaceTemplate | null;
}

export const SpaceEmptyState: React.FC<SpaceEmptyStateProps> = ({ template }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          {template ? (
            <span className="text-4xl">{template.emoji}</span>
          ) : (
            <Image className="w-12 h-12 text-white/40" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3">
          {template ? `${template.name} Ready` : 'Empty Space'}
        </h3>
        
        <p className="text-gray-400 mb-6">
          {template 
            ? `Your ${template.name.toLowerCase()} is ready for cards. Add cards from your collection to begin creating your 3D display.`
            : 'Select a template and add cards to create your 3D space.'
          }
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Plus className="w-4 h-4" />
          <span>Use the Spaces tab to add cards</span>
        </div>
      </div>
    </div>
  );
};
