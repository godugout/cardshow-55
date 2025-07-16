import React, { useState } from 'react';
import { usePerformanceOptimizer } from '@/hooks/usePerformanceOptimizer';
import { Monitor, Zap, ZapOff, Settings, Eye, EyeOff } from 'lucide-react';

interface Props {
  showInDevelopment?: boolean;
}

export const PerformanceMonitor: React.FC<Props> = ({ 
  showInDevelopment = process.env.NODE_ENV === 'development' 
}) => {
  const { 
    metrics, 
    settings, 
    enableHighPerformanceMode, 
    enablePowerSaveMode 
  } = usePerformanceOptimizer();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!showInDevelopment) return null;

  const getFPSColor = () => {
    if (metrics.fps >= 55) return 'text-green-400';
    if (metrics.fps >= 45) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = () => {
    if (metrics.memoryUsage < 50) return 'text-green-400';
    if (metrics.memoryUsage < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 p-2 bg-black/80 text-white rounded-lg hover:bg-black/90 transition-colors"
        title="Toggle Performance Monitor"
      >
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {/* Performance Monitor Panel */}
      {isVisible && (
        <div className="bg-black/90 text-white p-4 rounded-lg border border-gray-600 min-w-[250px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Monitor size={16} />
              <span className="font-bold">Performance</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              <Settings size={14} />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className={getFPSColor()}>
                {Math.round(metrics.fps)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={getMemoryColor()}>
                {Math.round(metrics.memoryUsage)}MB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Device:</span>
              <span className={metrics.isLowEndDevice ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.isLowEndDevice ? 'Low-end' : 'High-end'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Connection:</span>
              <span className={metrics.connectionSpeed === 'fast' ? 'text-green-400' : 'text-yellow-400'}>
                {metrics.connectionSpeed}
              </span>
            </div>
            {metrics.batteryLevel !== undefined && (
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className={metrics.batteryLevel > 0.2 ? 'text-green-400' : 'text-red-400'}>
                  {Math.round(metrics.batteryLevel * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={enableHighPerformanceMode}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
              title="Enable High Performance Mode"
            >
              <Zap size={12} />
              High
            </button>
            <button
              onClick={enablePowerSaveMode}
              className="flex items-center gap-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs transition-colors"
              title="Enable Power Save Mode"
            >
              <ZapOff size={12} />
              Save
            </button>
          </div>

          {/* Expanded Settings */}
          {isExpanded && (
            <div className="border-t border-gray-600 pt-3 space-y-2">
              <div className="text-xs text-gray-300 mb-2">Current Settings:</div>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex justify-between">
                  <span>Animations:</span>
                  <span className={settings.animationsEnabled ? 'text-green-400' : 'text-red-400'}>
                    {settings.animationsEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>3D Effects:</span>
                  <span className={settings.enable3DEffects ? 'text-green-400' : 'text-red-400'}>
                    {settings.enable3DEffects ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Particles:</span>
                  <span className={settings.enableParticleEffects ? 'text-green-400' : 'text-red-400'}>
                    {settings.enableParticleEffects ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Animations:</span>
                  <span className="text-blue-400">{settings.maxConcurrentAnimations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Image Quality:</span>
                  <span className="text-blue-400">{settings.imageQuality}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};