
import React from 'react';
import { HDRIEnvironment } from './HDRIEnvironment';
import { Float } from '@react-three/drei';

interface CulturalSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    venue?: 'gallery' | 'concert' | 'library' | 'theater';
  };
}

export const CulturalSpace: React.FC<CulturalSpaceProps> = ({ config }) => {
  const getVenueHDRI = (venue: string) => {
    switch (venue) {
      case 'gallery':
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048'; // Art gallery
      case 'concert':
        return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2048'; // Concert hall
      case 'library':
        return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=2048'; // Library
      case 'theater':
        return 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=2048'; // Theater
      default:
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=2048';
    }
  };

  return (
    <>
      <HDRIEnvironment
        hdriUrl={getVenueHDRI(config.venue || 'gallery')}
        exposure={0.8}
        backgroundBlurriness={0.05}
        environmentIntensity={config.lightIntensity}
      />
      
      {/* Elegant ambient particles */}
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 30,
              Math.random() * 15 + 3,
              (Math.random() - 0.5) * 30
            ]}
          >
            <boxGeometry args={[0.02, 0.02, 0.02]} />
            <meshBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Museum/gallery lighting */}
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.8} 
        angle={Math.PI / 6}
        penumbra={0.5}
        color="#ffffff"
      />
      <ambientLight intensity={0.3} color={config.ambientColor} />
    </>
  );
};
