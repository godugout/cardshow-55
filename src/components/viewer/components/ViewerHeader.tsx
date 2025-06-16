
import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/gallery');
    }
  };

  return (
    <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Compact Back Button - aligned with navbar logo */}
      <div className="pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center justify-center px-2 py-1 h-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Right: Compact Studio Button (when panel is closed) */}
      {showStudioButton && (
        <div className="pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-2 py-1 h-8"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        </div>
      )}
    </div>
  );
};
