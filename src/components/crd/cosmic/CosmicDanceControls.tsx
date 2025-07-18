import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface CosmicDanceControlsProps {
  animationProgress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  cardAngle: number;
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
  { value: 4, label: '4x' },
];

export const CosmicDanceControls: React.FC<CosmicDanceControlsProps> = ({
  animationProgress,
  isPlaying,
  playbackSpeed,
  cardAngle,
  onProgressChange,
  onPlayToggle,
  onSpeedChange,
  onReset,
  onAngleReset
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 space-y-4 min-w-80">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Cosmic Dance Controls
          </h3>
          <button
            onClick={onReset}
            className="text-white/70 hover:text-white transition-colors"
            title="Reset Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span>Animation Timeline</span>
            <span>{Math.round(animationProgress * 100)}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={animationProgress}
              onChange={(e) => onProgressChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${animationProgress * 100}%, rgba(255,255,255,0.2) ${animationProgress * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            {/* Keyframe markers */}
            <div className="absolute top-0 w-full h-2 pointer-events-none">
              {[0.25, 0.5, 0.75, 1.0].map((marker) => (
                <div
                  key={marker}
                  className="absolute w-1 h-2 bg-white/50 rounded"
                  style={{ left: `${marker * 100}%`, transform: 'translateX(-50%)' }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-white/50 text-xs">
            <span>Start</span>
            <span>25%</span>
            <span>Trigger</span>
            <span>75%</span>
            <span>Align</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayToggle}
            className="flex items-center justify-center w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          
          <div className="flex-1 space-y-1">
            <div className="text-white/70 text-xs">Playback Speed</div>
            <div className="flex gap-1">
              {SPEED_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSpeedChange(option.value)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    playbackSpeed === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/20 text-white/70 hover:bg-white/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Angle Monitor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span>Card Forward Lean</span>
            <span>{Math.round(cardAngle)}°</span>
          </div>
          <div className="relative">
            <div className="w-full h-2 bg-white/20 rounded-lg overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  cardAngle >= 45 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, (cardAngle / 90) * 100)}%` }}
              />
            </div>
            {/* 45° trigger marker */}
            <div 
              className="absolute top-0 w-0.5 h-2 bg-orange-400"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-white/50 text-xs">
            <span>0°</span>
            <span className="text-orange-400">45° Trigger</span>
            <span>90°</span>
          </div>
          <button
            onClick={onAngleReset}
            className="w-full py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
          >
            Reset Card Position
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-white/70">{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cardAngle >= 45 ? 'bg-orange-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white/70">{cardAngle >= 45 ? 'Triggered' : 'Manual'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};