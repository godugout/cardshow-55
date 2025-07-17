import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { OrbitalMaterialSystem } from './orbital/OrbitalMaterialSystem';
import { StarsBackground } from '@/components/ui/stars';
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
  
  className = "w-full h-screen",
  onModeChange,
  onIntensityChange
}) => {
  // Refs
  const cardRef = useRef<THREE.Group & { getCurrentRotation?: () => THREE.Euler }>(null);

  // Mouse position state for synced movement
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Animation State
  const [currentMode, setCurrentMode] = useState<AnimationMode>(initialMode);
  const [currentIntensity, setCurrentIntensity] = useState(initialIntensity);
  const [autoModeEnabled, setAutoModeEnabled] = useState(false); // Disabled by default

  // Visual Style State
  const [selectedStyleId, setSelectedStyleId] = useState('matte');
  const [cardRotation, setCardRotation] = useState(new THREE.Euler(0, 0, 0));

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

  // Handle mouse movement from stars background
  const handleStarsMouseMove = React.useCallback((offsetX: number, offsetY: number) => {
    setMouseOffset({ x: offsetX, y: offsetY });
  }, []);


  return (
    <StarsBackground 
      className={`overflow-hidden relative ${className}`}
      starColor={["#ffffff", "#e6f3ff", "#ffe6e6", "#f0e6ff", "#e6ffe6"]}
      speed={40}
      factor={0.03}
      onStarsMove={handleStarsMouseMove}
    >

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
        
        {/* Main Card with Glass Case Container - Responds to mouse */}
        <group 
          position={[0, -2, 0]}
          rotation={[mouseOffset.y * 0.002, mouseOffset.x * 0.002, 0]}
        >
          <Card3DCore
            ref={cardRef}
            mode={currentMode}
            intensity={currentIntensity}
            materialMode={selectedStyleId as any}
            enableAnimation={true}
            enableGlassCase={enableGlassCase}
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
            autoRotate={orbitalAutoRotate}
            rotationSpeed={orbitalRotationSpeed}
            showRing={showOrbitalRing}
            showLockIndicators={showLockIndicators}
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
          />
        )}
        
        {/* Atmospheric Fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
      
    </StarsBackground>
  );
};