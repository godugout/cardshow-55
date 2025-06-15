
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
      {/* Left: Logo and Back Button */}
      <div className="pointer-events-auto flex items-center space-x-4">
        <img 
          src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
          alt="CRD Logo" 
          className="w-8 h-8"
          onError={(e) => {
            console.warn('CRD logo failed to load');
            e.currentTarget.style.display = 'none';
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center px-3 py-2"
        >
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
            className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-3 py-2"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        </div>
      )}
    </div>
  );
};
