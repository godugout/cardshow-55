import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSystem } from '../materials/MaterialSystem';
import { type CRDVisualStyle } from '../styles/StyleRegistry';

// Advanced hover glow shader
const glowFragmentShader = `
  uniform vec3 color;
  uniform float intensity;
  uniform float time;
  
  varying vec2 vUv;
  
  void main() {
    float distanceFromCenter = length(vUv - 0.5) * 2.0;
    
    // Pulse effect
    float pulse = (sin(time * 3.0) * 0.5 + 0.5) * 0.3 + 0.7;
    
    // Edge glow
    float edgeGlow = smoothstep(0.5, 1.0, distanceFromCenter);
    
    // Radial waves
    float waves = sin((distanceFromCenter * 10.0) - time * 5.0) * 0.5 + 0.5;
    waves *= smoothstep(1.0, 0.0, distanceFromCenter); // Fade waves at edges
    
    // Combine effects
    float glowStrength = pulse * (edgeGlow * 0.7 + waves * 0.3);
    glowStrength = pow(glowStrength, 2.0) * intensity;
    
    // Output color with glow
    gl_FragColor = vec4(color, glowStrength);
  }
`;

const glowVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface MaterialSatelliteProps {
  position: THREE.Vector3;
  style: CRDVisualStyle;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export const MaterialSatellite: React.FC<MaterialSatelliteProps> = ({
  position,
  style,
  isActive,
  isHovered,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Mesh>(null);
  
  // Create glow shader material
  const glowMaterial = useMemo(() => {
    const styleColor = new THREE.Color(style.uiPreviewGradient);
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: styleColor },
        intensity: { value: 0.0 },
        time: { value: 0.0 }
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, [style.uiPreviewGradient]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Gentle floating animation
    const float = Math.sin(time * 2 + position.x) * 0.02;
    meshRef.current.position.y = position.y + float;
    
    // Update glow effect
    if (glowRef.current) {
      // Update shader uniforms
      const material = glowRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = time;
      
      // Set glow intensity based on hover/active state
      const targetIntensity = isActive ? 2.0 : isHovered ? 1.0 : 0.0;
      material.uniforms.intensity.value += (targetIntensity - material.uniforms.intensity.value) * 0.1;
      
      // Scale glow effect
      const targetScale = isActive ? 2.5 : isHovered ? 2.0 : 1.5;
      glowRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Update wave effect
    if (waveRef.current && (isHovered || isActive)) {
      waveRef.current.visible = true;
      waveRef.current.scale.x = waveRef.current.scale.y = waveRef.current.scale.z = 
        (isActive ? 2.0 : 1.5) + Math.sin(time * 4) * 0.2;
      
      const material = waveRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (isActive ? 0.6 : isHovered ? 0.4 : 0) * (0.7 + Math.sin(time * 5) * 0.3);
    } else if (waveRef.current) {
      waveRef.current.visible = false;
    }
  });

  const handlePointerEnter = () => onHover(true);
  const handlePointerLeave = () => onHover(false);

  return (
    <group position={position}>
      {/* Glow effect (always rendered, but intensity changes) */}
      <mesh ref={glowRef} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      
      {/* Pulsing wave effect */}
      <mesh ref={waveRef} visible={isHovered || isActive}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color(style.uiPreviewGradient)} 
          transparent={true} 
          opacity={0.4} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Main Satellite with Actual Material */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        scale={isActive ? 1.8 : isHovered ? 1.15 : 1}
      >
        {style.category === 'premium' ? (
          <boxGeometry args={[0.2, 0.2, 0.2]} />
        ) : (
          <sphereGeometry args={[0.15, 16, 16]} />
        )}
        
        {/* Show the actual material but don't adjust intensity on hover */}
        <MaterialSystem 
          mode={style.id as any} 
          intensity={isActive ? 2.2 : 1}
          type="card"
        />
      </mesh>

      {/* Lock indicator for locked styles */}
      {style.locked && (
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      )}
    </group>
  );
};