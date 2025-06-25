
export interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  tti: number;
  memoryUsage?: number;
  connectionType?: string;
}

export interface OptimizationSettings {
  enableImageOptimization: boolean;
  enable3DOptimization: boolean;
  enableOfflineMode: boolean;
  adaptiveQuality: boolean;
  batteryOptimization: boolean;
}
