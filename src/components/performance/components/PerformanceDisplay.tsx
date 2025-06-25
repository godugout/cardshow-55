
import React from 'react';
import { PerformanceMetrics } from '../types';

interface PerformanceDisplayProps {
  metrics: PerformanceMetrics | null;
}

export const PerformanceDisplay: React.FC<PerformanceDisplayProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="fixed left-4 top-[420px] bg-black/90 border border-gray-700 rounded-lg p-3 text-xs font-mono z-50 max-w-xs">
      <div className="text-[#00C851] font-semibold mb-2">Performance Monitor</div>
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
    </div>
  );
};
