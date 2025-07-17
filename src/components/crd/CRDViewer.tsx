import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { OrbitalMaterialSystem } from './orbital/OrbitalMaterialSystem';
import { StudioResetButton } from '../studio/StudioResetButton';
import { StudioPauseButton } from '../studio/StudioPauseButton';
import { SpaceOdysseyReset } from './animations/SpaceOdysseyReset';

import { type AnimationMode, type LightingPreset, type PathTheme } from './types/CRDTypes';

interface CRDViewerProps {
  mode?: AnimationMode;
  intensity?: number;
  lightingPreset?: LightingPreset;
  pathTheme?: PathTheme;
  autoRotate?: boolean;
  rotationSpeed?: number;
  lightingIntensity?: number;
  enableControls?: boolean;
  enableGlassCase?: boolean;
  showModeText?: boolean;
  
  // Orbital controls
  orbitalAutoRotate?: boolean;
  orbitalRotationSpeed?: number;
  showOrbitalRing?: boolean;
  showLockIndicators?: boolean;
  
  // Pause controls
  isPaused?: boolean;
  cardPaused?: boolean;
  onTogglePause?: () => void;
  showPauseButton?: boolean;
  
  className?: string;
  onModeChange?: (mode: AnimationMode) => void;
  onIntensityChange?: (intensity: number) => void;
}

export const CRDViewer: React.FC<CRDViewerProps> = ({
  mode: initialMode = 'monolith',
  intensity: initialIntensity = 1,
  lightingPreset: initialLightingPreset = 'studio',
  pathTheme = 'neutral',
  autoRotate: initialAutoRotate = false,
  rotationSpeed: initialRotationSpeed = 0.5,
  lightingIntensity: initialLightingIntensity = 1,
  enableControls = true,
  enableGlassCase = true,
  showModeText = true,
  
  // Orbital controls
  orbitalAutoRotate = true,
  orbitalRotationSpeed = 1,
  showOrbitalRing = true,
  showLockIndicators = false,
  
  // Pause controls
  isPaused: externalIsPaused,
  onTogglePause: externalOnTogglePause,
  showPauseButton = true,
  
  className = "w-full h-screen",
  onModeChange,
  onIntensityChange
}) => {
  // Refs
  const cardRef = useRef<THREE.Group & { getCurrentRotation?: () => THREE.Euler }>(null);
  const controlsRef = useRef<any>(null);

  // Mouse position state for synced movement
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Card interaction state for orbital ring pausing
  const [isCardInteracting, setIsCardInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Animation State
  const [currentMode, setCurrentMode] = useState<AnimationMode>(initialMode);
  const [currentIntensity, setCurrentIntensity] = useState(initialIntensity);
  const [autoModeEnabled, setAutoModeEnabled] = useState(false); // Disabled by default

  // Visual Style State
  const [selectedStyleId, setSelectedStyleId] = useState('matte');
  const [cardRotation, setCardRotation] = useState(new THREE.Euler(0, 0, 0));
  const [internalIsPaused, setInternalIsPaused] = useState(false);
  const [isResetAnimating, setIsResetAnimating] = useState(false);
  const [isCardPaused, setIsCardPaused] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  
  // Use external pause state if provided, otherwise use internal state
  const isPaused = externalIsPaused !== undefined ? externalIsPaused : internalIsPaused;

  // Rotation State
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [rotationSpeed, setRotationSpeed] = useState(initialRotationSpeed);

  // Lighting State
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(initialLightingPreset);
  const [lightingIntensity, setLightingIntensity] = useState(initialLightingIntensity);

  // Auto-cycle through modes for demo (only when autoModeEnabled is true)
  useEffect(() => {
    if (!autoModeEnabled) return;
    
    const interval = setInterval(() => {
      setCurrentMode(prev => {
        const modes: AnimationMode[] = ['monolith', 'ice', 'gold', 'glass', 'holo', 'showcase'];
        const currentIndex = modes.indexOf(prev);
        const newMode = modes[(currentIndex + 1) % modes.length];
        onModeChange?.(newMode);
        return newMode;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [autoModeEnabled, onModeChange]);

  const handleModeChange = (newMode: AnimationMode) => {
    setCurrentMode(newMode);
    setAutoModeEnabled(false); // Stop auto-switching when user manually changes
    onModeChange?.(newMode);
  };

  const handleIntensityChange = (newIntensity: number) => {
    setCurrentIntensity(newIntensity);
    onIntensityChange?.(newIntensity);
  };

  const handleStyleChange = (styleId: string) => {
    console.log('🎨 CRD Viewer: Style changing from', selectedStyleId, 'to:', styleId);
    setSelectedStyleId(styleId);
  };

  const handleCardPauseToggle = (paused: boolean) => {
    setIsCardPaused(paused);
  };

  const handleCardHover = (hovered: boolean) => {
    // Card hover can be used for future features like highlighting
  };

  const handleCardLockToggle = (locked: boolean) => {
    console.log('🔒 Card lock toggled:', locked);
    setIsCardLocked(locked);
  };

  // Track card rotation for orbital system
  const handleTransformUpdate = (transform: { position: THREE.Vector3; rotation: THREE.Euler }) => {
    setCardRotation(transform.rotation.clone());
  };

  const handleAutoRotateChange = (enabled: boolean) => {
    setAutoRotate(enabled);
  };

  const handleRotationSpeedChange = (speed: number) => {
    setRotationSpeed(speed);
  };

  const handleLightingPresetChange = (preset: LightingPreset) => {
    setLightingPreset(preset);
  };

  const handleLightingIntensityChange = (intensity: number) => {
    setLightingIntensity(intensity);
  };

  const handleTogglePause = () => {
    if (externalOnTogglePause) {
      externalOnTogglePause();
    } else {
      setInternalIsPaused(prev => !prev);
    }
  };

  const handleReset = () => {
    // Start the space odyssey reset animation
    setIsResetAnimating(true);
    
    // Reset controls after animation completes
    setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
      setIsResetAnimating(false);
    }, 6000); // Total animation duration
  };

  // Handle orbit controls interaction
  const handleControlsStart = () => {
    setIsCardInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleControlsEnd = () => {
    // Use a timeout to allow settling before resuming orbital rotation
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsCardInteracting(false);
    }, 500); // 500ms settling time
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Camera reset event listener
  useEffect(() => {
    const handleCameraReset = () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    };

    window.addEventListener('crd-reset-camera', handleCameraReset);
    
    return () => {
      window.removeEventListener('crd-reset-camera', handleCameraReset);
    };
  }, []);



  return (
    <div className={`overflow-hidden relative ${className}`}>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        scene={{ background: null }}
      >
        {/* Unified Lighting System */}
        <LightingRig 
          preset={lightingPreset} 
          pathTheme={pathTheme}
          intensity={lightingIntensity}
          enableShadows={true}
        />
        
        {/* Space Odyssey Reset Animation */}
        <SpaceOdysseyReset 
          isAnimating={isResetAnimating}
          onComplete={() => setIsResetAnimating(false)}
        />
        
        {/* Main Card with Glass Case Container - Responds to mouse only when not locked */}
        <group 
          position={[0, -2, 0]}
          rotation={isCardLocked ? [0, 0, 0] : [mouseOffset.y * 0.002, mouseOffset.x * 0.002, 0]}
        >
        <Card3DCore
          ref={cardRef}
          mode={currentMode}
          intensity={currentIntensity}
          materialMode={selectedStyleId as any}
          enableAnimation={!isResetAnimating}
          enableGlassCase={enableGlassCase}
          isLocked={isCardLocked}
          isPaused={isCardPaused}
          onLockToggle={handleCardLockToggle}
          onPauseToggle={handleCardPauseToggle}
          onHover={handleCardHover}
          onTransformUpdate={handleTransformUpdate}
        />
        </group>

        {/* Orbital Material Ring System - Synced with mouse */}
        <group 
          position={[0, -2, 0]}
          rotation={[mouseOffset.y * 0.001, mouseOffset.x * 0.001, 0]}
        >
          <OrbitalMaterialSystem
            cardRotation={cardRotation}
            onStyleChange={handleStyleChange}
            selectedStyleId={selectedStyleId}
            autoRotate={orbitalAutoRotate && !isCardInteracting && !isResetAnimating && !isCardLocked}
            rotationSpeed={orbitalRotationSpeed}
            showRing={showOrbitalRing && !isResetAnimating}
            showLockIndicators={showLockIndicators}
            isPaused={isPaused || isResetAnimating}
            cardPaused={isCardPaused}
          />
        </group>
        
        {/* Mode Text */}
        {showModeText && (
          <Text
            position={[0, -4.5, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {selectedStyleId.charAt(0).toUpperCase() + selectedStyleId.slice(1)} | 
            {currentMode.toUpperCase()} | {currentIntensity.toFixed(1)}x
          </Text>
        )}
        
        {/* Orbit Controls - Modified for synced movement */}
        {enableControls && (
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={25}
            minDistance={3}
            autoRotate={autoRotate}
            autoRotateSpeed={rotationSpeed}
            target={[mouseOffset.x * 0.01, mouseOffset.y * 0.01, 0]}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minAzimuthAngle={-Infinity}
            maxAzimuthAngle={Infinity}
            enableDamping={true}
            dampingFactor={0.05}
            onStart={handleControlsStart}
            onEnd={handleControlsEnd}
          />
        )}
        
        {/* Atmospheric Fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
      
      {/* Studio Controls */}
      <StudioResetButton onReset={handleReset} />
      {showPauseButton && (
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      )}
    </div>
  );
};