
import React, { useEffect } from 'react';
import { useDebugContext } from '@/contexts/DebugContext';
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics';
import { useAdaptiveOptimizations } from './hooks/useAdaptiveOptimizations';
import { PerformanceDisplay } from './components/PerformanceDisplay';
import {
  preloadCriticalResources,
  setupImageOptimization,
  setup3DOptimization,
  setupMemoryManagement
} from './utils/performanceUtils';

export const PerformanceOptimizer: React.FC = () => {
  const { isDebugMode } = useDebugContext();
  const { metrics } = usePerformanceMetrics();
  const { optimizations } = useAdaptiveOptimizations();

  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  const initializePerformanceOptimizations = () => {
    preloadCriticalResources();
    setupImageOptimization();
    setup3DOptimization();
    setupMemoryManagement();
  };

  if (!isDebugMode) return null;

  return <PerformanceDisplay metrics={metrics} />;
};
