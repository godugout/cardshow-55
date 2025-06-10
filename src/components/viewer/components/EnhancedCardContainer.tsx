
import React, { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import type { MaterialSettings, LightingPreset, EnvironmentControls, EnvironmentScene } from '../types';

export interface EnhancedCardContainerProps {
  card: CardData;
  effectValues: EffectValues;
  rotation: { x: number; y: number };
  zoom: number;
  isFlipped: boolean;
  autoRotate?: boolean;
  showEffects: boolean;
  materialSettings: MaterialSettings;
  lightingPreset: LightingPreset;
  environmentBrightness: number;
  interactiveLightingEnabled: boolean;
  interactiveLighting?: boolean;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  isDragging: boolean;
  frameStyles: Record<string, any>;
  enhancedEffectStyles: Record<string, any>;
  SurfaceTexture: any;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  environmentControls: EnvironmentControls;
  selectedScene?: EnvironmentScene;
  overallBrightness?: number[];
  showBackgroundInfo?: boolean;
}

export const EnhancedCardContainer: React.FC<EnhancedCardContainerProps> = ({
  card,
  effectValues,
  rotation,
  zoom,
  isFlipped,
  autoRotate = false,
  showEffects,
  materialSettings,
  lightingPreset,
  environmentBrightness,
  interactiveLightingEnabled,
  mousePosition,
  isHovering,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick,
  environmentControls
}) => {
  const meshRef = useRef();

  return (
    <div 
      className="w-full h-full relative"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: environmentControls?.fieldOfView || 75 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="studio" />
        
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[rotation.x, rotation.y, 0]} scale={zoom}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshStandardMaterial 
            map={null}
            roughness={materialSettings.roughness}
            metalness={materialSettings.metalness}
            side={2}
          />
        </mesh>
        
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};
