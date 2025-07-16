import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  isLowEndDevice: boolean;
  connectionSpeed: 'slow' | 'fast';
  batteryLevel?: number;
  devicePixelRatio: number;
}

interface OptimizationSettings {
  animationsEnabled: boolean;
  highQualityImages: boolean;
  enableParticleEffects: boolean;
  enable3DEffects: boolean;
  maxConcurrentAnimations: number;
  imageQuality: 'low' | 'medium' | 'high';
}

export const usePerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    isLowEndDevice: false,
    connectionSpeed: 'fast',
    devicePixelRatio: 1
  });

  const [settings, setSettings] = useState<OptimizationSettings>({
    animationsEnabled: true,
    highQualityImages: true,
    enableParticleEffects: true,
    enable3DEffects: true,
    maxConcurrentAnimations: 10,
    imageQuality: 'high'
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Connection speed detection
    const connection = (navigator as any).connection;
    const connectionSpeed: 'slow' | 'fast' = connection?.effectiveType === '4g' || 
                           connection?.downlink > 1.5 ? 'fast' : 'slow';

    // Low-end device detection
    const isLowEndDevice = hardwareConcurrency <= 2 || 
                          deviceMemory <= 2 || 
                          devicePixelRatio < 2;

    return {
      isLowEndDevice,
      connectionSpeed,
      devicePixelRatio
    };
  }, []);

  // Monitor FPS
  const measureFPS = useCallback(() => {
    const measure = () => {
      frameCountRef.current++;
      const now = performance.now();
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        
        setMetrics(prev => ({ ...prev, fps: avgFPS }));
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }, []);

  // Memory monitoring
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryMB = memory.usedJSHeapSize / 1024 / 1024;
      setMetrics(prev => ({ ...prev, memoryUsage: memoryMB }));
    }
  }, []);

  // Auto-adjust settings based on performance
  const autoOptimize = useCallback(() => {
    const { fps, memoryUsage, isLowEndDevice } = metrics;
    
    let newSettings = { ...settings };
    
    // FPS-based optimizations
    if (fps < 45) {
      newSettings.animationsEnabled = false;
      newSettings.enableParticleEffects = false;
      newSettings.maxConcurrentAnimations = 3;
      newSettings.imageQuality = 'medium';
    } else if (fps < 55) {
      newSettings.enable3DEffects = false;
      newSettings.maxConcurrentAnimations = 5;
      newSettings.imageQuality = 'medium';
    }
    
    // Memory-based optimizations
    if (memoryUsage > 100) {
      newSettings.highQualityImages = false;
      newSettings.enableParticleEffects = false;
      newSettings.imageQuality = 'low';
    }
    
    // Device-based optimizations
    if (isLowEndDevice) {
      newSettings.animationsEnabled = true; // Keep some animations for UX
      newSettings.enableParticleEffects = false;
      newSettings.enable3DEffects = false;
      newSettings.maxConcurrentAnimations = 3;
      newSettings.imageQuality = 'medium';
    }
    
    setSettings(newSettings);
  }, [metrics, settings]);

  // Battery API support
  const monitorBattery = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setMetrics(prev => ({ 
          ...prev, 
          batteryLevel: battery.level 
        }));
        
        // Enable power saving mode if battery is low
        if (battery.level < 0.2) {
          setSettings(prev => ({
            ...prev,
            animationsEnabled: false,
            enableParticleEffects: false,
            enable3DEffects: false,
            imageQuality: 'low'
          }));
        }
      } catch (error) {
        console.log('Battery API not supported');
      }
    }
  }, []);

  // Initialize performance monitoring - SIMPLIFIED TO PREVENT CRASHES
  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setMetrics(prev => ({ ...prev, ...capabilities }));
    
    // Disable continuous monitoring temporarily to stabilize app
    // measureFPS();
    // monitorBattery();
    
    // Much longer intervals to reduce overhead
    // const memoryInterval = setInterval(measureMemory, 30000);
    // const optimizeInterval = setInterval(autoOptimize, 60000);
    
    // return () => {
    //   clearInterval(memoryInterval);
    //   clearInterval(optimizeInterval);
    // };
  }, [detectDeviceCapabilities]);

  // Manual override functions
  const enableHighPerformanceMode = useCallback(() => {
    setSettings({
      animationsEnabled: true,
      highQualityImages: true,
      enableParticleEffects: true,
      enable3DEffects: true,
      maxConcurrentAnimations: 15,
      imageQuality: 'high'
    });
  }, []);

  const enablePowerSaveMode = useCallback(() => {
    setSettings({
      animationsEnabled: false,
      highQualityImages: false,
      enableParticleEffects: false,
      enable3DEffects: false,
      maxConcurrentAnimations: 2,
      imageQuality: 'low'
    });
  }, []);

  return {
    metrics,
    settings,
    enableHighPerformanceMode,
    enablePowerSaveMode,
    manualOptimize: autoOptimize
  };
};