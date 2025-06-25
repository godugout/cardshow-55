
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/crd-logo-gradient.png',
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.png') ? 'image' : 'fetch';
    document.head.appendChild(link);
  });
};

export const setupImageOptimization = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

export const setup3DOptimization = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    const isMobileGPU = /Adreno|Mali|PowerVR/i.test(renderer);
    const isLowEndGPU = /4[0-9][0-9]|5[0-9][0-9]/.test(renderer);
    
    if (isMobileGPU || isLowEndGPU) {
      document.documentElement.style.setProperty('--3d-quality', 'medium');
    }
  }
};

export const setupMemoryManagement = () => {
  if ('memory' in performance) {
    const memoryInfo = (performance as any).memory;
    const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
    
    if (usageRatio > 0.8) {
      triggerMemoryOptimizations();
    }
  }
};

export const triggerMemoryOptimizations = () => {
  caches.open('cardshow-images-v1').then(cache => {
    cache.keys().then(keys => {
      const recentKeys = keys.slice(-50);
      keys.forEach(key => {
        if (!recentKeys.includes(key)) {
          cache.delete(key);
        }
      });
    });
  });
};
