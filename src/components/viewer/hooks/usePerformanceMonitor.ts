import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced update function to prevent excessive re-renders
  const debouncedUpdate = useCallback((newMetrics: PerformanceMetrics) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      setMetrics(prev => {
        // Only update if there's a significant change
        const fpsChange = Math.abs(prev.fps - newMetrics.fps);
        const performanceStateChange = prev.isLowPerformance !== newMetrics.isLowPerformance;
        
        if (fpsChange > 5 || performanceStateChange) {
          return newMetrics;
        }
        return prev;
      });
    }, 500); // Update at most every 500ms
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      frameCountRef.current++;
      frameTimesRef.current.push(delta);
      
      // Keep only the last 30 frames for analysis (reduced from 60)
      if (frameTimesRef.current.length > 30) {
        frameTimesRef.current.shift();
      }
      
      // Calculate metrics every 30 frames instead of 60
      if (frameCountRef.current % 30 === 0 && frameTimesRef.current.length >= 10) {
        const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);
        const isLowPerformance = fps < 25 || avgFrameTime > 40; // Adjusted thresholds
        
        debouncedUpdate({
          fps,
          frameTime: avgFrameTime,
          isLowPerformance
        });
      }
      
      lastTimeRef.current = now;
      animationFrameId = requestAnimationFrame(measurePerformance);
    };

    animationFrameId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [debouncedUpdate]);

  return metrics;
};
