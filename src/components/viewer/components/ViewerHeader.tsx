
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
    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Subtle Back Button */}
      <div className="pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center justify-center px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" />
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
