
import React from 'react';
import { PanoramicEnvironment } from './PanoramicEnvironment';
import { PanoramicControls } from '../controls/PanoramicControls';
import { 
  getPhotoById, 
  getFallbackPhoto, 
  getBackupFallbackPhoto, 
  FALLBACK_PHOTOS 
} from './photoLibrary';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface PanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
}

export const PanoramicSpace: React.FC<PanoramicSpaceProps> = ({ config, controls }) => {
  console.log('🎪 PanoramicSpace config:', config);
  
  // Enhanced photo resolution with multiple fallback levels
  let photo = null;
  let photoSource = 'none';
  
  if (config.panoramicPhotoId) {
    photo = getPhotoById(config.panoramicPhotoId);
    if (photo) {
      photoSource = 'primary';
      console.log('📸 Using primary photo:', photo.name);
    }
  }
  
  // First fallback: try primary fallback
  if (!photo) {
    console.warn('⚠️ Primary photo not found, trying fallback');
    photo = getFallbackPhoto();
    photoSource = 'fallback';
  }
  
  // Second fallback: try backup fallback
  if (!photo) {
    console.warn('🚨 Fallback failed, trying backup fallback');
    photo = getBackupFallbackPhoto();
    photoSource = 'backup';
  }
  
  // Ultimate fallback: use first available fallback photo
  if (!photo && FALLBACK_PHOTOS.length > 0) {
    console.error('💥 All fallbacks failed, using emergency fallback');
    photo = FALLBACK_PHOTOS[0];
    photoSource = 'emergency';
  }
  
  // If still no photo, create a procedural environment
  if (!photo) {
    console.error('🆘 No photos available, creating procedural environment');
    photo = {
      id: 'procedural-fallback',
      name: 'Procedural Environment',
      category: 'fantasy' as const,
      url: '', // Will be handled by PanoramicEnvironment
      thumbnail: '',
      description: 'Procedurally generated environment',
      lighting: { intensity: 1.0, warmth: 0.5, contrast: 0.7 },
      camera: { defaultDistance: 8, autoRotateSpeed: 0.3 }
    };
    photoSource = 'procedural';
  }
  
  console.log('🖼️ Final photo selection:', {
    name: photo.name,
    source: photoSource,
    url: photo.url || 'procedural'
  });

  // Enhanced exposure calculation based on photo source and quality
  const baseExposure = config.exposure || photo.lighting.intensity;
  const exposureMultiplier = photoSource === 'primary' ? 1.0 : 
                           photoSource === 'fallback' ? 1.2 : 
                           photoSource === 'backup' ? 1.3 : 1.5;
  
  const finalExposure = baseExposure * exposureMultiplier;
  
  console.log('💡 Lighting configuration:', {
    baseExposure,
    exposureMultiplier,
    finalExposure,
    photoIntensity: photo.lighting.intensity
  });

  return (
    <>
      <PanoramicEnvironment
        photoUrl={photo.url}
        rotation={config.autoRotation || 0}
        exposure={finalExposure}
        saturation={config.saturation || 1.0}
        brightness={photo.lighting.intensity}
      />
      
      <PanoramicControls
        autoRotate={controls.panoramicAutoRotate || controls.autoRotate}
        autoRotateSpeed={controls.panoramicRotationSpeed || controls.orbitSpeed}
        enableZoom={true}
        enablePan={false}
        minDistance={photo.camera.defaultDistance * 0.3}
        maxDistance={photo.camera.defaultDistance * 3}
        dampingFactor={0.05} // Smoother controls
      />
    </>
  );
};
