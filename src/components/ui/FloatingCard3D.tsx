import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

type AnimationMode = 'frozen' | 'showcase';

interface FloatingCardProps {
  mode: AnimationMode;
  intensity: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ mode, intensity }) => {
  const cardRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!cardRef.current) return;
    
    const time = state.clock.elapsedTime;
    const factor = intensity;
    
    switch (mode) {
      case 'frozen':
        // Perfectly centered and still
        cardRef.current.position.set(0, 0, 0);
        cardRef.current.rotation.set(0, 0, 0);
        break;
        
      case 'showcase':
        // Dramatic effects demonstration
        cardRef.current.position.y = Math.sin(time * 1.2) * 0.08 * factor;
        cardRef.current.position.x = Math.sin(time * 0.9) * 0.06 * factor;
        cardRef.current.rotation.y = time * 0.3 * factor;
        cardRef.current.rotation.x = Math.sin(time * 0.8) * 0.05 * factor;
        cardRef.current.rotation.z = Math.sin(time * 1.1) * 0.03 * factor;
        break;
    }
  });

  return (
    <mesh ref={cardRef}>
      {/* Thin card - 1/3 the thickness of original monolith */}
      <boxGeometry args={[2.3, 3.3, 0.1]} />
      <meshStandardMaterial 
        color="#1a1a2e"
        metalness={0.9}
        roughness={0.1}
        emissive="#0f0f2a"
        emissiveIntensity={mode === 'showcase' ? 0.3 : 0.05}
      />
    </mesh>
  );
};

interface CardMonolithProps {
  mode: AnimationMode;
  intensity: number;
}

const CardMonolith: React.FC<CardMonolithProps> = ({ mode, intensity }) => {
  const glassRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (glassRef.current) {
      // Position the entire glass case lower on screen
      glassRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 - 2;
      
      // Tilt the glass case towards the sun
      const tiltAngle = -0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      glassRef.current.rotation.x = tiltAngle;
      glassRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
    }
    
    if (sunRef.current) {
      sunRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      sunRef.current.scale.setScalar(pulse);
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
        
        {/* Demo Controls */}
        <group position={[0, -2.2, 0]}>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Mode: {mode.toUpperCase()} | Intensity: {intensity.toFixed(1)}
          </Text>
        </group>
      </group>
      
      {/* Realistic Sun */}
      <group ref={sunRef} position={[0, 2, -10]}>
        {/* Sun light source */}
        <pointLight
          intensity={8}
          color="#ffaa00"
          distance={50}
          decay={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Sun core */}
        <mesh>
          <sphereGeometry args={[1.8, 64, 64]} />
          <meshStandardMaterial 
            color="#ffdd44"
            emissive="#ff8800"
            emissiveIntensity={3}
          />
        </mesh>
        
        {/* Sun's chromosphere */}
        <mesh>
          <sphereGeometry args={[2.2, 32, 32]} />
          <meshStandardMaterial 
            color="#ff4400"
            emissive="#ff6600"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Sun's corona */}
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial 
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={0.3}
            transparent
            opacity={0.15}
          />
        </mesh>
        
        {/* Outer corona glow */}
        <mesh>
          <sphereGeometry args={[4, 24, 24]} />
          <meshStandardMaterial 
            color="#ffccaa"
            emissive="#ffccaa"
            emissiveIntensity={0.1}
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
      
      {/* Deep space star field */}
      {Array.from({ length: 200 }).map((_, i) => {
        const distance = Math.random() * 200 + 50;
        const size = Math.random() * 0.08 + 0.01;
        const intensity = Math.random() * 0.3 + 0.1;
        
        // Gradient colors from purple to blue to match background
        const colors = ['#9333ea', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * distance,
              (Math.random() - 0.5) * distance,
              (Math.random() - 0.5) * distance - 50
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={intensity}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Bright foreground stars */}
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 0.04 + 0.02;
        const intensity = Math.random() * 0.8 + 0.4;
        
        // Warmer colors for foreground stars
        const colors = ['#ffffff', '#fff4e6', '#fef3c7', '#fde68a'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <mesh
            key={`bright-${i}`}
            position={[
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 60,
              Math.random() * 30 - 15
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={intensity}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const FloatingCard3D: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AnimationMode>('frozen');
  const [currentIntensity, setCurrentIntensity] = useState(1);

  // Auto-cycle through modes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMode(prev => {
        const modes: AnimationMode[] = ['frozen', 'showcase'];
        const currentIndex = modes.indexOf(prev);
        return modes[(currentIndex + 1) % modes.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        gl={{ antialias: true, alpha: true }}
        scene={{ background: null }}
      >
        {/* Minimal ambient space lighting */}
        <ambientLight intensity={0.02} color="#000033" />
        
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
              <div className="flex gap-1">
                {(['frozen', 'showcase'] as AnimationMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCurrentMode(mode)}
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