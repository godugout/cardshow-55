import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface SecurityConfig {
  enableXSSProtection: boolean;
  enableCSRFProtection: boolean;
  enableRateLimiting: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireSpecialChar: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
}

interface SecurityContextType {
  config: SecurityConfig;
  isSecure: boolean;
  validateInput: (input: string) => boolean;
  sanitizeInput: (input: string) => string;
  checkRateLimit: (action: string) => boolean;
  generateCSRFToken: () => string;
}

interface SecurityProviderProps {
  children: ReactNode;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const defaultConfig: SecurityConfig = {
  enableXSSProtection: true,
  enableCSRFProtection: true,
  enableRateLimiting: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  passwordPolicy: {
    minLength: 8,
    requireSpecialChar: true,
    requireNumbers: true,
    requireUppercase: true,
  },
};

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [config] = useState<SecurityConfig>(defaultConfig);
  const [isSecure, setIsSecure] = useState(false);
  const [rateLimitMap, setRateLimitMap] = useState<Map<string, number[]>>(new Map());

  useEffect(() => {
    // Check security requirements
    const checkSecurity = () => {
      const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      setIsSecure(isHTTPS);
      
      if (!isHTTPS && window.location.hostname !== 'localhost') {
        toast.error('Insecure connection detected. Please use HTTPS.');
      }
    };

    checkSecurity();

    // Set up session timeout
    let sessionTimer: NodeJS.Timeout;
    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        toast.warning('Session expired. Please log in again.');
        // Trigger logout
        window.dispatchEvent(new CustomEvent('session-expired'));
      }, config.sessionTimeout);
    };

    // Reset timer on user activity
    const resetOnActivity = () => resetSessionTimer();
    document.addEventListener('mousedown', resetOnActivity);
    document.addEventListener('keydown', resetOnActivity);
    resetSessionTimer();

    return () => {
      clearTimeout(sessionTimer);
      document.removeEventListener('mousedown', resetOnActivity);
      document.removeEventListener('keydown', resetOnActivity);
    };
  }, [config.sessionTimeout]);

  const validateInput = (input: string): boolean => {
    if (!config.enableXSSProtection) return true;
    
    // Check for common XSS patterns
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ];
    
    return !xssPatterns.some(pattern => pattern.test(input));
  };

  const sanitizeInput = (input: string): string => {
    if (!config.enableXSSProtection) return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const checkRateLimit = (action: string): boolean => {
    if (!config.enableRateLimiting) return true;
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 10; // 10 requests per minute
    
    const timestamps = rateLimitMap.get(action) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (recentTimestamps.length >= maxRequests) {
      toast.error('Rate limit exceeded. Please try again later.');
      return false;
    }
    
    recentTimestamps.push(now);
    setRateLimitMap(prev => new Map(prev.set(action, recentTimestamps)));
    
    return true;
  };

  const generateCSRFToken = (): string => {
    if (!config.enableCSRFProtection) return '';
    
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const value: SecurityContextType = {
    config,
    isSecure,
    validateInput,
    sanitizeInput,
    checkRateLimit,
    generateCSRFToken,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};
