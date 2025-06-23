
import { useState, useEffect, useCallback } from 'react';
import type { DeviceCapabilities } from './useDeviceCapabilities';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  isThrottling: boolean;
}

export interface QualitySettings {
  renderScale: number;
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  antialiasing: boolean;
  particleCount: number;
  textureQuality: 'low' | 'medium' | 'high';
  enableEffects: boolean;
}

export const usePerformanceMonitor = (capabilities: DeviceCapabilities) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
    isThrottling: false
  });

  const [qualitySettings, setQualitySettings] = useState<QualitySettings>(() => {
    // Initial quality based on device tier
    switch (capabilities.tier) {
      case 'ultra':
        return {
          renderScale: 1.0,
          shadowQuality: 'high',
          antialiasing: true,
          particleCount: 100,
          textureQuality: 'high',
          enableEffects: true
        };
      case 'high':
        return {
          renderScale: 1.0,
          shadowQuality: 'medium',
          antialiasing: true,
          particleCount: 50,
          textureQuality: 'high',
          enableEffects: true
        };
      case 'medium':
        return {
          renderScale: 0.8,
          shadowQuality: 'low',
          antialiasing: false,
          particleCount: 25,
          textureQuality: 'medium',
          enableEffects: false
        };
      case 'low':
        return {
          renderScale: 0.6,
          shadowQuality: 'off',
          antialiasing: false,
          particleCount: 0,
          textureQuality: 'low',
          enableEffects: false
        };
      default:
        return {
          renderScale: 0.5,
          shadowQuality: 'off',
          antialiasing: false,
          particleCount: 0,
          textureQuality: 'low',
          enableEffects: false
        };
    }
  });

  const [frameTimeHistory, setFrameTimeHistory] = useState<number[]>([]);

  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
    
    // Track frame times for performance analysis
    if (newMetrics.frameTime) {
      setFrameTimeHistory(prev => {
        const updated = [...prev, newMetrics.frameTime!];
        return updated.slice(-60); // Keep last 60 frames (1 second at 60fps)
      });
    }
  }, []);

  const adjustQuality = useCallback((direction: 'up' | 'down') => {
    setQualitySettings(prev => {
      const newSettings = { ...prev };
      
      if (direction === 'down') {
        // Reduce quality
        if (newSettings.renderScale > 0.5) {
          newSettings.renderScale = Math.max(0.5, newSettings.renderScale - 0.1);
        } else if (newSettings.shadowQuality !== 'off') {
          const shadowLevels: QualitySettings['shadowQuality'][] = ['high', 'medium', 'low', 'off'];
          const currentIndex = shadowLevels.indexOf(newSettings.shadowQuality);
          newSettings.shadowQuality = shadowLevels[Math.min(currentIndex + 1, shadowLevels.length - 1)];
        } else if (newSettings.antialiasing) {
          newSettings.antialiasing = false;
        } else if (newSettings.particleCount > 0) {
          newSettings.particleCount = Math.max(0, newSettings.particleCount - 10);
        } else if (newSettings.enableEffects) {
          newSettings.enableEffects = false;
        }
      } else {
        // Increase quality (carefully)
        if (!newSettings.enableEffects && capabilities.tier !== 'fallback') {
          newSettings.enableEffects = true;
        } else if (newSettings.particleCount < 50 && capabilities.tier !== 'low') {
          newSettings.particleCount = Math.min(50, newSettings.particleCount + 10);
        } else if (!newSettings.antialiasing && capabilities.tier === 'ultra') {
          newSettings.antialiasing = true;
        }
      }
      
      return newSettings;
    });
  }, [capabilities.tier]);

  // Auto-adjust quality based on performance
  useEffect(() => {
    if (frameTimeHistory.length >= 30) { // Wait for enough samples
      const avgFrameTime = frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length;
      const targetFrameTime = capabilities.isMobile ? 33.33 : 16.67; // 30fps mobile, 60fps desktop
      
      if (avgFrameTime > targetFrameTime * 1.5) {
        // Performance is poor, reduce quality
        adjustQuality('down');
        setFrameTimeHistory([]); // Reset history after adjustment
      } else if (avgFrameTime < targetFrameTime * 0.8 && capabilities.tier !== 'fallback') {
        // Performance is good, potentially increase quality
        adjustQuality('up');
        setFrameTimeHistory([]);
      }
    }
  }, [frameTimeHistory, capabilities.isMobile, capabilities.tier, adjustQuality]);

  return {
    metrics,
    qualitySettings,
    updateMetrics,
    adjustQuality
  };
};
