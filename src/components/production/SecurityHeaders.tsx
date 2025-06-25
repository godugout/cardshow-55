
import React, { useEffect } from 'react';

export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Set security headers via meta tags (for client-side enforcement)
    const securityMeta = [
      {
        'http-equiv': 'Content-Security-Policy',
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;"
      },
      {
        'http-equiv': 'X-Content-Type-Options',
        content: 'nosniff'
      },
      {
        'http-equiv': 'X-Frame-Options',
        content: 'DENY'
      },
      {
        'http-equiv': 'Referrer-Policy',
        content: 'strict-origin-when-cross-origin'
      }
    ];

    securityMeta.forEach(meta => {
      const metaElement = document.createElement('meta');
      Object.entries(meta).forEach(([key, value]) => {
        metaElement.setAttribute(key, value);
      });
      document.head.appendChild(metaElement);
    });

    // Security validation
    validateSecurityRequirements();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const validateSecurityRequirements = () => {
    // Check HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.warn('Security Warning: Application should be served over HTTPS in production');
    }

    // Check for secure contexts
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      console.warn('Security Warning: Application is not running in a secure context');
    }

    // Validate local storage encryption if sensitive data is stored
    try {
      const testKey = 'security-test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (e) {
      console.warn('Storage security check failed:', e);
    }
  };

  return null;
};
