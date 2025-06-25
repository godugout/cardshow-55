
import React, { useEffect, useState } from 'react';
import { useDebugContext } from '@/contexts/DebugContext';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  tti: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface OptimizationSettings {
  enableImageOptimization: boolean;
  enable3DOptimization: boolean;
  enableOfflineMode: boolean;
  adaptiveQuality: boolean;
  batteryOptimization: boolean;
}

export const PerformanceOptimizer: React.FC = () => {
  const { isDebugMode } = useDebugContext();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [optimizations, setOptimizations] = useState<OptimizationSettings>({
    enableImageOptimization: true,
    enable3DOptimization: true,
    enableOfflineMode: true,
    adaptiveQuality: true,
    batteryOptimization: true,
  });

  useEffect(() => {
    initializePerformanceOptimizations();
    startPerformanceMonitoring();
    setupAdaptiveOptimizations();
  }, []);

  const initializePerformanceOptimizations = () => {
    preloadCriticalResources();
    setupImageOptimization();
    setup3DOptimization();
    setupMemoryManagement();
  };

  const preloadCriticalResources = () => {
    const criticalResources = [
      '/crd-logo-gradient.png',
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.png') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });
  };

  const setupImageOptimization = () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };

  const setup3DOptimization = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      
      const isMobileGPU = /Adreno|Mali|PowerVR/i.test(renderer);
      const isLowEndGPU = /4[0-9][0-9]|5[0-9][0-9]/.test(renderer);
      
      if (isMobileGPU || isLowEndGPU) {
        document.documentElement.style.setProperty('--3d-quality', 'medium');
      }
    }
  };

  const setupMemoryManagement = () => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      
      if (usageRatio > 0.8) {
        triggerMemoryOptimizations();
      }
    }
  };

  const triggerMemoryOptimizations = () => {
    caches.open('cardshow-images-v1').then(cache => {
      cache.keys().then(keys => {
        const recentKeys = keys.slice(-50);
        keys.forEach(key => {
          if (!recentKeys.includes(key)) {
            cache.delete(key);
          }
        });
      });
    });
  };

  const startPerformanceMonitoring = () => {
    // Try to use web-vitals if available, otherwise use manual measurement
    import('web-vitals').then(({ onCLS, onLCP }) => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Only use the available functions
      onCLS((metric) => {
        metrics.cls = metric.value;
        updateMetrics(metrics);
      });

      onLCP((metric) => {
        metrics.lcp = metric.value;
        updateMetrics(metrics);
      });

      // Get other metrics manually
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        updateMetrics(metrics);
      }
    }).catch(() => {
      measurePerformanceManually();
    });
  };

  const measurePerformanceManually = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics: PerformanceMetrics = {
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: navigation.responseStart - navigation.requestStart,
        tti: navigation.loadEventEnd - navigation.fetchStart,
      };
      setMetrics(metrics);
    }
  };

  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
  };

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

  if (!isDebugMode) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 border border-gray-700 rounded-lg p-3 text-xs font-mono z-50 max-w-xs">
      <div className="text-[#00C851] font-semibold mb-2">Performance Monitor</div>
      {metrics && (
        <div className="space-y-1 text-white">
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={metrics.lcp > 2500 ? 'text-red-400' : 'text-green-400'}>
              {metrics.lcp?.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={metrics.cls > 0.1 ? 'text-red-400' : 'text-green-400'}>
              {metrics.cls?.toFixed(3)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className={metrics.ttfb > 800 ? 'text-red-400' : 'text-green-400'}>
              {metrics.ttfb?.toFixed(0)}ms
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
