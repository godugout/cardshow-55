
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Stats } from '@react-three/drei';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Card3D } from './Card3D';
import type { CardData } from '@/hooks/useCardEditor';

interface Card3DViewerProps {
  card: CardData;
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  showStats?: boolean;
}

// WebGL support detection
const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
  } catch (e) {
    return false;
  }
};

// Performance detection
const getPerformanceMode = (): 'high' | 'medium' | 'low' => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Simple heuristic - can be improved with more sophisticated detection
    if (renderer.includes('Intel') || renderer.includes('Software')) {
      return 'low';
    }
    if (renderer.includes('Mobile') || renderer.includes('ARM')) {
      return 'medium';
    }
  }
  
  return 'high';
};

const Card3DFallback: React.FC<{ card: CardData }> = ({ card }) => (
  <div className="w-full h-full bg-surface-medium flex items-center justify-center rounded-xl">
    <div className="text-center text-white p-8">
      <div className="w-32 h-44 bg-surface-dark rounded-lg mx-auto mb-4 flex items-center justify-center">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-text-muted">Card</span>
        )}
      </div>
      <p className="text-sm text-text-secondary">3D viewer unavailable</p>
      <p className="text-xs text-text-muted mt-1">WebGL not supported</p>
    </div>
  </div>
);

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  card,
  className = '',
  interactive = true,
  autoRotate = false,
  showStats = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());

  // Check WebGL support on mount
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
    setPerformanceMode(getPerformanceMode());
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!showStats) return;

    const monitorPerformance = () => {
      frameCount.current++;
      const now = performance.now();
      
      if (now - lastFrameTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastFrameTime.current));
        console.log(`3D Card Viewer FPS: ${fps}`);
        
        // Adaptive quality based on performance
        if (fps < 30 && performanceMode === 'high') {
          setPerformanceMode('medium');
        } else if (fps < 20 && performanceMode === 'medium') {
          setPerformanceMode('low');
        }
        
        frameCount.current = 0;
        lastFrameTime.current = now;
      }
      
      requestAnimationFrame(monitorPerformance);
    };
    
    const id = requestAnimationFrame(monitorPerformance);
    return () => cancelAnimationFrame(id);
  }, [showStats, performanceMode]);

  // Fallback for unsupported devices
  if (!webGLSupported) {
    return <Card3DFallback card={card} />;
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`w-full h-full relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ErrorBoundary fallback={() => <Card3DFallback card={card} />}>
        <Suspense fallback={<Card3DFallback card={card} />}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            shadows={performanceMode === 'high'}
            dpr={performanceMode === 'high' ? [1, 2] : 1}
            gl={{ 
              antialias: performanceMode !== 'low',
              alpha: true,
              powerPreference: 'high-performance'
            }}
          >
            {/* Lighting setup */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow={performanceMode === 'high'}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-5, 5, 5]} intensity={0.5} />

            {/* Environment for reflections */}
            {performanceMode !== 'low' && (
              <Environment preset="studio" />
            )}

            {/* Card component */}
            <Card3D
              card={card}
              isFlipped={isFlipped}
              isHovered={isHovered}
              onFlip={handleFlip}
              performanceMode={performanceMode}
            />

            {/* Contact shadows */}
            {performanceMode === 'high' && (
              <ContactShadows
                opacity={0.4}
                scale={10}
                blur={1}
                far={10}
                resolution={256}
                color="#000000"
              />
            )}

            {/* Controls */}
            {interactive && (
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                minDistance={3}
                maxDistance={10}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI - Math.PI / 6}
              />
            )}

            {/* Performance stats in development */}
            {showStats && process.env.NODE_ENV === 'development' && <Stats />}
          </Canvas>
        </Suspense>
      </ErrorBoundary>

      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
          {performanceMode.toUpperCase()}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center">
        {interactive ? 'Click to flip • Drag to rotate • Scroll to zoom' : 'Click to flip card'}
      </div>
    </div>
  );
};
