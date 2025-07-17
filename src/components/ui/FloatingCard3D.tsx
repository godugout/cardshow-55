import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

type AnimationMode = 'frozen' | 'showcase' | 'ice' | 'gold' | 'glass' | 'holo';

interface FloatingCardProps {
  mode: AnimationMode;
  intensity: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ mode, intensity }) => {
  const cardRef = useRef<THREE.Mesh>(null);
  const effectsLayerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!cardRef.current || !effectsLayerRef.current) return;
    
    const time = state.clock.elapsedTime;
    const factor = intensity;
    
    let posX = 0, posY = 0, posZ = 0;
    let rotX = 0, rotY = 0, rotZ = 0;
    
    switch (mode) {
      case 'frozen':
        // All values already at 0
        effectsLayerRef.current.visible = false;
        break;
        
      case 'showcase':
        // Dramatic effects demonstration
        posY = Math.sin(time * 1.2) * 0.08 * factor;
        posX = Math.sin(time * 0.9) * 0.06 * factor;
        rotY = time * 0.3 * factor;
        rotX = Math.sin(time * 0.8) * 0.05 * factor;
        rotZ = Math.sin(time * 1.1) * 0.03 * factor;
        effectsLayerRef.current.visible = true;
        break;
        
      case 'ice':
        // Gentle floating like frozen in ice
        posY = Math.sin(time * 0.4) * 0.02 * factor;
        rotY = Math.sin(time * 0.3) * 0.01 * factor;
        effectsLayerRef.current.visible = false;
        break;
        
      case 'gold':
        // More dramatic rotation to show DuckTales-style gold shine
        rotY = Math.sin(time * 0.8) * 0.08 * factor;
        rotX = Math.sin(time * 0.6) * 0.04 * factor;
        posY = Math.sin(time * 1.0) * 0.02 * factor;
        effectsLayerRef.current.visible = false;
        break;
        
      case 'glass':
        // Gentle diamond-like movements to show crystal facets
        posY = Math.sin(time * 0.8) * 0.03 * factor;
        rotY = Math.sin(time * 0.5) * 0.04 * factor;
        rotX = Math.sin(time * 0.6) * 0.02 * factor;
        effectsLayerRef.current.visible = false;
        break;
        
      case 'holo':
        // Ultimate holographic effects - maximum movement
        posY = Math.sin(time * 1.5) * 0.12 * factor;
        posX = Math.sin(time * 1.1) * 0.08 * factor;
        posZ = Math.sin(time * 0.9) * 0.02 * factor;
        rotY = time * 0.5 * factor;
        rotX = Math.sin(time * 1.3) * 0.08 * factor;
        rotZ = Math.sin(time * 1.7) * 0.05 * factor;
        effectsLayerRef.current.visible = true;
        break;
    }
    
    // Apply the same transforms to both card and effects layer
    cardRef.current.position.set(posX, posY, posZ);
    cardRef.current.rotation.set(rotX, rotY, rotZ);
    
    // Effects layer follows exactly with Z offset
    effectsLayerRef.current.position.set(posX, posY, posZ + 0.051);
    effectsLayerRef.current.rotation.set(rotX, rotY, rotZ);
  });

  // Create advanced materials
  const getCardMaterial = () => {
    const time = Date.now() * 0.001;
    
    switch (mode) {
      case 'ice':
        return (
          <meshPhysicalMaterial
            color="#e6f3ff"
            metalness={0}
            roughness={0}
            transmission={0.98}
            transparent={true}
            opacity={0.4}
            thickness={0.2}
            ior={1.309}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#cce7ff"
            emissiveIntensity={0.05}
            side={THREE.DoubleSide}
          />
        );
      
      case 'gold':
        return (
          <meshStandardMaterial 
            color="#ffed4e"
            metalness={1}
            roughness={0.02}
            emissive="#ff9500"
            emissiveIntensity={0.4}
            envMapIntensity={2}
          />
        );
      
      case 'glass':
        return (
          <meshPhysicalMaterial
            color="#e6f7ff"
            metalness={0}
            roughness={0}
            transmission={0.99}
            transparent={true}
            opacity={0.6}
            thickness={0.15}
            ior={2.417}
            clearcoat={1}
            clearcoatRoughness={0}
            emissive="#b3e0ff"
            emissiveIntensity={0.08}
            side={THREE.DoubleSide}
            envMapIntensity={3}
          />
        );
      
      case 'holo':
        const hue = (time * 50) % 360;
        const emissiveHue = (time * 70) % 360;
        return (
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(hue / 360, 0.8, 0.6)}
            metalness={1}
            roughness={0.1}
            emissive={new THREE.Color().setHSL(emissiveHue / 360, 0.9, 0.4)}
            emissiveIntensity={0.8}
            envMapIntensity={4}
          />
        );
      
      default:
        return (
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
            emissive="#0f0f2a"
            emissiveIntensity={mode === 'showcase' ? 0.3 : 0.05}
            envMapIntensity={1.5}
          />
        );
    }
  };

  // Dynamic geometry based on mode
  const getCardGeometry = () => {
    if (mode === 'gold') {
      // Trapezoidal gold bar shape
      return <boxGeometry args={[2.3, 3.3, 0.15]} />;
    }
    return <boxGeometry args={[2.3, 3.3, 0.1]} />;
  };

  return (
    <group>
      {/* Main card with dynamic material */}
      <mesh ref={cardRef}>
        {getCardGeometry()}
        {getCardMaterial()}
      </mesh>
      
      {/* Advanced Effects Layer */}
      <mesh ref={effectsLayerRef} visible={mode === 'showcase' || mode === 'holo'}>
        <planeGeometry args={[2.25, 3.25]} />
        <meshStandardMaterial 
          color={mode === 'holo' ? new THREE.Color().setHSL(((Date.now() * 0.003) % 360) / 360, 0.9, 0.7) : "#ff6b6b"}
          metalness={mode === 'holo' ? 1 : 0.8}
          roughness={mode === 'holo' ? 0.05 : 0.2}
          transparent
          opacity={mode === 'holo' ? 0.9 : 0.7}
          emissive={mode === 'holo' ? new THREE.Color().setHSL(((Date.now() * 0.004) % 360) / 360, 0.8, 0.4) : "#ff3333"}
          emissiveIntensity={mode === 'holo' ? 1.0 : 0.4}
          envMapIntensity={mode === 'holo' ? 3 : 1}
        />
      </mesh>
    </group>
  );
};

interface CardMonolithProps {
  mode: AnimationMode;
  intensity: number;
}

const CardMonolith: React.FC<CardMonolithProps> = ({ mode, intensity }) => {
  const glassRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (glassRef.current) {
      // Position the entire glass case lower on screen
      glassRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 - 2;
      
      // Tilt the glass case towards the sun
      const tiltAngle = -0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      glassRef.current.rotation.x = tiltAngle;
      glassRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <>
      {/* Glass Case with Floating Card */}
      <group ref={glassRef} position={[0, 0, 0]}>
        {/* Floating Card inside the case */}
        <FloatingCard mode={mode} intensity={intensity} />
        
        {/* Clear glass case - same dimensions as before */}
        <mesh>
          <boxGeometry args={[2.6, 3.6, 0.32]} />
          <meshStandardMaterial 
            color="#e6f3ff"
            metalness={0}
            roughness={0}
            transparent
            opacity={0.12}
            emissive="#ffffff"
            emissiveIntensity={0.03}
          />
        </mesh>
      </group>
      
      {/* Text positioned outside the rotating glass case group */}
      <Text
        position={[0, -4.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Mode: {mode.toUpperCase()} | Intensity: {intensity.toFixed(1)}
      </Text>
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AnimationMode>('frozen');
  const [currentIntensity, setCurrentIntensity] = useState(1);
  const [autoMode, setAutoMode] = useState(true);

  // Auto-cycle through modes for demo (only when autoMode is true)
  useEffect(() => {
    if (!autoMode) return;
    
    const interval = setInterval(() => {
      setCurrentMode(prev => {
        const modes: AnimationMode[] = ['frozen', 'ice', 'gold', 'glass', 'holo', 'showcase'];
        const currentIndex = modes.indexOf(prev);
        return modes[(currentIndex + 1) % modes.length];
      });
    }, 4000); // Slightly faster cycling

    return () => clearInterval(interval);
  }, [autoMode]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-purple-900/30 via-blue-900/20 to-black overflow-hidden relative">
      {/* Matching star field for seamless integration */}
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
        {/* Advanced Lighting Setup */}
        <Environment preset="studio" />
        
        {/* Key Light */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Rim Light */}
        <directionalLight
          position={[-5, 5, -5]}
          intensity={1}
          color="#87ceeb"
        />
        
        {/* Fill Light */}
        <ambientLight intensity={0.3} color="#f0f8ff" />
        
        <CardMonolith mode={currentMode} intensity={currentIntensity} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={25}
          minDistance={3}
          autoRotate={false}
          target={[0, 0, 0]}
        />
        
        <fog args={['#0a0a2e', 30, 200]} />
      </Canvas>
      
      {/* Sticky Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">Animation Mode:</span>
              <div className="flex gap-1 flex-wrap">
                {(['frozen', 'ice', 'gold', 'glass', 'holo', 'showcase'] as AnimationMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setCurrentMode(mode);
                      setAutoMode(false); // Stop auto-switching when user clicks
                    }}
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
            
            <div className="flex items-center gap-3">
              <label className="text-white text-sm font-medium">Intensity:</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={currentIntensity}
                onChange={(e) => setCurrentIntensity(parseFloat(e.target.value))}
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