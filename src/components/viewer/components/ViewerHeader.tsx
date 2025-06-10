
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewerHeaderProps {
  onClose?: () => void;
  showStudioButton: boolean;
  onOpenStudio: () => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  onClose,
  showStudioButton,
  onOpenStudio
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Back to CRD Button */}
      <div className="pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center space-x-2 px-4 py-2 transition-all"
        >
          <img 
            src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
            alt="CRD Logo" 
            className="w-5 h-5"
            onError={(e) => {
              console.warn('CRD logo failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-sm font-medium">Back to CRD</span>
        </Button>
      </div>

      {/* Right: Studio Button (when panel is closed) */}
      {showStudioButton && (
        <div className="pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center space-x-2 px-4 py-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        </div>
      )}
    </div>
  );
};
