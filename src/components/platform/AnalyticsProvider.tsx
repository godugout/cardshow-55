
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

interface AnalyticsContextType {
  track: (eventName: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  page: (pageName: string, properties?: Record<string, any>) => void;
  getMetrics: () => AnalyticsEvent[];
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userId, setUserId] = useState<string>();
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    // Track page load
    track('page_load', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    // Track performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            track('performance', {
              loadTime: navigation.loadEventEnd - navigation.fetchStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
              firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
            });
          }
        }, 1000);
      });
    }

    // Track errors
    const handleError = (event: ErrorEvent) => {
      track('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      track('unhandled_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const track = (eventName: string, properties: Record<string, any> = {}) => {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
      },
      timestamp: new Date(),
      userId,
      sessionId,
    };

    setEvents(prev => [...prev, event].slice(-1000)); // Keep last 1000 events

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your analytics service
      console.log('Analytics Event:', event);
    }
  };

  const identify = (newUserId: string, traits: Record<string, any> = {}) => {
    setUserId(newUserId);
    track('identify', { userId: newUserId, ...traits });
  };

  const page = (pageName: string, properties: Record<string, any> = {}) => {
    track('page_view', { page: pageName, ...properties });
  };

  const getMetrics = () => events;

  const value: AnalyticsContextType = {
    track,
    identify,
    page,
    getMetrics,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};
