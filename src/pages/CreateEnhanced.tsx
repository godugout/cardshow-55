import React, { useState } from 'react';
import { CreatePageHero } from '@/components/create/CreatePageHero';
import { CreateCardsSection } from '@/components/create/CreateCardsSection';
import { CreationOptions } from '@/components/create/CreationOptions';
import { CRDViewer } from '@/components/crd/CRDViewer';
import { StudioBar } from '@/components/studio/StudioBar';
import { StudioFloatingOrb } from '@/components/studio/StudioFloatingOrb';
import { type AnimationMode, type LightingPreset } from '@/components/crd/types/CRDTypes';

const CreateEnhanced: React.FC = () => {
  // Studio state
  const [isStudioOpen, setIsStudioOpen] = useState(false);

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

  const openStudio = () => {
    setIsStudioOpen(true);
    // Hide navbar by adding a class to body or using a context
    document.body.classList.add('studio-mode');
  };

  const closeStudio = () => {
    setIsStudioOpen(false);
    // Show navbar again
    document.body.classList.remove('studio-mode');
  };

  // Studio mode - full screen 3D environment with controls
  if (isStudioOpen) {
    return (
      <div className="fixed inset-0 bg-crd-darkest overflow-hidden flex flex-col z-50">
        {/* 3D Card Viewer - Takes full screen */}
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

        {/* Studio Bar (formerly sticky footer) */}
        <StudioBar
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
          onClose={closeStudio}
        />
      </div>
    );
  }

  // Regular create page with hero section and floating orb
  return (
    <div className="min-h-screen bg-crd-darkest overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {/* Full Width Hero Section */}
        <CreatePageHero />
        
        {/* Cards Section */}
        <CreateCardsSection />
        
        {/* Creation Options Section */}
        <CreationOptions />
      </div>

      {/* Floating Orb to Open Studio */}
      <StudioFloatingOrb onClick={openStudio} />
    </div>
  );
};

export default CreateEnhanced;