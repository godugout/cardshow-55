
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
    <div className="absolute top-8 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Empty space to maintain layout balance */}
      <div></div>

      {/* Right: Studio button only - back button moved to navbar */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {showStudioButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-2 py-1 h-8"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        )}
      </div>
    </div>
  );
};
