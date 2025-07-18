
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CosmicDance } from './cosmic/CosmicDance';
import { CosmicDanceControls } from './cosmic/CosmicDanceControls';
import { CRDLogo } from '../crd/CRDLogoComponent';
import { useCardAngle } from './hooks/useCardAngle';

interface CRDViewerProps {
  mode?: 'cosmic' | 'studio' | 'monolith';
  intensity?: number;
  lightingPreset?: 'studio' | 'dramatic' | 'soft' | 'sunset' | 'showcase';
  pathTheme?: 'neutral' | 'warm' | 'cool';
  autoRotate?: boolean;
  rotationSpeed?: number;
  lightingIntensity?: number;
  orbitalAutoRotate?: boolean;
  orbitalRotationSpeed?: number;
  showOrbitalRing?: boolean;
  showLockIndicators?: boolean;
  enableControls?: boolean;
  enableGlassCase?: boolean;
  showModeText?: boolean;
  hideCosmicControls?: boolean;
  className?: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
  showPauseButton?: boolean;
  onModeChange?: (mode: 'cosmic' | 'studio' | 'monolith') => void;
  onIntensityChange?: (intensity: number) => void;
}

function CameraController({ mode }: { mode: string }) {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    if (camera && controls) {
      // Updated camera positioning - slightly elevated and looking down at the card
      if (mode === 'cosmic') {
        camera.position.set(0, 3, 15); // Elevated Y position for better angle
        camera.lookAt(0, -1, 0); // Look down slightly at the card area
      } else if (mode === 'studio') {
        camera.position.set(0, 2, 12);
        camera.lookAt(0, -0.5, 0);
      } else {
        camera.position.set(0, 1, 10);
        camera.lookAt(0, -0.5, 0);
      }
      
      // Update controls target to match the new viewing angle
      if (controls && 'target' in controls) {
        (controls as any).target.set(0, -1, 0);
        (controls as any).update();
      }
    }
  }, [camera, controls, mode]);

  return null;
}

export const CRDViewer: React.FC<CRDViewerProps> = ({
  mode = 'cosmic',
  intensity = 1,
  lightingPreset = 'studio',
  pathTheme = 'neutral',
  autoRotate = false,
  rotationSpeed = 0.5,
  lightingIntensity = 1,
  orbitalAutoRotate = true,
  orbitalRotationSpeed = 1,
  showOrbitalRing = true,
  showLockIndicators = false,
  enableControls = true,
  enableGlassCase = true,
  showModeText = true,
  hideCosmicControls = false,
  className = '',
  isPaused = false,
  onTogglePause,
  showPauseButton = false,
  onModeChange,
  onIntensityChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localAutoRotate, setLocalAutoRotate] = useState(autoRotate);
  const { cardAngle, cameraDistance, isOptimalZoom, isOptimalPosition, controlsRef, resetCardAngle } = useCardAngle();
  
  // Cosmic Dance state
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      resetCardAngle();
    }
  };

  const handleToggleAutoRotate = () => {
    setLocalAutoRotate(!localAutoRotate);
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const distance = controlsRef.current.getDistance();
      controlsRef.current.dollyIn(0.8);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const distance = controlsRef.current.getDistance();
      controlsRef.current.dollyOut(0.8);
      controlsRef.current.update();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Updated card positioning - lower and with forward lean
  const cardPosition = useMemo(() => ({ x: 0, y: -2, z: 0 }), []);
  const cardRotation = useMemo(() => ({ x: 0.25, y: 0, z: 0 }), []); // 15-degree forward lean

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Updated camera with better positioning */}
        <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={75} />
        <CameraController mode={mode} />

        {/* Enhanced Environment */}
        <Environment preset={lightingPreset === 'studio' ? 'studio' : 'sunset'} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.3 * intensity} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.0 * intensity}
          castShadow
          shadow-mapSize={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4 * intensity} color="#4f46e5" />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.6 * intensity}
          castShadow
        />

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.3}
          scale={12}
          blur={2}
          far={4}
        />

        {/* Render based on mode */}
        <group position={[cardPosition.x, cardPosition.y, cardPosition.z]} rotation={[cardRotation.x, cardRotation.y, cardRotation.z]}>
          {mode === 'cosmic' && (
            <CosmicDance
              animationProgress={animationProgress}
              isPlaying={isPlaying}
              cardAngle={cardAngle}
              cameraDistance={cameraDistance}
              isOptimalZoom={isOptimalZoom}
              isOptimalPosition={isOptimalPosition}
              onTriggerReached={() => setHasTriggered(true)}
            />
          )}
          
          {mode === 'studio' && (
            <mesh>
              <boxGeometry args={[2, 3, 0.1]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          )}
          
          {mode === 'monolith' && (
            <mesh>
              <boxGeometry args={[2, 3, 0.1]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          )}
        </group>

        {/* Enhanced Controls with updated constraints */}
        {enableControls && (
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            autoRotate={localAutoRotate}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={25}
            minPolarAngle={Math.PI / 8} // Prevent camera from going too low
            maxPolarAngle={Math.PI - Math.PI / 8} // Prevent camera from going too high
            target={[0, -1, 0]} // Look at the card area
          />
        )}
      </Canvas>

      {/* CRD Logo Branding */}
      <div className="absolute top-6 right-6 z-50">
        <CRDLogo fileName="CRD_logo.png" className="w-12 h-12" />
      </div>

      {/* Mode Text */}
      {showModeText && (
        <div className="absolute top-6 left-6 z-50">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <span className="text-white text-sm font-medium capitalize">
              {mode} Mode
            </span>
          </div>
        </div>
      )}

      {/* Cosmic Dance Controls */}
      {mode === 'cosmic' && !hideCosmicControls && (
        <div className="absolute bottom-6 left-6 right-6 z-50">
          <CosmicDanceControls
            animationProgress={animationProgress}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            cardAngle={cardAngle}
            cameraDistance={cameraDistance}
            isOptimalZoom={isOptimalZoom}
            isOptimalPosition={isOptimalPosition}
            hasTriggered={hasTriggered}
            onProgressChange={setAnimationProgress}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onSpeedChange={setPlaybackSpeed}
            onReset={() => {
              setAnimationProgress(0);
              setIsPlaying(false);
              setHasTriggered(false);
              handleResetView();
            }}
            onAngleReset={resetCardAngle}
          />
        </div>
      )}

      {/* Studio Controls */}
      {mode === 'studio' && (
        <div className="absolute bottom-6 right-6 z-50">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <span className="text-white text-sm">Studio Mode</span>
          </div>
        </div>
      )}

      {/* Footer HUD */}
      {mode === 'cosmic' && (
        <div className="absolute bottom-6 left-6 z-50">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            <div className="text-white text-sm space-y-1">
              <div>Cosmic Dance Engine Active</div>
              <div>Card Angle: {Math.round(cardAngle)}°</div>
              <div>Camera Distance: {cameraDistance.toFixed(1)}</div>
              <div>{hasTriggered ? 'Cosmic Triggered' : 'Ready for Animation'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
