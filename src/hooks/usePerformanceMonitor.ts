
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime?: number;
  updateCount: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const mountTime = useRef<number | null>(null);
  const updateCount = useRef<number>(0);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      mountTime.current = Date.now() - renderStartTime.current;
      isFirstRender.current = false;
      console.log(`[Performance] ${componentName} mounted in ${mountTime.current}ms`);
    } else {
      updateCount.current++;
      const renderTime = Date.now() - renderStartTime.current;
      console.log(`[Performance] ${componentName} updated #${updateCount.current} in ${renderTime}ms`);
    }
  });

  useEffect(() => {
    renderStartTime.current = Date.now();
  });

  const logMetrics = (): PerformanceMetrics => {
    const metrics: PerformanceMetrics = {
      componentName,
      renderTime: Date.now() - renderStartTime.current,
      mountTime: mountTime.current || undefined,
      updateCount: updateCount.current
    };
    
    console.log(`[Performance Metrics]`, metrics);
    return metrics;
  };

  return { logMetrics };
};
