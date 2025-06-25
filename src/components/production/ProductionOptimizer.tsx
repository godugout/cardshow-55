
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const ProductionOptimizer: React.FC = () => {
  useEffect(() => {
    // Initialize production optimizations
    initializeOptimizations();
    
    // Set up performance monitoring
    monitorCoreWebVitals();
    
    // Configure error tracking
    setupErrorTracking();
    
    // Initialize analytics
    initializeAnalytics();
  }, []);

  const initializeOptimizations = () => {
    // Preload critical resources
    const criticalResources = [
      '/crd-logo-gradient.png',
      // Add other critical assets
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.png') ? 'image' : 'fetch';
      document.head.appendChild(link);
    });

    // Optimize images loading
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-lazy]');
      images.forEach((img: any) => {
        img.src = img.dataset.lazy;
        img.loading = 'lazy';
      });
    }

    // Enable service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  };

  const monitorCoreWebVitals = () => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const metrics: PerformanceMetrics = {};
        
        list.getEntries().forEach((entry) => {
          switch (entry.name) {
            case 'first-contentful-paint':
              metrics.fcp = entry.startTime;
              break;
            case 'largest-contentful-paint':
              metrics.lcp = entry.startTime;
              break;
          }
        });

        // Report metrics to analytics
        reportMetrics(metrics);
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      // Monitor FID
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const metrics: PerformanceMetrics = {
            fid: entry.processingStart - entry.startTime
          };
          reportMetrics(metrics);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        const metrics: PerformanceMetrics = { cls: clsValue };
        reportMetrics(metrics);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  };

  const setupErrorTracking = () => {
    window.addEventListener('error', (event) => {
      reportError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      reportError({
        message: 'Unhandled Promise Rejection',
        error: event.reason?.toString()
      });
    });
  };

  const initializeAnalytics = () => {
    // Initialize Google Analytics or other analytics
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  };

  const reportMetrics = (metrics: PerformanceMetrics) => {
    // Send to analytics service
    if (typeof window.gtag === 'function') {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value !== undefined) {
          window.gtag('event', 'web_vital', {
            metric_name: key,
            metric_value: Math.round(value),
            metric_id: key
          });
        }
      });
    }

    // Log performance issues
    if (metrics.lcp && metrics.lcp > 2500) {
      console.warn('LCP performance issue detected:', metrics.lcp);
    }
    if (metrics.fid && metrics.fid > 100) {
      console.warn('FID performance issue detected:', metrics.fid);
    }
    if (metrics.cls && metrics.cls > 0.1) {
      console.warn('CLS performance issue detected:', metrics.cls);
    }
  };

  const reportError = (errorData: any) => {
    // Send to error tracking service
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'exception', {
        description: errorData.message,
        fatal: false
      });
    }

    console.error('Production error:', errorData);
  };

  return null;
};
