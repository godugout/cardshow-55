
import { useEffect } from 'react';

interface CriticalResource {
  href: string;
  as: string;
  type?: string;
  crossorigin?: string;
}

const CRITICAL_RESOURCES: CriticalResource[] = [
  {
    href: '/crd-logo-gradient.png',
    as: 'image',
    type: 'image/png'
  },
  {
    href: '/cardshow-manifest.json',
    as: 'fetch',
    type: 'application/json',
    crossorigin: 'anonymous'
  }
];

export const CriticalResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical resources
    CRITICAL_RESOURCES.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) {
        link.type = resource.type;
      }
      
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }
      
      // Add to head if not already present
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        document.head.appendChild(link);
      }
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });

    // DNS prefetch for likely domains
    const dnsPrefetchDomains = [
      'https://supabase.co',
      'https://lovable.dev',
    ];

    dnsPrefetchDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

  }, []);

  return null; // This component doesn't render anything
};
