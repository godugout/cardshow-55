import React, { useEffect, useState } from 'react';
import { AlertTriangle, Zap, Clock, Activity } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  imageLoadTime: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  threshold?: {
    fps: number;
    memory: number;
    renderTime: number;
  };
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  threshold = { fps: 30, memory: 50, renderTime: 16 }
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    imageLoadTime: 0
  });
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const measurePerformance = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        const memoryInfo = (performance as any).memory;
        
        const newMetrics: PerformanceMetrics = {
          fps,
          memoryUsage: memoryInfo ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100) : 0,
          renderTime: now - lastTime,
          imageLoadTime: 0 // Would be tracked separately
        };

        setMetrics(newMetrics);

        // Check for performance issues
        const newWarnings: string[] = [];
        if (fps < threshold.fps) {
          newWarnings.push(`Low FPS: ${fps} (threshold: ${threshold.fps})`);
        }
        if (newMetrics.memoryUsage > threshold.memory) {
          newWarnings.push(`High memory usage: ${newMetrics.memoryUsage}% (threshold: ${threshold.memory}%)`);
        }

        setWarnings(newWarnings);

        frameCount = 0;
        lastTime = now;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled, threshold]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-crd-dark/90 backdrop-blur-sm border border-crd-mediumGray rounded-lg p-3 text-xs text-crd-white">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-crd-green" />
        <span className="font-semibold">Performance</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            FPS:
          </span>
          <span className={metrics.fps < threshold.fps ? 'text-red-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Memory:
          </span>
          <span className={metrics.memoryUsage > threshold.memory ? 'text-red-400' : 'text-green-400'}>
            {metrics.memoryUsage}%
          </span>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="mt-2 pt-2 border-t border-crd-mediumGray">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};