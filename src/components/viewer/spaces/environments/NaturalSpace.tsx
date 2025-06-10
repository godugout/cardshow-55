
import React from 'react';
import { HDRIEnvironment } from './HDRIEnvironment';
import { Float } from '@react-three/drei';

interface NaturalSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    venue?: 'mountain' | 'beach' | 'forest' | 'desert';
    animationSpeed?: number;
  };
}

export const NaturalSpace: React.FC<NaturalSpaceProps> = ({ config }) => {
  const getVenueHDRI = (venue: string) => {
    switch (venue) {
      case 'mountain':
        return 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2048'; // Mountain vista
      case 'beach':
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2048'; // Beach sunset
      case 'forest':
        return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2048'; // Forest
      case 'desert':
        return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=2048'; // Desert landscape
      default:
        return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2048';
    }
  };

  const getEnvironmentEffects = (venue: string) => {
    switch (venue) {
      case 'forest':
        return { color: '#90EE90', count: 25, speed: 0.3 }; // Green leaves
      case 'beach':
        return { color: '#87CEEB', count: 15, speed: 0.8 }; // Water droplets
      case 'mountain':
        return { color: '#FFFFFF', count: 30, speed: 0.2 }; // Snow
      case 'desert':
        return { color: '#F4A460', count: 20, speed: 1.0 }; // Sand particles
      default:
        return { color: '#90EE90', count: 25, speed: 0.3 };
    }
  };

  const effects = getEnvironmentEffects(config.venue || 'forest');

  return (
    <>
      <HDRIEnvironment
        hdriUrl={getVenueHDRI(config.venue || 'forest')}
        exposure={1.0}
        backgroundBlurriness={0.02}
        environmentIntensity={config.lightIntensity}
        rotationY={0.1}
      />
      
      {/* Natural environment particles */}
      <Float speed={effects.speed} rotationIntensity={0.1} floatIntensity={0.2}>
        {Array.from({ length: effects.count }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 40,
              Math.random() * 20 + 1,
              (Math.random() - 0.5) * 40
            ]}
          >
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial
              color={effects.color}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Natural lighting */}
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={config.lightIntensity * 0.8} 
        color="#fff8dc"
        castShadow
      />
      <ambientLight intensity={0.4} color={config.ambientColor} />
    </>
  );
};
