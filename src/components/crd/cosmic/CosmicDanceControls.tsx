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
  { value: 4, label: '4x' },
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Enhanced Cosmic Trigger Notification - Above controls */}
      {hasTriggered && (
        <div className="mb-4 pointer-events-none">
          <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm rounded-xl px-6 py-3 text-white font-medium animate-pulse border border-orange-300/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              🌌 COSMIC ALIGNMENT INITIATED
            </div>
            <div className="text-xs opacity-80 mt-1">
              "My God, it's full of stars..."
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Frame Debug with Cinematic Info - Above controls */}
      <div className="mb-4 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1 border border-white/10">
          <div className="text-orange-300 font-semibold">COSMIC DANCE - Frame Data</div>
          <div>Progress: {Math.round(animationProgress * 100)}%</div>
          <div>Monolith Lean: {Math.round(cardAngle)}°</div>
          <div>Camera Distance: {cameraDistance.toFixed(1)} units</div>
          <div className={`${isOptimalZoom ? 'text-green-400' : 'text-yellow-400'}`}>
            Zoom: {isOptimalZoom ? 'OPTIMAL' : 'Too Far'} (need ≤4.0)
          </div>
          <div className={`${isOptimalPosition ? 'text-green-400' : 'text-yellow-400'}`}>
            Position: {isOptimalPosition ? 'CENTERED' : 'Off-Center'}
          </div>
          <div>Light Intensity: {(1 + animationProgress * 0.5).toFixed(1)}x</div>
          <div>Cosmic Warmth: {Math.round(animationProgress * 100)}%</div>
          <div className={`${hasTriggered ? 'text-green-400' : 'text-gray-400'}`}>
            Status: {hasTriggered ? 'ALIGNED & LOCKED' : 'MANUAL'}
          </div>
        </div>
      </div>

      {/* Collapse/Expand button when playing */}
      {isPlaying && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-2 w-full px-4 py-2 bg-black/80 border border-white/20 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-4 w-4" />
              Hide Controls
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Controls
            </>
          )}
        </button>
      )}

      <div className={`bg-black/80 backdrop-blur-sm rounded-2xl p-4 space-y-4 min-w-80 transition-all duration-300 ${
        shouldShowControls ? 'opacity-100 transform-none' : 'opacity-0 pointer-events-none transform translate-y-4'
      }`}>
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
          
          {/* Alignment Readiness Checklist */}
          <div className="space-y-2 mt-3">
            <div className="text-xs text-gray-400">Cosmic Alignment Readiness</div>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className={`flex items-center gap-2 ${cardAngle >= 45 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full ${cardAngle >= 45 ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>45° Monolith Lean {cardAngle >= 45 ? '✓' : `(${Math.round(cardAngle)}°)`}</span>
              </div>
              <div className={`flex items-center gap-2 ${isOptimalZoom ? 'text-green-400' : 'text-yellow-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isOptimalZoom ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>Optimal Zoom {isOptimalZoom ? '✓' : `(${cameraDistance.toFixed(1)} > 4.0)`}</span>
              </div>
              <div className={`flex items-center gap-2 ${isOptimalPosition ? 'text-green-400' : 'text-yellow-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isOptimalPosition ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>Centered Position {isOptimalPosition ? '✓' : '(off-center)'}</span>
              </div>
            </div>
            <div className={`text-xs p-2 rounded border ${
              cardAngle >= 45 && isOptimalZoom && isOptimalPosition
                ? 'bg-green-900/50 border-green-500 text-green-200'
                : 'bg-yellow-900/50 border-yellow-500 text-yellow-200'
            }`}>
              {cardAngle >= 45 && isOptimalZoom && isOptimalPosition
                ? '🌌 READY FOR COSMIC ALIGNMENT'
                : '⚙️ Adjust card position, zoom, and angle'
              }
            </div>
          </div>
          
          <button
            onClick={onAngleReset}
            disabled={hasTriggered}
            className={`w-full py-1 text-xs rounded transition-colors ${
              hasTriggered 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {hasTriggered ? 'Animation Running...' : 'Reset Card Position'}
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`} />
            <span className="text-white/70">{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hasTriggered ? 'bg-green-500 animate-pulse' : cardAngle >= 45 ? 'bg-orange-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white/70">{hasTriggered ? 'Locked' : cardAngle >= 45 ? 'Triggered' : 'Manual'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};