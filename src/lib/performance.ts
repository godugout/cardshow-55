
interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface DeviceInfo {
  isMobile: boolean;
  platform: string;
  userAgent: string;
  memory?: number;
  cores?: number;
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private deviceInfo: DeviceInfo;

  constructor() {
    this.deviceInfo = this.collectDeviceInfo();
    this.setupPerformanceObserver();
    this.trackNavigationTiming();
  }

  private collectDeviceInfo(): DeviceInfo {
    const info: DeviceInfo = {
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    };

    // Add memory info if available
    if ('memory' in performance) {
      info.memory = (performance as any).memory?.usedJSHeapSize;
    }

    // Add CPU cores if available
    if ('hardwareConcurrency' in navigator) {
      info.cores = navigator.hardwareConcurrency;
    }

    // Add connection info if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        info.connection = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
      }
    }

    return info;
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe paint metrics
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint observer not supported');
      }

      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Observe FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Observe CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private trackNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
        }
        
        // Report metrics after page load
        this.reportMetrics();
      }, 0);
    });
  }

  private reportMetrics() {
    const report = {
      metrics: this.metrics,
      deviceInfo: this.deviceInfo,
      timestamp: Date.now(),
      url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      console.log('Metrics:', this.metrics);
      console.log('Device Info:', this.deviceInfo);
      console.groupEnd();
    }

    // Send to analytics endpoint
    this.sendToAnalytics(report);
  }

  private async sendToAnalytics(report: any) {
    try {
      // Send to your analytics service
      // This could be Google Analytics, Supabase, or custom endpoint
      console.log('Performance report:', report);
      
      // Example: Send to Supabase function
      // await supabase.functions.invoke('track-performance', { body: report });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getDeviceInfo(): DeviceInfo {
    return { ...this.deviceInfo };
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor();

// Helper function to get performance budget status
export const getPerformanceBudgetStatus = (metrics: PerformanceMetrics) => {
  const budgets = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 800, // 800ms
  };

  const status: Record<string, 'good' | 'needs-improvement' | 'poor'> = {};

  Object.entries(budgets).forEach(([metric, budget]) => {
    const value = metrics[metric as keyof PerformanceMetrics];
    if (value === undefined) {
      status[metric] = 'good';
      return;
    }

    if (metric === 'cls') {
      status[metric] = value <= budget ? 'good' : value <= budget * 2 ? 'needs-improvement' : 'poor';
    } else {
      status[metric] = value <= budget ? 'good' : value <= budget * 1.5 ? 'needs-improvement' : 'poor';
    }
  });

  return status;
};
