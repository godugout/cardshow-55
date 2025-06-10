
import React from 'react';
import { PanoramicEnvironment } from './PanoramicEnvironment';
import { PanoramicControls } from '../controls/PanoramicControls';
import { getPhotoById } from './photoLibrary';
import type { SpaceEnvironment, SpaceControls } from '../types';

interface PanoramicSpaceProps {
  config: SpaceEnvironment['config'];
  controls: SpaceControls;
}

export const PanoramicSpace: React.FC<PanoramicSpaceProps> = ({ config, controls }) => {
  const photo = config.panoramicPhotoId ? getPhotoById(config.panoramicPhotoId) : null;
  
  if (!photo) {
    console.warn('PanoramicSpace: No photo found for ID:', config.panoramicPhotoId);
    return (
      <>
        <color attach="background" args={[config.backgroundColor || '#1a1a1a']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
      </>
    );
  }

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
