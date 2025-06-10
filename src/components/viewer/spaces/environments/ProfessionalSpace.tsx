
import React from 'react';
import { HDRIEnvironment } from './HDRIEnvironment';
import { Float } from '@react-three/drei';

interface ProfessionalSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    venue?: 'office' | 'studio' | 'broadcast' | 'workshop';
  };
}

export const ProfessionalSpace: React.FC<ProfessionalSpaceProps> = ({ config }) => {
  const getVenueHDRI = (venue: string) => {
    switch (venue) {
      case 'office':
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2048'; // Modern office
      case 'studio':
        return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=2048'; // Photography studio
      case 'broadcast':
        return 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=2048'; // Broadcast studio
      case 'workshop':
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=2048'; // Workshop
      default:
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2048';
    }
  };

  return (
    <>
      <HDRIEnvironment
        hdriUrl={getVenueHDRI(config.venue || 'office')}
        exposure={0.9}
        backgroundBlurriness={0.06}
        environmentIntensity={config.lightIntensity}
      />
      
      {/* Professional environment effects */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.1}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              Math.random() * 8 + 2,
              (Math.random() - 0.5) * 20
            ]}
          >
            <octahedronGeometry args={[0.04]} />
            <meshBasicMaterial
              color="#4a90e2"
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Professional lighting setup */}
      <spotLight 
        position={[0, 8, 3]} 
        intensity={0.9} 
        angle={Math.PI / 4}
        penumbra={0.3}
        color="#ffffff"
      />
      <pointLight position={[5, 6, 0]} intensity={0.5} color="#f0f8ff" />
      <pointLight position={[-5, 6, 0]} intensity={0.5} color="#f0f8ff" />
    </>
  );
};
