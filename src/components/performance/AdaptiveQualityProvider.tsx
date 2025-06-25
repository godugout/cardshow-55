
import React, { createContext, useContext, useEffect, useState } from 'react';

interface QualitySettings {
  imageQuality: 'low' | 'medium' | 'high';
  animationQuality: 'reduced' | 'normal' | 'enhanced';
  threeDQuality: 'low' | 'medium' | 'high';
  enableParticles: boolean;
  enableShadows: boolean;
  enableReflections: boolean;
}

interface AdaptiveQualityContextValue {
  settings: QualitySettings;
  updateSettings: (updates: Partial<QualitySettings>) => void;
  isAdaptive: boolean;
}

const AdaptiveQualityContext = createContext<AdaptiveQualityContextValue | null>(null);

interface AdaptiveQualityProviderProps {
  children: React.ReactNode;
}

export const AdaptiveQualityProvider: React.FC<AdaptiveQualityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<QualitySettings>({
    imageQuality: 'high',
    animationQuality: 'enhanced',
    threeDQuality: 'high',
    enableParticles: true,
    enableShadows: true,
    enableReflections: true,
  });
  const [isAdaptive, setIsAdaptive] = useState(true);

  useEffect(() => {
    detectDeviceCapabilities();
    setupAdaptiveMonitoring();
  }, []);

  const detectDeviceCapabilities = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const hasLimitedMemory = 'memory' in performance && (performance as any).memory.jsHeapSizeLimit < 1000000000; // Less than 1GB

    // Get GPU info
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    let isLowEndGPU = false;
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        isLowEndGPU = /Adreno 4|Mali-4|PowerVR SGX|Intel HD 3000|Intel HD 4000/i.test(renderer);
      }
    }

    // Adjust settings based on capabilities
    if (isMobile || isLowEnd || hasLimitedMemory || isLowEndGPU) {
      setSettings(prev => ({
        ...prev,
        imageQuality: isMobile ? 'medium' : 'high',
        animationQuality: isLowEnd ? 'reduced' : 'normal',
        threeDQuality: isLowEndGPU ? 'low' : 'medium',
        enableParticles: !isLowEnd,
        enableShadows: !isLowEndGPU,
        enableReflections: !isLowEndGPU,
      }));
    }
  };

  const setupAdaptiveMonitoring = () => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust quality based on FPS
        if (fps < 30) {
          setSettings(prev => ({
            ...prev,
            threeDQuality: 'low',
            animationQuality: 'reduced',
            enableParticles: false,
            enableShadows: false,
          }));
        } else if (fps < 45) {
          setSettings(prev => ({
            ...prev,
            threeDQuality: 'medium',
            animationQuality: 'normal',
            enableParticles: false,
          }));
        }
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Monitor battery level
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const handleBatteryChange = () => {
          if (battery.level < 0.2 && !battery.charging) {
            setSettings(prev => ({
              ...prev,
              animationQuality: 'reduced',
              threeDQuality: 'low',
              enableParticles: false,
              enableShadows: false,
              enableReflections: false,
            }));
          }
        };

        battery.addEventListener('levelchange', handleBatteryChange);
        battery.addEventListener('chargingchange', handleBatteryChange);
      });
    }

    // Monitor network connection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const handleConnectionChange = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setSettings(prev => ({
            ...prev,
            imageQuality: 'low',
          }));
        } else if (connection.effectiveType === '4g') {
          setSettings(prev => ({
            ...prev,
            imageQuality: 'high',
          }));
        }
      };

      connection.addEventListener('change', handleConnectionChange);
    }
  };

  const updateSettings = (updates: Partial<QualitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setIsAdaptive(false); // Disable adaptive mode when manually updated
  };

  return (
    <AdaptiveQualityContext.Provider value={{ settings, updateSettings, isAdaptive }}>
      {children}
    </AdaptiveQualityContext.Provider>
  );
};

export const useAdaptiveQuality = () => {
  const context = useContext(AdaptiveQualityContext);
  if (!context) {
    throw new Error('useAdaptiveQuality must be used within AdaptiveQualityProvider');
  }
  return context;
};
