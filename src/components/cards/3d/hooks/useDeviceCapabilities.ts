
import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
  tier: 'ultra' | 'high' | 'medium' | 'low' | 'fallback';
  webglVersion: number;
  maxTextureSize: number;
  hasWebGPU: boolean;
  isMobile: boolean;
  batteryLevel?: number;
  thermalState?: 'nominal' | 'fair' | 'serious' | 'critical';
  gpuTier: 'high' | 'medium' | 'low' | 'integrated';
  memoryLimit: number;
}

export const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    tier: 'fallback',
    webglVersion: 0,
    maxTextureSize: 0,
    hasWebGPU: false,
    isMobile: false,
    gpuTier: 'low',
    memoryLimit: 512
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Basic device detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // WebGL detection
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const webglVersion = gl ? (canvas.getContext('webgl2') ? 2 : 1) : 0;
      
      let maxTextureSize = 0;
      let gpuTier: 'high' | 'medium' | 'low' | 'integrated' = 'low';
      
      if (gl) {
        maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          
          // GPU tier detection based on renderer string
          if (renderer.includes('RTX') || renderer.includes('RX 6') || renderer.includes('RX 7')) {
            gpuTier = 'high';
          } else if (renderer.includes('GTX') || renderer.includes('RX ') || renderer.includes('Radeon')) {
            gpuTier = 'medium';
          } else if (renderer.includes('Intel') || renderer.includes('Integrated')) {
            gpuTier = 'integrated';
          }
        }
      }

      // WebGPU detection
      const hasWebGPU = 'gpu' in navigator;

      // Memory estimation
      const memoryLimit = isMobile ? 
        (gpuTier === 'high' ? 2048 : gpuTier === 'medium' ? 1024 : 512) :
        (gpuTier === 'high' ? 8192 : gpuTier === 'medium' ? 4096 : 2048);

      // Tier calculation
      let tier: DeviceCapabilities['tier'] = 'fallback';
      
      if (webglVersion >= 2 && maxTextureSize >= 4096) {
        if (!isMobile && gpuTier === 'high') {
          tier = 'ultra';
        } else if (!isMobile && gpuTier === 'medium') {
          tier = 'high';
        } else if (isMobile && gpuTier !== 'integrated') {
          tier = 'medium';
        } else {
          tier = 'low';
        }
      } else if (webglVersion >= 1) {
        tier = 'low';
      }

      setCapabilities({
        tier,
        webglVersion,
        maxTextureSize,
        hasWebGPU,
        isMobile,
        gpuTier,
        memoryLimit
      });
    };

    detectCapabilities();

    // Battery API monitoring (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setCapabilities(prev => ({
            ...prev,
            batteryLevel: battery.level
          }));
        };
        
        battery.addEventListener('levelchange', updateBattery);
        updateBattery();
      });
    }

  }, []);

  return capabilities;
};
