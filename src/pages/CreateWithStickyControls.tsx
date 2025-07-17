import React, { useState } from 'react';
import { CRDViewer } from '@/components/crd/CRDViewer';
import { CRDStickyFooter } from '@/components/crd/controls/CRDStickyFooter';
import { type AnimationMode, type LightingPreset } from '@/components/crd/types/CRDTypes';

const CreateWithStickyControls = () => {
  // Animation State
  const [animationMode, setAnimationMode] = useState<AnimationMode>('monolith');
  const [animationIntensity, setAnimationIntensity] = useState(1);

  // Visual Style State
  const [selectedStyleId, setSelectedStyleId] = useState('matte');

  // Rotation State
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  // Lighting State
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('studio');
  const [lightingIntensity, setLightingIntensity] = useState(1);

  return (
    <div className="fixed inset-0 bg-crd-darkest overflow-hidden">
      {/* 3D Card Viewer - No built-in controls */}
      <CRDViewer
        mode={animationMode}
        intensity={animationIntensity}
        lightingPreset={lightingPreset}
        pathTheme="neutral"
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        lightingIntensity={lightingIntensity}
        enableControls={true}
        enableGlassCase={true}
        showModeText={true}
        className="w-full h-full"
        onModeChange={setAnimationMode}
        onIntensityChange={setAnimationIntensity}
      />

      {/* Simplified Sticky Footer Controls */}
      <CRDStickyFooter
        animationMode={animationMode}
        animationIntensity={animationIntensity}
        onAnimationModeChange={setAnimationMode}
        onAnimationIntensityChange={setAnimationIntensity}
        selectedStyleId={selectedStyleId}
        onStyleChange={setSelectedStyleId}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        onAutoRotateChange={setAutoRotate}
        onRotationSpeedChange={setRotationSpeed}
      />
    </div>
  );
};

export default CreateWithStickyControls;