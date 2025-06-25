
import { useState, useEffect } from 'react';
import { OptimizationSettings } from '../types';

export const useAdaptiveOptimizations = () => {
  const [optimizations, setOptimizations] = useState<OptimizationSettings>({
    enableImageOptimization: true,
    enable3DOptimization: true,
    enableOfflineMode: true,
    adaptiveQuality: true,
    batteryOptimization: true,
  });

  useEffect(() => {
    setupAdaptiveOptimizations();
  }, []);

  const setupAdaptiveOptimizations = () => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryOptimization = () => {
          if (battery.level < 0.2 || !battery.charging) {
            setOptimizations(prev => ({
              ...prev,
              batteryOptimization: true,
              adaptiveQuality: true
            }));
            
            document.documentElement.style.setProperty('--animation-duration', '0.6s');
          }
        };

        battery.addEventListener('levelchange', updateBatteryOptimization);
        battery.addEventListener('chargingchange', updateBatteryOptimization);
        updateBatteryOptimization();
      });
    }

    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateNetworkOptimization = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setOptimizations(prev => ({
            ...prev,
            enableImageOptimization: true,
            adaptiveQuality: true
          }));
        }
      };

      connection.addEventListener('change', updateNetworkOptimization);
      updateNetworkOptimization();
    }
  };

  return { optimizations };
};
