
import React from 'react';
import { Button } from '@/components/ui/button';
import { StopCircle, Target, Play, RotateCcw } from 'lucide-react';

interface MotionControlsProps {
  onStopMotion: () => void;
  onSnapToCenter: () => void;
  onResumeMotion: () => void;
  onResetRotation: () => void;
  isMotionStopped?: boolean;
  className?: string;
}

export const MotionControls: React.FC<MotionControlsProps> = ({
  onStopMotion,
  onSnapToCenter,
  onResumeMotion,
  onResetRotation,
  isMotionStopped = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stop/Resume Motion */}
      <Button
        onClick={isMotionStopped ? onResumeMotion : onStopMotion}
        variant="outline"
        size="sm"
        className={`h-9 px-3 ${
          isMotionStopped 
            ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30' 
            : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
        }`}
        title={isMotionStopped ? 'Resume Motion' : 'Stop All Motion'}
      >
        {isMotionStopped ? (
          <>
            <Play className="w-4 h-4 mr-1" />
            Resume
          </>
        ) : (
          <>
            <StopCircle className="w-4 h-4 mr-1" />
            Stop
          </>
        )}
      </Button>

      {/* Snap to Center */}
      <Button
        onClick={onSnapToCenter}
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
        title="Snap to Center"
      >
        <Target className="w-4 h-4 mr-1" />
        Center
      </Button>

      {/* Reset Rotation */}
      <Button
        onClick={onResetRotation}
        variant="outline"
        size="sm"
        className="h-9 px-3 bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30"
        title="Reset Rotation"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        Reset
      </Button>
    </div>
  );
};
