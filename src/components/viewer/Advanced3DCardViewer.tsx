
import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useTexture, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCw, Camera, Share2, Settings, Volume2, VolumeX } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface Advanced3DCardViewerProps {
  card: CardData;
  autoRotate?: boolean;
  quality?: 'low' | 'medium' | 'high';
  showControls?: boolean;
  onShare?: () => void;
  onScreenshot?: () => void;
}

function Advanced3DCard({ card, quality = 'medium' }: { card: CardData; quality: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Use placeholder if no image URL
  const imageUrl = card.image_url || '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png';
  const texture = useTexture(imageUrl);
  
  // Standard trading card dimensions with enhanced depth
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardDepth = 0.05; // Increased depth for better 3D effect
  
  // Quality-based settings
  const particleCount = quality === 'high' ? 100 : quality === 'medium' ? 50 : 25;
  const effectIntensity = quality === 'high' ? 1 : quality === 'medium' ? 0.7 : 0.5;
  
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
      
      // Holographic effect for rare cards
      if (card.design_metadata?.effects?.holographic) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2 * effectIntensity;
        
        // Color cycling for holographic effect
        const hue = (state.clock.elapsedTime * 0.1) % 1;
        material.emissive.setHSL(hue, 0.5, 0.2);
      }
      
      // Chrome effect
      if (card.design_metadata?.effects?.chrome) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.metalness = 0.9;
        material.roughness = 0.1;
      }
    }
  });
  
  // Enhanced material properties
  const materialProps = {
    map: texture,
    roughness: card.design_metadata?.effects?.chrome ? 0.1 : 0.4,
    metalness: card.design_metadata?.effects?.chrome ? 0.9 : 0.1,
    emissive: card.design_metadata?.effects?.holographic ? new THREE.Color(0x002244) : new THREE.Color(0x000000),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98,
  };
  
  return (
    <group ref={groupRef}>
      {/* Main card mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Card frame/border */}
      <mesh position={[0, 0, cardDepth/2 + 0.001]} castShadow>
        <planeGeometry args={[cardWidth + 0.1, cardHeight + 0.1]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Particle effects for legendary cards */}
      {card.design_metadata?.effects?.holographic && quality !== 'low' && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={new Float32Array(Array.from({ length: particleCount * 3 }, () => 
                (Math.random() - 0.5) * 5
              ))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial 
            size={0.02} 
            color="#00ff88" 
            transparent 
            opacity={0.6 * effectIntensity}
            sizeAttenuation={true}
          />
        </points>
      )}
    </group>
  );
}

function Advanced3DScene({ card, autoRotate, quality }: { 
  card: CardData; 
  autoRotate: boolean; 
  quality: string;
}) {
  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#4444ff" />
      <spotLight 
        position={[0, 5, 5]} 
        intensity={0.5} 
        angle={0.3} 
        penumbra={0.2}
        castShadow
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* 3D Card */}
      <Advanced3DCard card={card} quality={quality} />
      
      {/* Enhanced shadows */}
      <ContactShadows
        opacity={0.4}
        scale={8}
        blur={2}
        far={8}
        resolution={512}
        color="#000000"
      />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minDistance={4}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Custom camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
    </>
  );
}

export const Advanced3DCardViewer: React.FC<Advanced3DCardViewerProps> = ({
  card,
  autoRotate = false,
  quality = 'medium',
  showControls = true,
  onShare,
  onScreenshot
}) => {
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high'>(quality);
  
  const handleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);
  
  const handleAutoRotateToggle = useCallback(() => {
    setIsAutoRotating(!isAutoRotating);
  }, [isAutoRotating]);
  
  const handleQualityChange = useCallback((newQuality: 'low' | 'medium' | 'high') => {
    setRenderQuality(newQuality);
  }, []);
  
  return (
    <div className={`relative bg-gradient-to-br from-gray-900 to-black ${
      isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-[600px]'
    } rounded-xl overflow-hidden`}>
      
      {/* 3D Canvas */}
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-white text-center">
            <div className="w-16 h-16 border-4 border-[#00C851] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading 3D Viewer...</p>
          </div>
        </div>
      }>
        <Canvas
          shadows
          dpr={[1, renderQuality === 'high' ? 2 : 1.5]}
          gl={{ 
            antialias: renderQuality !== 'low', 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          camera={{ position: [0, 0, 8], fov: 50 }}
        >
          <Advanced3DScene 
            card={card} 
            autoRotate={isAutoRotating} 
            quality={renderQuality}
          />
        </Canvas>
      </Suspense>
      
      {/* Controls Overlay */}
      {showControls && (
        <>
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleFullscreen}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onScreenshot}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
              title="Screenshot"
            >
              <Camera className="w-5 h-5" />
            </button>
            
            <button
              onClick={onShare}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleAutoRotateToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isAutoRotating 
                    ? 'bg-[#00C851] text-black' 
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                }`}
                title="Auto Rotate"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
                title="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Quality Selector */}
            <div className="flex gap-1 bg-black bg-opacity-50 rounded-lg p-1">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    renderQuality === q
                      ? 'bg-[#00C851] text-black'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Card Info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-center">
            <h3 className="font-bold text-lg">{card.title}</h3>
            {card.design_metadata?.effects && (
              <div className="flex gap-1 justify-center mt-1">
                {card.design_metadata.effects.holographic && (
                  <span className="px-2 py-1 bg-purple-500 bg-opacity-20 rounded text-xs text-purple-300">
                    Holographic
                  </span>
                )}
                {card.design_metadata.effects.chrome && (
                  <span className="px-2 py-1 bg-gray-500 bg-opacity-20 rounded text-xs text-gray-300">
                    Chrome
                  </span>
                )}
                {card.design_metadata.effects.foil && (
                  <span className="px-2 py-1 bg-pink-500 bg-opacity-20 rounded text-xs text-pink-300">
                    Foil
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Touch Instructions */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg">
            <p>Drag to rotate • Pinch to zoom • Tap controls</p>
          </div>
        </>
      )}
    </div>
  );
};
