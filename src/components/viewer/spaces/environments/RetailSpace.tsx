
import React from 'react';
import { HDRIEnvironment } from './HDRIEnvironment';
import { Float } from '@react-three/drei';

interface RetailSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    venue?: 'cardshop' | 'gaming' | 'comic' | 'convention';
  };
}

export const RetailSpace: React.FC<RetailSpaceProps> = ({ config }) => {
  const getVenueHDRI = (venue: string) => {
    switch (venue) {
      case 'cardshop':
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2048'; // Retail store
      case 'gaming':
        return 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=2048'; // Gaming setup
      case 'comic':
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2048'; // Book/comic store
      case 'convention':
        return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2048'; // Convention center
      default:
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2048';
    }
  };

  return (
    <>
      <HDRIEnvironment
        hdriUrl={getVenueHDRI(config.venue || 'cardshop')}
        exposure={1.1}
        backgroundBlurriness={0.08}
        environmentIntensity={config.lightIntensity}
      />
      
      {/* Store atmosphere with floating card-like particles */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 25,
              Math.random() * 10 + 2,
              (Math.random() - 0.5) * 25
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
          >
            <planeGeometry args={[0.3, 0.4]} />
            <meshBasicMaterial
              color="#ff6b35"
              transparent
              opacity={0.6}
              side={2}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Retail lighting */}
      <directionalLight position={[5, 8, 5]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-5, 5, -5]} intensity={0.4} color="#ffa500" />
    </>
  );
};
