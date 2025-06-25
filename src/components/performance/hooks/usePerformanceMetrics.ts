
import { useState, useEffect } from 'react';
import { PerformanceMetrics } from '../types';

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    startPerformanceMonitoring();
  }, []);

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

  return { metrics };
};
