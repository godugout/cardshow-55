
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, ChevronUp, ChevronDown } from 'lucide-react';

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
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-crd-darker/90 backdrop-blur-sm border border-crd-mediumGray/20 rounded-lg p-4">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-crd-white/70 hover:text-crd-white mb-2"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          <span className="text-sm">Animation Controls</span>
        </button>

        {shouldShowControls && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-crd-white/70">
                <span>Progress</span>
                <span>{Math.round(animationProgress * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={animationProgress}
                onChange={(e) => onProgressChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-crd-mediumGray rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={onPlayToggle}
                className="flex items-center justify-center w-10 h-10 bg-crd-accent hover:bg-crd-accent/80 text-white rounded-lg transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="bg-crd-mediumGray text-crd-white rounded px-3 py-2 text-sm border border-crd-mediumGray/40"
              >
                {SPEED_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={onReset}
                className="flex items-center justify-center w-10 h-10 bg-crd-mediumGray hover:bg-crd-mediumGray/80 text-crd-white rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-2 gap-4 text-xs text-crd-white/60">
              <div>
                <span className="block">Card Angle</span>
                <span className="text-crd-white">{Math.round(cardAngle)}°</span>
              </div>
              <div>
                <span className="block">Camera Distance</span>
                <span className="text-crd-white">{cameraDistance.toFixed(1)}</span>
              </div>
              <div>
                <span className="block">Optimal Zoom</span>
                <span className={isOptimalZoom ? "text-green-400" : "text-yellow-400"}>
                  {isOptimalZoom ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <span className="block">Optimal Position</span>
                <span className={isOptimalPosition ? "text-green-400" : "text-yellow-400"}>
                  {isOptimalPosition ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Reset Angle Button */}
            <button
              onClick={onAngleReset}
              className="w-full bg-crd-mediumGray hover:bg-crd-mediumGray/80 text-crd-white rounded-lg py-2 text-sm transition-colors"
            >
              Reset Card Angle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
