import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { type AnimationMode, type LightingPreset, type PathTheme } from './types/CRDTypes';

interface CRDViewerProps {
  mode?: AnimationMode;
  intensity?: number;
  lightingPreset?: LightingPreset;
  pathTheme?: PathTheme;
  autoRotate?: boolean;
  enableControls?: boolean;
  enableGlassCase?: boolean;
  showModeText?: boolean;
  className?: string;
  onModeChange?: (mode: AnimationMode) => void;
  onIntensityChange?: (intensity: number) => void;
}

export const CRDViewer: React.FC<CRDViewerProps> = ({
  mode: initialMode = 'frozen',
  intensity: initialIntensity = 1,
  lightingPreset = 'studio',
  pathTheme = 'neutral',
  autoRotate = false,
  enableControls = true,
  enableGlassCase = true,
  showModeText = true,
  className = "w-full h-screen",
  onModeChange,
  onIntensityChange
}) => {
  const [currentMode, setCurrentMode] = useState<AnimationMode>(initialMode);
  const [currentIntensity, setCurrentIntensity] = useState(initialIntensity);
  const [autoMode, setAutoMode] = useState(true);

  // Auto-cycle through modes for demo (only when autoMode is true)
  useEffect(() => {
    if (!autoMode) return;
    
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
  }, [autoMode, onModeChange]);

  const handleModeChange = (newMode: AnimationMode) => {
    setCurrentMode(newMode);
    setAutoMode(false); // Stop auto-switching when user clicks
    onModeChange?.(newMode);
  };

  const handleIntensityChange = (newIntensity: number) => {
    setCurrentIntensity(newIntensity);
    onIntensityChange?.(newIntensity);
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
            Mode: {currentMode.toUpperCase()} | Intensity: {currentIntensity.toFixed(1)}
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
            autoRotateSpeed={0.5}
            target={[0, 0, 0]}
          />
        )}
        
        {/* Atmospheric Fog */}
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
      
      {/* Control Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Animation Mode Controls */}
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">Animation Mode:</span>
              <div className="flex gap-1 flex-wrap">
                {(['frozen', 'ice', 'gold', 'glass', 'holo', 'showcase'] as AnimationMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentMode === mode 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Intensity Control */}
            <div className="flex items-center gap-3">
              <label className="text-white text-sm font-medium">Intensity:</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentIntensity}
                onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                className="w-24 accent-primary"
              />
              <span className="text-white text-sm font-mono w-8">{currentIntensity.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};