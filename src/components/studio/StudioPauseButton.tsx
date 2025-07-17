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
      className="fixed bottom-6 left-36 z-50 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-200"
      title={isPaused ? "Resume particle animation" : "Pause particle animation"}
    >
      {isPaused ? (
        <Play className="h-4 w-4" />
      ) : (
        <Pause className="h-4 w-4" />
      )}
    </Button>
  );
};