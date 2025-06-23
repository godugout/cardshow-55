
import React, { useEffect, useState } from 'react';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or for admin users
    const isDev = process.env.NODE_ENV === 'development';
    const isAdmin = localStorage.getItem('cardshow-admin') === 'true';
    
    if (isDev || isAdmin) {
      setIsVisible(true);
      measurePerformance();
    }
  }, []);

  const measurePerformance = () => {
    if ('performance' in window && 'PerformanceObserver' in window) {
      const metrics: Partial<PerformanceMetrics> = {};

      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
          }
        });
        updateMetrics(metrics);
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.lcp = lastEntry.startTime;
          updateMetrics(metrics);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
        updateMetrics(metrics);
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
        updateMetrics(metrics);
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.requestStart;
        updateMetrics(metrics);
      }
    }
  };

  const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
  };

  const getScoreColor = (metric: string, value: number) => {
    const thresholds = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'text-green-500';
    if (value <= threshold.needsImprovement) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isVisible || !metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-gray-700 rounded-lg p-3 text-xs font-mono z-50">
      <div className="flex items-center space-x-2 mb-2">
        <Activity className="w-4 h-4 text-[#00C851]" />
        <span className="text-white font-semibold">Performance</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">FCP:</span>
          <span className={getScoreColor('fcp', metrics.fcp)}>
            {metrics.fcp?.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">LCP:</span>
          <span className={getScoreColor('lcp', metrics.lcp)}>
            {metrics.lcp?.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">FID:</span>
          <span className={getScoreColor('fid', metrics.fid)}>
            {metrics.fid?.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">CLS:</span>
          <span className={getScoreColor('cls', metrics.cls)}>
            {metrics.cls?.toFixed(3)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">TTFB:</span>
          <span className={getScoreColor('ttfb', metrics.ttfb)}>
            {metrics.ttfb?.toFixed(0)}ms
          </span>
        </div>
      </div>
    </div>
  );
};
