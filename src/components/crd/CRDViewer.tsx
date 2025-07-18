import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { OrbitalMaterialSystem } from './orbital/OrbitalMaterialSystem';
import { CosmicSun } from './cosmic/CosmicSun';

import { StudioPauseButton } from '../studio/StudioPauseButton';


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

  // Cosmic animation state
  const [hasMaxZoomBeenReached, setHasMaxZoomBeenReached] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1 range
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const [isSunsetPoint, setIsSunsetPoint] = useState(false);
  const [cardLeanRequired, setCardLeanRequired] = useState(false);
  const MAX_ZOOM_DISTANCE = 3; // Minimum distance for max zoom

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

  // Enhanced Cosmic Animation Functions with scroll resistance
  const handlePostZoomScroll = useCallback((e: WheelEvent) => {
    if (!hasMaxZoomBeenReached) return;
    
    e.preventDefault();
    setScrollProgress(prev => {
      // Apply scroll resistance at sunset point (0.65-0.85 range)
      let sensitivity = 0.002;
      if (prev >= 0.65 && prev <= 0.85) {
        sensitivity *= 0.2; // 80% reduction in scroll sensitivity
      }
      
      const delta = e.deltaY * sensitivity;
      return Math.min(1, Math.max(0, prev + delta));
    });
  }, [hasMaxZoomBeenReached]);

  // Cosmic scene event handlers
  const handleSunsetPointReached = useCallback((reached: boolean) => {
    setIsSunsetPoint(reached);
  }, []);

  const handleCardLeanRequired = useCallback((lean: boolean) => {
    setCardLeanRequired(lean);
  }, []);

  const handleResetSunScene = useCallback(() => {
    setScrollProgress(0);
    setHasMaxZoomBeenReached(false);
    setShowScrollPrompt(false);
    setIsSunsetPoint(false);
    setCardLeanRequired(false);
  }, []);

  // Monitor camera position for max zoom detection
  useEffect(() => {
    const checkZoomLevel = () => {
      if (controlsRef.current) {
        const distance = controlsRef.current.getDistance();
        if (distance <= MAX_ZOOM_DISTANCE && !hasMaxZoomBeenReached) {
          setHasMaxZoomBeenReached(true);
          setShowScrollPrompt(true);
          // Hide prompt after 3 seconds
          setTimeout(() => setShowScrollPrompt(false), 3000);
        }
      }
    };

    const interval = setInterval(checkZoomLevel, 100);
    return () => clearInterval(interval);
  }, [hasMaxZoomBeenReached]);

  // Handle post-zoom scroll events
  useEffect(() => {
    if (hasMaxZoomBeenReached) {
      window.addEventListener('wheel', handlePostZoomScroll, { passive: false });
      return () => window.removeEventListener('wheel', handlePostZoomScroll);
    }
  }, [hasMaxZoomBeenReached, handlePostZoomScroll]);

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
        
        {/* Cosmic Background Elements */}
        <CosmicSun 
          scrollProgress={scrollProgress} 
          onSunsetPointReached={handleSunsetPointReached}
          onCardLeanRequired={handleCardLeanRequired}
        />
        
        {/* Main Card with Glass Case Container - Enhanced with sunset lean animation */}
        <group 
          position={[0, -2, 0]}
          rotation={
            isCardLocked 
              ? [0, 0, 0] 
              : cardLeanRequired
                ? [-0.25, 0, 0] // Forward lean during sunset point
                : [mouseOffset.y * 0.002, mouseOffset.x * 0.002, 0]
          }
        >
        <Card3DCore
          ref={cardRef}
          mode={currentMode}
          intensity={currentIntensity}
          materialMode={selectedStyleId as any}
          enableAnimation={true}
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
            autoRotate={orbitalAutoRotate && !isCardInteracting && !isCardLocked}
            rotationSpeed={orbitalRotationSpeed}
            showRing={showOrbitalRing}
            showLockIndicators={showLockIndicators}
            isPaused={isPaused}
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
            enableZoom={!hasMaxZoomBeenReached}
            enablePan={true}
            enableRotate={true}
            maxDistance={25}
            minDistance={MAX_ZOOM_DISTANCE}
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
      
      {/* Enhanced UI Overlays with Sunset Animation States */}
      {showScrollPrompt && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-center animate-fade-in">
            <p className="text-sm font-medium">Keep scrolling to witness the alignment...</p>
            <div className="flex justify-center mt-2">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sunset Point Indication */}
      {isSunsetPoint && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="bg-gradient-to-r from-orange-500/80 to-yellow-400/80 backdrop-blur-sm rounded-lg px-8 py-4 text-white text-center animate-pulse">
            <p className="text-lg font-bold mb-2">⚡ ALIGNMENT ACHIEVED ⚡</p>
            <p className="text-sm opacity-90">Continue scrolling to complete the sequence</p>
          </div>
        </div>
      )}
      
      {scrollProgress > 0.95 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleResetSunScene}
            className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium hover:bg-white/30 transition-all duration-200"
          >
            Reset Scene
          </button>
        </div>
      )}
      
      {showPauseButton && (
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      )}
      
      {/* Enhanced Scroll Progress Indicator with Sunset Zone */}
      {hasMaxZoomBeenReached && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="text-white text-xs mb-2 flex items-center gap-2">
              Cosmic Progress
              {isSunsetPoint && <span className="text-orange-400">⚡</span>}
            </div>
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden relative">
              {/* Sunset resistance zone indicator */}
              <div 
                className="absolute h-full bg-orange-400/30 rounded-full"
                style={{ 
                  left: '65%', 
                  width: '20%' 
                }}
              />
              {/* Progress bar */}
              <div 
                className={`h-full transition-all duration-300 ${
                  isSunsetPoint 
                    ? 'bg-gradient-to-r from-orange-600 to-yellow-400' 
                    : 'bg-gradient-to-r from-orange-500 to-yellow-300'
                }`}
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <div className="text-white/70 text-xs mt-1 flex justify-between">
              <span>{Math.round(scrollProgress * 100)}%</span>
              {isSunsetPoint && (
                <span className="text-orange-400 text-xs">SUNSET</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};