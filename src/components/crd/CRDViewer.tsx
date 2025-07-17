import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { CRDControlPanel } from './controls/CRDControlPanel';
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
  showControlPanel?: boolean;
  className?: string;
  onModeChange?: (mode: AnimationMode) => void;
  onIntensityChange?: (intensity: number) => void;
}

export const CRDViewer: React.FC<CRDViewerProps> = ({
  mode: initialMode = 'frozen',
  intensity: initialIntensity = 1,
  lightingPreset: initialLightingPreset = 'studio',
  pathTheme = 'neutral',
  autoRotate: initialAutoRotate = false,
  rotationSpeed: initialRotationSpeed = 0.5,
  lightingIntensity: initialLightingIntensity = 1,
  enableControls = true,
  enableGlassCase = true,
  showModeText = true,
  showControlPanel = true,
  className = "w-full h-screen",
  onModeChange,
  onIntensityChange
}) => {
  // Animation State
  const [currentMode, setCurrentMode] = useState<AnimationMode>(initialMode);
  const [currentIntensity, setCurrentIntensity] = useState(initialIntensity);
  const [autoModeEnabled, setAutoModeEnabled] = useState(true);

  // Visual Style State
  const [selectedStyleId, setSelectedStyleId] = useState('matte');

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
        const modes: AnimationMode[] = ['frozen', 'ice', 'gold', 'glass', 'holo', 'showcase'];
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
    setSelectedStyleId(styleId);
    console.log('Style changed to:', styleId);
    // Here we'll integrate with the MaterialSystem to apply the style
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

  return (
    <div className={`bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black overflow-hidden relative ${className}`}>
      {/* Star field background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 2 + 0.5;
          const opacity = Math.random() * 0.6 + 0.2;
          const animationDelay = Math.random() * 3;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          );
        })}
      </div>

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
        
        {/* Main Card with Glass Case Container */}
        <group position={[0, -2, 0]}>
          <Card3DCore
            mode={currentMode}
            intensity={currentIntensity}
            enableAnimation={true}
            enableGlassCase={enableGlassCase}
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
        
        {/* Orbit Controls */}
        {enableControls && (
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            maxDistance={25}
            minDistance={3}
            autoRotate={autoRotate}
            autoRotateSpeed={rotationSpeed}
            target={[0, 0, 0]}
          />
        )}
        
        {/* Atmospheric Fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
      
      {/* Modern Control Panel */}
      {showControlPanel && (
        <div className="fixed bottom-4 left-4 right-4 z-20 max-w-4xl mx-auto">
          <CRDControlPanel
            // Animation props
            animationMode={currentMode}
            animationIntensity={currentIntensity}
            onAnimationModeChange={handleModeChange}
            onAnimationIntensityChange={handleIntensityChange}
            
            // Style props
            selectedStyleId={selectedStyleId}
            onStyleChange={handleStyleChange}
            
            // Rotation props
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            onAutoRotateChange={handleAutoRotateChange}
            onRotationSpeedChange={handleRotationSpeedChange}
            
            // Lighting props
            lightingPreset={lightingPreset}
            lightingIntensity={lightingIntensity}
            onLightingPresetChange={handleLightingPresetChange}
            onLightingIntensityChange={handleLightingIntensityChange}
          />
        </div>
      )}
    </div>
  );
};