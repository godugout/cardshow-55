
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ViewerMode } from '@/pages/Viewer';

interface ViewerHeaderProps {
  mode: ViewerMode;
  onModeChange: (mode: ViewerMode) => void;
  onClose: () => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  mode,
  onModeChange,
  onClose
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onClose}
          className="flex items-center bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to CRD
        </button>
        
        <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className="text-white font-medium">
            {mode === 'view' && 'Card Viewer'}
            {mode === 'studio' && 'Card Studio'}
            {mode === 'shop' && 'Card Creation'}
          </span>
        </div>
      </div>
    </div>
  );
};
