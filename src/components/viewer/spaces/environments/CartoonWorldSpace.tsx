
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cloud, Stars } from '@react-three/drei';

interface CartoonWorldSpaceProps {
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
  };
}

export const CartoonWorldSpace: React.FC<CartoonWorldSpaceProps> = ({ config }) => {
  const cloudsRef = useRef<any>(null);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#87CEEB', 20, 100]} />
      
      {/* Cartoon-style clouds */}
      <group ref={cloudsRef}>
        <Cloud
          position={[-20, 10, -20]}
          speed={0.4}
          opacity={0.8}
          color="#ffffff"
          segments={20}
        />
        <Cloud
          position={[20, 15, -30]}
          speed={0.3}
          opacity={0.6}
          color="#ffeb3b"
          segments={15}
        />
        <Cloud
          position={[0, 20, -40]}
          speed={0.5}
          opacity={0.7}
          color="#ff9800"
          segments={25}
        />
        <Cloud
          position={[-30, 8, -25]}
          speed={0.2}
          opacity={0.9}
          color="#e91e63"
          segments={18}
        />
      </group>

      {/* Colorful stars */}
      <Stars 
        radius={80} 
        depth={40} 
        count={1000} 
        factor={8} 
        saturation={0.9} 
        fade 
        speed={0.5} 
      />
      
      {/* Floating geometric shapes */}
      <mesh position={[-15, 5, -10]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshLambertMaterial color="#4caf50" />
      </mesh>
      
      <mesh position={[15, -5, -15]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[1.5, 8, 6]} />
        <meshLambertMaterial color="#2196f3" />
      </mesh>
      
      <mesh position={[0, 10, -20]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[1, 3, 6]} />
        <meshLambertMaterial color="#ff5722" />
      </mesh>
    </>
  );
};
