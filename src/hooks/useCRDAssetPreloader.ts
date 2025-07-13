
import { useEffect, useState } from 'react';
import { useCRDEditor } from '@/contexts/CRDEditorContext';
import AssetPreloaderManager from '@/utils/AssetPreloaderSingleton';

// Only use placeholder images that actually exist
const CRITICAL_ASSETS = [
  // Use placeholder instead of non-existent assets
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg'
];

// Mock materials data in memory (no network requests)
const MOCK_MATERIALS = {
  holographic: {
    name: 'Holographic',
    type: 'special',
    effects: ['rainbow', 'shimmer'],
    intensity: 0.8
  },
  foil: {
    name: 'Foil',
    type: 'metallic', 
    effects: ['shine', 'reflection'],
    intensity: 0.6
  }
};

interface UseCRDAssetPreloaderOptions {
  enabled?: boolean;
}

export const useCRDAssetPreloader = (options: UseCRDAssetPreloaderOptions = {}) => {
  const { enabled = true } = options;
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [totalAssets] = useState(CRITICAL_ASSETS.length);
  const [isComplete, setIsComplete] = useState(false);
  const { addPreloadedAsset } = useCRDEditor();
  const manager = AssetPreloaderManager.getInstance();

  useEffect(() => {
    // If disabled or already complete, skip entirely
    if (!enabled || manager.isPreloadingComplete()) {
      setIsComplete(true);
      setLoadedAssets(totalAssets);
      return;
    }

    // Prevent multiple simultaneous preloading processes
    if (manager.isCurrentlyPreloading()) {
      console.log('🔄 CRD Asset preloader already running, skipping duplicate');
      return;
    }

    manager.startPreloading();
    const abortController = new AbortController();
    manager.setAbortController(abortController);
    
    let loadedCount = 0;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        // Check if operation was aborted
        if (abortController.signal.aborted) {
          resolve();
          return;
        }

        // Check if already loaded
        if (manager.hasAsset(url)) {
          loadedCount++;
          setLoadedAssets(loadedCount);
          resolve();
          return;
        }

        // Only try to load placeholder.svg, skip others silently
        if (url === '/placeholder.svg') {
          const img = new Image();
          img.onload = () => {
            if (!abortController.signal.aborted) {
              loadedCount++;
              setLoadedAssets(loadedCount);
              addPreloadedAsset(url);
              manager.addPreloadedAsset(url);
            }
            resolve();
          };
          img.onerror = () => {
            // Fail silently for placeholder
            if (!abortController.signal.aborted) {
              loadedCount++;
              setLoadedAssets(loadedCount);
              addPreloadedAsset(url);
              manager.addPreloadedAsset(url);
            }
            resolve();
          };
          img.src = url;
        } else {
          // For other assets, just mark as loaded immediately
          if (!abortController.signal.aborted) {
            loadedCount++;
            setLoadedAssets(loadedCount);
            addPreloadedAsset(url);
            manager.addPreloadedAsset(url);
          }
          resolve();
        }
      });
    };

    // Preload all critical assets
    Promise.all(CRITICAL_ASSETS.map(preloadAsset))
      .then(() => {
        if (!abortController.signal.aborted) {
          // Cache mock materials in memory (no network requests)
          (window as any).__CRD_MATERIALS__ = MOCK_MATERIALS;
          
          setIsComplete(true);
          manager.completePreloading();
          console.log('✅ All CRD assets preloaded successfully');
        }
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setIsComplete(true);
          manager.completePreloading();
          console.log('⚠️ CRD asset preloading completed with some errors');
        }
      });

    // Preload fabric.js only once globally
    if (typeof window !== 'undefined' && !(window as any).fabric && !(window as any).__FABRIC_LOADING__) {
      (window as any).__FABRIC_LOADING__ = true;
      import('fabric').then(() => {
        console.log('✅ Fabric.js preloaded');
        (window as any).__FABRIC_LOADING__ = false;
      }).catch(err => {
        console.warn('Failed to preload Fabric.js:', err);
        (window as any).__FABRIC_LOADING__ = false;
      });
    }

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [enabled, addPreloadedAsset, totalAssets, manager]);

  return {
    loadedAssets,
    totalAssets,
    isComplete,
    progress: Math.round((loadedAssets / totalAssets) * 100)
  };
};
