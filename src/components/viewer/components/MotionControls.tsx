
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, RotateCcw, FlipHorizontal, Square } from 'lucide-react';

interface MotionControlsProps {
  onStopMotion: () => void;
  onSnapToCenter: () => void;
  onResumeMotion: () => void;
  onResetRotation: () => void;
  onFlipCard?: () => void;
  isMotionStopped?: boolean;
  className?: string;
}

export const MotionControls: React.FC<MotionControlsProps> = ({
  onStopMotion,
  onSnapToCenter,
  onResumeMotion,
  onResetRotation,
  onFlipCard,
  isMotionStopped = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stop Motion */}
      <Button
        onClick={onStopMotion}
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
        title="Stop Rotation"
      >
        <Square className="w-4 h-4 mr-1" />
        Stop
      </Button>

      {/* Reset to Center */}
      <Button
        onClick={onSnapToCenter}
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
        title="Reset to Front View"
      >
        <Target className="w-4 h-4 mr-1" />
        Reset
      </Button>

      {/* Flip Card */}
      {onFlipCard && (
        <Button
          onClick={onFlipCard}
          variant="outline"
          size="sm"
          className="h-9 px-3 bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30"
          title="Flip Card"
        >
          <FlipHorizontal className="w-4 h-4 mr-1" />
          Flip
        </Button>
      )}

      {/* Reset Camera */}
      <Button
        onClick={onResetRotation}
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
        title="Reset Camera & Card"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Camera
      </Button>
    </div>
  );
};
