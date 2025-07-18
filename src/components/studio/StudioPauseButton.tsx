import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';

interface StudioPauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export const StudioPauseButton: React.FC<StudioPauseButtonProps> = ({
  isPaused,
  onTogglePause
}) => {
  return (
    <Button
      onClick={onTogglePause}
      variant="outline"
      size="icon"
      className="bg-crd-darkGray/80 backdrop-blur-sm border-crd-mediumGray/30 hover:bg-crd-mediumGray/50 transition-all duration-200"
      title={isPaused ? "Resume particle animation" : "Pause particle animation"}
    >
      {isPaused ? (
        <Play className="h-4 w-4 text-crd-lightGray" />
      ) : (
        <Pause className="h-4 w-4 text-crd-lightGray" />
      )}
    </Button>
  );
};