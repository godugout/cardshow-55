import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CosmicDanceControlsProps {
  animationProgress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  cardAngle: number;
  cameraDistance: number;
  isOptimalZoom: boolean;
  isOptimalPosition: boolean;
  hasTriggered: boolean;
  onProgressChange: (progress: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onAngleReset: () => void;
}

const SPEED_OPTIONS = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 4, label: '4x' }
];

export const CosmicDanceControls: React.FC<CosmicDanceControlsProps> = ({
  animationProgress,
  isPlaying,
  playbackSpeed,
  cardAngle,
  cameraDistance,
  isOptimalZoom,
  isOptimalPosition,
  hasTriggered,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset,
  onAngleReset
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-hide during animation unless manually expanded
  const shouldShowControls = !isPlaying || isExpanded;

  return (
    <div className="w-full">
      {/* Mobile-first responsive controls */}
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg">
        {/* Header with toggle - always visible */}
        <div className="flex items-center justify-between p-3 lg:p-4">
          <span className="text-white text-sm font-medium">Cosmic Controls</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="touch-target w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors lg:hidden"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible content */}
        <div className={`overflow-hidden transition-all duration-300 ${shouldShowControls ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100'}`}>
          <div className="p-3 lg:p-4 pt-0 space-y-4">
            {/* Progress Bar */}
            <div>
              <label className="block text-white text-sm mb-2">Animation Progress</label>
              <Slider
                value={[animationProgress * 100]}
                onValueChange={(value) => onProgressChange(value[0] / 100)}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-white text-xs mt-1 opacity-70">
                {Math.round(animationProgress * 100)}%
              </div>
            </div>

            {/* Play/Pause & Speed Controls */}
            <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-3">
              <button
                onClick={onPlayToggle}
                className="mobile-btn flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <Select onValueChange={(value) => onSpeedChange(Number(value))}>
                <SelectTrigger className="mobile-btn bg-black/50 border-white/20 text-white">
                  <SelectValue placeholder={`${playbackSpeed}x`} />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  {SPEED_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset & Status */}
            <div className="flex items-center justify-between">
              <button
                onClick={onReset}
                className="touch-target flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              
              <div className="text-white/70 text-xs">
                {hasTriggered ? 'Cosmic Triggered' : 'Ready'}
              </div>
            </div>

            {/* Status Information - Stack on mobile */}
            <div className="pt-3 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="text-white/60">
                  Card Angle: <span className="text-white">{Math.round(cardAngle)}°</span>
                </div>
                <div className="text-white/60">
                  Distance: <span className="text-white">{cameraDistance.toFixed(1)}</span>
                </div>
                <div className="text-white/60">
                  Zoom: <span className={isOptimalZoom ? "text-green-400" : "text-yellow-400"}>
                    {isOptimalZoom ? "Optimal" : "Adjust"}
                  </span>
                </div>
                <div className="text-white/60">
                  Position: <span className={isOptimalPosition ? "text-green-400" : "text-yellow-400"}>
                    {isOptimalPosition ? "Optimal" : "Adjust"}
                  </span>
                </div>
              </div>
              
              {/* Card Angle Reset Button */}
              <button
                onClick={onAngleReset}
                className="mobile-btn mt-3 w-full px-3 py-2 text-white/70 hover:text-white text-sm transition-colors border border-white/20 rounded"
              >
                Reset Card Angle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};