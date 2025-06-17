
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
    console.log('🔙 Back button clicked');
    
    if (onClose) {
      console.log('🔙 Using provided onClose handler');
      onClose();
    } else {
      console.log('🔙 Using React Router navigation');
      // Go back to gallery specifically
      navigate('/gallery', { replace: true });
    }
  };

  return (
    <div className="absolute top-8 left-6 right-6 z-40 flex items-center justify-between pointer-events-none">
      {/* Left: Empty space to maintain layout balance */}
      <div></div>

      {/* Right: Button group with Back and Studio buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white flex items-center justify-center px-3 py-2 h-10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </Button>
        
        {showStudioButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black bg-opacity-60 hover:bg-opacity-80 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-3 py-2 h-10"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        )}
      </div>
    </div>
  );
};
