
import React from 'react';
import { PanoramicEnvironment } from './PanoramicEnvironment';
import { PanoramicControls } from '../controls/PanoramicControls';
import { getPhotoById, getFallbackPhoto } from './photoLibrary';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface PanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
}

export const PanoramicSpace: React.FC<PanoramicSpaceProps> = ({ config, controls }) => {
  console.log('🎪 PanoramicSpace config:', config);
  
  // Try to get the photo by ID, with fallback
  let photo = null;
  
  if (config.panoramicPhotoId) {
    photo = getPhotoById(config.panoramicPhotoId);
    console.log('📸 Photo lookup result:', { 
      requestedId: config.panoramicPhotoId, 
      found: photo ? photo.name : 'NOT FOUND' 
    });
  }
  
  // If no photo found, use fallback
  if (!photo) {
    console.warn('⚠️ No photo found, using fallback');
    photo = getFallbackPhoto();
  }
  
  console.log('🖼️ Final photo to render:', photo.name, photo.url);

  return (
    <>
      <PanoramicEnvironment
        photoUrl={photo.url}
        rotation={config.autoRotation || 0}
        exposure={config.exposure || photo.lighting.intensity}
        saturation={config.saturation || 1.0}
        brightness={photo.lighting.intensity}
      />
      
      <PanoramicControls
        autoRotate={controls.panoramicAutoRotate || controls.autoRotate}
        autoRotateSpeed={controls.panoramicRotationSpeed || controls.orbitSpeed}
        enableZoom={true}
        enablePan={false}
        minDistance={photo.camera.defaultDistance * 0.5}
        maxDistance={photo.camera.defaultDistance * 2}
        dampingFactor={0.1}
      />
    </>
  );
};
