
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { UnifiedCard } from './UnifiedCard';

interface UnifiedCardViewerProps {
  card: CardData;
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  rotation: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  isHovering: boolean;
  showEffects: boolean;
  interactiveLighting: boolean;
  frameStyles: React.CSSProperties;
  enhancedEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  environment?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const UnifiedCardViewer: React.FC<UnifiedCardViewerProps> = ({
  card,
  effectValues,
  mousePosition,
  rotation,
  zoom,
  isDragging,
  isHovering,
  showEffects,
  interactiveLighting,
  frameStyles,
  enhancedEffectStyles,
  SurfaceTexture,
  environment = 'studio',
  autoRotate = false,
  enableControls = true,
  onMouseDown,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  onClick
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Environment and Lighting */}
          <Environment preset={environment as any} />
          
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* Enhanced lighting for interactive effects */}
          {interactiveLighting && (
            <pointLight
              position={[
                (mousePosition.x - 0.5) * 10,
                (0.5 - mousePosition.y) * 10,
                5
              ]}
              intensity={0.5}
              color="#ffffff"
            />
          )}

          {/* Unified Card */}
          <UnifiedCard
            card={card}
            effectValues={effectValues}
            mousePosition={mousePosition}
            rotation={rotation}
            zoom={zoom}
            isDragging={isDragging}
            isHovering={isHovering}
            showEffects={showEffects}
            interactiveLighting={interactiveLighting}
            frameStyles={frameStyles}
            enhancedEffectStyles={enhancedEffectStyles}
            SurfaceTexture={SurfaceTexture}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
          />

          {/* Contact Shadows */}
          <ContactShadows
            opacity={0.3}
            scale={10}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />

          {/* Orbit Controls (optional) */}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              minDistance={5}
              maxDistance={15}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
