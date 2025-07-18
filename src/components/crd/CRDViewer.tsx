import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Card3DCore } from './core/Card3DCore';
import { LightingRig } from './lighting/LightingRig';
import { OrbitalMaterialSystem } from './orbital/OrbitalMaterialSystem';
import { CosmicDance } from './cosmic/CosmicDance';
import { CosmicDanceControls } from './cosmic/CosmicDanceControls';
import { loadTemplate, TemplateConfig, TemplateEngine } from '@/templates/engine';
import { ensureMaterialPersistence, getMaterialForTemplate } from '@/utils/materialFallback';
import { PerformanceMonitor } from './performance/PerformanceMonitor';
import { useCardAngle } from './hooks/useCardAngle';

import { StudioPauseButton } from '../studio/StudioPauseButton';
import { TemplateControlsCard } from '../viewer/components/TemplateControlsCard';
import { TemplateControlsButton } from '../viewer/components/TemplateControlsButton';


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
  
  // Studio integration
  hideCosmicControls?: boolean;
  onCosmicStateChange?: (state: {
    animationProgress: number;
    isPlaying: boolean;
    playbackSpeed: number;
    cardAngle: number;
    cameraDistance: number;
    isOptimalZoom: boolean;
    isOptimalPosition: boolean;
    hasTriggered: boolean;
  }) => void;
  
  // Cosmic control callbacks
  onCosmicProgressChange?: (progress: number) => void;
  onCosmicPlayToggle?: () => void;
  onCosmicSpeedChange?: (speed: number) => void;
  onCosmicReset?: () => void;
  onCosmicAngleReset?: () => void;
  
  // Template engine integration
  templateConfig?: TemplateConfig;
  onTemplateComplete?: (templateEngine?: TemplateEngine) => void;
  onReplayTemplate?: () => void;
  
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
  
  // Studio integration
  hideCosmicControls = false,
  onCosmicStateChange,
  onCosmicProgressChange,
  onCosmicPlayToggle,
  onCosmicSpeedChange,
  onCosmicReset,
  onCosmicAngleReset,
  
  // Template engine integration
  templateConfig,
  onTemplateComplete,
  onReplayTemplate,
  
  className = "w-full h-screen",
  onModeChange,
  onIntensityChange
}) => {
  // Template engine state
  const [templateEngine, setTemplateEngine] = useState<TemplateEngine | null>(null);

  // Cosmic Dance system
  const { cardAngle, cameraDistance, isOptimalZoom, isOptimalPosition, cardRef: angleCardRef, controlsRef, resetCardAngle } = useCardAngle();
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [cosmicTriggered, setCosmicTriggered] = useState(false);
  
  // Card cinematic control state
  const [cardCinematicPosition, setCardCinematicPosition] = useState({ y: 0, lean: 0, controlTaken: false });

  // Performance monitoring
  const [performanceEnabled, setPerformanceEnabled] = useState(false);
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false);

  // Refs
  const cardRef = useRef<THREE.Group & { getCurrentRotation?: () => THREE.Euler }>(null);

  // Mouse position state for synced movement
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Card interaction state for orbital ring pausing
  const [isCardInteracting, setIsCardInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Template controls visibility
  const [showTemplateControls, setShowTemplateControls] = useState(false);

  // Animation State
  const [currentMode, setCurrentMode] = useState<AnimationMode>(initialMode);
  const [currentIntensity, setCurrentIntensity] = useState(initialIntensity);
  const [autoModeEnabled, setAutoModeEnabled] = useState(false); // Disabled by default

  // Visual Style State with material fallback support
  const [selectedStyleId, setSelectedStyleId] = useState('matte');
  const [cardRotation, setCardRotation] = useState(new THREE.Euler(0, 0, 0));
  const [internalIsPaused, setInternalIsPaused] = useState(false);
  
  const [isCardPaused, setIsCardPaused] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  
  // Use external pause state if provided, otherwise use internal state
  const isPaused = externalIsPaused !== undefined ? externalIsPaused : internalIsPaused;

  // Load template engine when templateConfig changes
  useEffect(() => {
    if (templateConfig) {
      const engine = loadTemplate(templateConfig);
      setTemplateEngine(engine);
      
      // Apply template-specific material defaults
      if (engine) {
        const materialDefault = getMaterialForTemplate(engine.id);
        setSelectedStyleId(materialDefault.styleId);
        setCurrentIntensity(materialDefault.intensity);
        setLightingPreset(materialDefault.lightingPreset as LightingPreset);
      }
      
      // Apply initial camera settings if template has them
      if (engine?.initialCamera && templateConfig.triggerOnLoad && controlsRef.current) {
        const cam = engine.initialCamera;
        controlsRef.current.object.position.set(...cam.position);
        controlsRef.current.target.set(...cam.target);
        controlsRef.current.object.zoom = cam.zoom;
        controlsRef.current.object.updateProjectionMatrix();
        controlsRef.current.update();
      }
      
      // Auto-start animation if configured
      if (engine?.autoTrigger && templateConfig.triggerOnLoad) {
        setIsPlaying(true);
      }
    } else {
      setTemplateEngine(null);
    }
  }, [templateConfig, controlsRef]);

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

  // Cosmic Dance Animation Logic - 10 second sunset
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        // 10 seconds total: 100% progress over 10 seconds = 1% per 100ms
        const newProgress = prev + (playbackSpeed * 0.006); // Adjusted for 10 second timing
        return newProgress >= 1 ? 1 : newProgress;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Enhanced cleanup when reaching end - Fix control liberation
  useEffect(() => {
    if (animationProgress >= 1 && isPlaying) {
      setIsPlaying(false);
      
      // Handle template completion
      if (templateEngine?.transitionToStudio) {
        handleCosmicTrigger(); // Trigger studio unlock
      }
      
      // Enhanced control cleanup sequence
      setTimeout(() => {
        // Reset all cosmic states
        setCosmicTriggered(false);
        setCardCinematicPosition({ y: 0, lean: 0, controlTaken: false });
        
        // Force reset OrbitControls to ensure proper liberation
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.enableRotate = true;
          controlsRef.current.enableZoom = true;
          controlsRef.current.enablePan = true;
        }
        
        // Close any open tracking windows/UI panels
        // Note: This will be handled by the parent component via state reset
      }, 2000); // 2 second delay to enjoy the final frame
    }
  }, [animationProgress, isPlaying, controlsRef, templateEngine]);

  // Notify studio about cosmic state changes
  useEffect(() => {
    if (onCosmicStateChange) {
      onCosmicStateChange({
        animationProgress,
        isPlaying,
        playbackSpeed,
        cardAngle,
        cameraDistance,
        isOptimalZoom,
        isOptimalPosition,
        hasTriggered: cosmicTriggered,
      });
    }
  }, [animationProgress, isPlaying, playbackSpeed, cardAngle, cameraDistance, isOptimalZoom, isOptimalPosition, cosmicTriggered, onCosmicStateChange]);

  const handleCosmicTrigger = () => {
    setCosmicTriggered(true);
    if (!isPlaying && animationProgress < 1) {
      setIsPlaying(true);
    }
    
    // Notify parent of template completion for studio transition
    if (templateEngine) {
      onTemplateComplete?.(templateEngine);
    }
  };

  // Reset template state function
  const resetTemplateState = () => {
    setAnimationProgress(0);
    setIsPlaying(false);
    setCosmicTriggered(false);
    setCardCinematicPosition({ y: 0, lean: 0, controlTaken: false });
    resetCardAngle();
    
    // Force control re-enabling on reset
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
    }
    
    // Notify studio of reset
    onCosmicReset?.();
  };

  const handleResetAnimation = () => {
    resetTemplateState();
  };

  // Handle template replay
  const handleReplayTemplate = () => {
    if (templateEngine?.replayable) {
      resetTemplateState();
      // Auto-start after brief delay
      setTimeout(() => {
        setIsPlaying(true);
      }, 500);
      onReplayTemplate?.();
    }
  };

  // Cosmic control handlers for studio integration
  const handleCosmicProgressChange = (progress: number) => {
    setAnimationProgress(progress);
    onCosmicProgressChange?.(progress);
  };

  const handleCosmicPlayToggle = () => {
    setIsPlaying(!isPlaying);
    onCosmicPlayToggle?.();
  };

  const handleCosmicSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    onCosmicSpeedChange?.(speed);
  };

  const handleCosmicAngleReset = () => {
    resetCardAngle();
    onCosmicAngleReset?.();
  };

  // Handle card control updates from CosmicDance
  const handleCardControlUpdate = (params: { positionY: number; lean: number; controlTaken: boolean }) => {
    setCardCinematicPosition({ y: params.positionY, lean: params.lean, controlTaken: params.controlTaken });
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




  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Responsive Container for 3D Scene */}
      <div className="relative w-full h-full max-h-[90vh] lg:max-h-screen">
        {/* 3D Scene - Responsive sizing */}
        <Canvas
          className="relative z-20 w-full h-full"
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
        
        {/* Cosmic Background Elements - Removed, now using 2D overlay */}
        
        {/* Main Card with Glass Case Container - Enhanced with cinematic positioning */}
        <group 
          position={[
            0, 
            -2 + cardCinematicPosition.y, // Cinematic Y positioning during cosmic alignment
            0
          ]}
          rotation={
            isCardLocked || cardCinematicPosition.controlTaken
              ? [0, 0, 0] 
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
        
        {/* Enhanced Orbit Controls for Cosmic Dance */}
        {enableControls && (
          <OrbitControls
            ref={controlsRef}
            enableZoom={!cosmicTriggered && !cardCinematicPosition.controlTaken}
            enablePan={!cosmicTriggered && !cardCinematicPosition.controlTaken}
            enableRotate={!cosmicTriggered && !cardCinematicPosition.controlTaken}
            maxDistance={25}
            minDistance={2}
            autoRotate={autoRotate && !cosmicTriggered && !cardCinematicPosition.controlTaken}
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
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor
        enabled={performanceEnabled}
        showOverlay={showPerformanceOverlay}
        onMetricsUpdate={(metrics) => {
          // Log performance issues
          if (metrics.fps < 30) {
            console.warn('⚠️ Low FPS detected:', metrics.fps);
          }
          if (metrics.memoryUsage > 500) {
            console.warn('⚠️ High memory usage:', metrics.memoryUsage, 'MB');
          }
        }}
      />
      
      {/* Cosmic Dance Overlay System */}
      <CosmicDance
        animationProgress={animationProgress}
        isPlaying={isPlaying}
        cardAngle={cardAngle}
        cameraDistance={cameraDistance}
        isOptimalZoom={isOptimalZoom}
        isOptimalPosition={isOptimalPosition}
        onTriggerReached={handleCosmicTrigger}
        onCardControlUpdate={handleCardControlUpdate}
        templateEngine={templateEngine}
      />
      
      {/* Cosmic Dance Controls - Hidden when studio integration is active */}
      {!hideCosmicControls && (
        <CosmicDanceControls
          animationProgress={animationProgress}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          cardAngle={cardAngle}
          cameraDistance={cameraDistance}
          isOptimalZoom={isOptimalZoom}
          isOptimalPosition={isOptimalPosition}
          hasTriggered={cosmicTriggered}
          onProgressChange={handleCosmicProgressChange}
          onPlayToggle={handleCosmicPlayToggle}
          onSpeedChange={handleCosmicSpeedChange}
          onReset={handleResetAnimation}
          onAngleReset={handleCosmicAngleReset}
        />
      )}
      
      {showPauseButton && (
        <StudioPauseButton 
          isPaused={isPaused} 
          onTogglePause={handleTogglePause} 
        />
      )}

      {/* Template Controls Hidden - Removed per user request */}
    </div>
  );
};