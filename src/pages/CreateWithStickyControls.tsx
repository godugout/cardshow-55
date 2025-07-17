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

  // Orbital controls
  const [orbitalAutoRotate, setOrbitalAutoRotate] = useState(true);
  const [orbitalRotationSpeed, setOrbitalRotationSpeed] = useState(1);
  const [showOrbitalRing, setShowOrbitalRing] = useState(true);
  const [showLockIndicators, setShowLockIndicators] = useState(false);

  // Case control
  const [enableGlassCase, setEnableGlassCase] = useState(true);

  return (
    <div className="fixed inset-0 bg-crd-darkest overflow-hidden flex flex-col">
      {/* 3D Card Viewer - Takes remaining space */}
      <div className="flex-1 relative">
        <CRDViewer
          mode={animationMode}
          intensity={animationIntensity}
          lightingPreset={lightingPreset}
          pathTheme="neutral"
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          lightingIntensity={lightingIntensity}
          orbitalAutoRotate={orbitalAutoRotate}
          orbitalRotationSpeed={orbitalRotationSpeed}
          showOrbitalRing={showOrbitalRing}
          showLockIndicators={showLockIndicators}
          enableControls={true}
          enableGlassCase={enableGlassCase}
          showModeText={true}
          className="w-full h-full"
          onModeChange={setAnimationMode}
          onIntensityChange={setAnimationIntensity}
        />
      </div>

      {/* Sticky Footer Controls */}
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
        lightingPreset={lightingPreset}
        lightingIntensity={lightingIntensity}
        onLightingPresetChange={setLightingPreset}
        onLightingIntensityChange={setLightingIntensity}
        orbitalAutoRotate={orbitalAutoRotate}
        orbitalRotationSpeed={orbitalRotationSpeed}
        showOrbitalRing={showOrbitalRing}
        showLockIndicators={showLockIndicators}
        onOrbitalAutoRotateChange={setOrbitalAutoRotate}
        onOrbitalRotationSpeedChange={setOrbitalRotationSpeed}
        onShowOrbitalRingChange={setShowOrbitalRing}
        onShowLockIndicatorsChange={setShowLockIndicators}
        enableGlassCase={enableGlassCase}
        onEnableGlassCaseChange={setEnableGlassCase}
      />
    </div>
  );
};

export default CreateWithStickyControls;