
import React from 'react';
import { HDRIEnvironment } from './HDRIEnvironment';
import { Stars, Float } from '@react-three/drei';

interface SportsVenueSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    venue?: 'basketball' | 'football' | 'baseball' | 'racing';
  };
}

export const SportsVenueSpace: React.FC<SportsVenueSpaceProps> = ({ config }) => {
  const getVenueHDRI = (venue: string) => {
    switch (venue) {
      case 'basketball':
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2048'; // Basketball court
      case 'football':
        return 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=2048'; // Football stadium
      case 'baseball':
        return 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=2048'; // Baseball field
      case 'racing':
        return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2048'; // Racing track
      default:
        return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=2048';
    }
  };

  return (
    <>
      <HDRIEnvironment
        hdriUrl={getVenueHDRI(config.venue || 'basketball')}
        exposure={1.2}
        backgroundBlurriness={0.1}
        environmentIntensity={config.lightIntensity}
      />
      
      {/* Stadium atmosphere particles */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 50,
              Math.random() * 20 + 5,
              (Math.random() - 0.5) * 50
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={config.ambientColor}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Stadium lights effect */}
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#ffffff" />
      <pointLight position={[10, 12, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, 12, -10]} intensity={0.6} color="#ffffff" />
    </>
  );
};
