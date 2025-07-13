import { useEffect, useState } from 'react';
import { useCRDEditor } from '@/contexts/CRDEditorContext';

// Critical CRD assets that should be preloaded
const CRITICAL_ASSETS = [
  // Template thumbnails
  '/api/templates/baseball-classic/thumbnail.jpg',
  '/api/templates/basketball-modern/thumbnail.jpg',
  '/api/templates/soccer-premium/thumbnail.jpg',
  
  // Common UI assets
  '/assets/icons/layers.svg',
  '/assets/icons/palette.svg',
  '/assets/icons/text.svg',
  
  // Default textures and materials
  '/assets/textures/card-base.jpg',
  '/assets/materials/holographic.json',
  '/assets/materials/foil.json'
];

export const useCRDAssetPreloader = () => {
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [totalAssets] = useState(CRITICAL_ASSETS.length);
  const [isComplete, setIsComplete] = useState(false);
  const { addPreloadedAsset } = useCRDEditor();

  useEffect(() => {
    let loadedCount = 0;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.svg')) {
          // Preload images
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            setLoadedAssets(loadedCount);
            addPreloadedAsset(url);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to preload image: ${url}`);
            loadedCount++;
            setLoadedAssets(loadedCount);
            resolve();
          };
          img.src = url;
        } else if (url.endsWith('.json')) {
          // Preload JSON assets
          fetch(url)
            .then(response => response.json())
            .then(() => {
              loadedCount++;
              setLoadedAssets(loadedCount);
              addPreloadedAsset(url);
              resolve();
            })
            .catch(() => {
              console.warn(`Failed to preload JSON: ${url}`);
              loadedCount++;
              setLoadedAssets(loadedCount);
              resolve();
            });
        } else {
          // For other assets, just mark as loaded
          loadedCount++;
          setLoadedAssets(loadedCount);
          addPreloadedAsset(url);
          resolve();
        }
      });
    };

    // Preload all critical assets
    Promise.all(CRITICAL_ASSETS.map(preloadAsset))
      .then(() => {
        setIsComplete(true);
        console.log('✅ All CRD assets preloaded successfully');
      })
      .catch(() => {
        setIsComplete(true);
        console.log('⚠️ CRD asset preloading completed with some errors');
      });

    // Also preload fabric.js if not already loaded
    if (!(window as any).fabric) {
      import('fabric').then(() => {
        console.log('✅ Fabric.js preloaded');
      }).catch(err => {
        console.warn('Failed to preload Fabric.js:', err);
      });
    }

  }, [addPreloadedAsset]);

  return {
    loadedAssets,
    totalAssets,
    isComplete,
    progress: Math.round((loadedAssets / totalAssets) * 100)
  };
};