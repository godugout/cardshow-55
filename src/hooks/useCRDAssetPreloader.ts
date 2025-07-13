
import { useEffect, useState, useRef } from 'react';
import { useCRDEditor } from '@/contexts/CRDEditorContext';

// Updated critical CRD assets that actually exist or use placeholders
const CRITICAL_ASSETS = [
  // Use placeholder images from unsplash instead of non-existent API endpoints
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop',
  
  // Use existing placeholder for missing textures
  '/placeholder.svg'
];

// Create mock JSON data for materials that don't exist
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

export const useCRDAssetPreloader = () => {
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [totalAssets] = useState(CRITICAL_ASSETS.length);
  const [isComplete, setIsComplete] = useState(false);
  const { addPreloadedAsset } = useCRDEditor();
  const hasStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Prevent multiple simultaneous preloading processes
    if (hasStartedRef.current) {
      console.log('🔄 CRD Asset preloader already running, skipping duplicate');
      return;
    }

    hasStartedRef.current = true;
    abortControllerRef.current = new AbortController();
    
    let loadedCount = 0;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        // Check if operation was aborted
        if (abortControllerRef.current?.signal.aborted) {
          resolve();
          return;
        }

        if (url.includes('unsplash.com') || url.endsWith('.svg') || url.endsWith('.jpg') || url.endsWith('.png')) {
          // Preload images
          const img = new Image();
          img.onload = () => {
            if (!abortControllerRef.current?.signal.aborted) {
              loadedCount++;
              setLoadedAssets(loadedCount);
              addPreloadedAsset(url);
            }
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to preload image: ${url}`);
            if (!abortControllerRef.current?.signal.aborted) {
              loadedCount++;
              setLoadedAssets(loadedCount);
              // Still mark as "loaded" to prevent hanging
              addPreloadedAsset(url);
            }
            resolve();
          };
          img.src = url;
        } else {
          // For other assets, just mark as loaded immediately
          if (!abortControllerRef.current?.signal.aborted) {
            loadedCount++;
            setLoadedAssets(loadedCount);
            addPreloadedAsset(url);
          }
          resolve();
        }
      });
    };

    // Preload all critical assets with abort support
    Promise.all(CRITICAL_ASSETS.map(preloadAsset))
      .then(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          // Cache mock materials in memory
          (window as any).__CRD_MATERIALS__ = MOCK_MATERIALS;
          
          setIsComplete(true);
          console.log('✅ All CRD assets preloaded successfully');
        }
      })
      .catch(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsComplete(true);
          console.log('⚠️ CRD asset preloading completed with some errors');
        }
      });

    // Also preload fabric.js if not already loaded (only once)
    if (!(window as any).fabric && !(window as any).__FABRIC_LOADING__) {
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [addPreloadedAsset]);

  return {
    loadedAssets,
    totalAssets,
    isComplete,
    progress: Math.round((loadedAssets / totalAssets) * 100)
  };
};
