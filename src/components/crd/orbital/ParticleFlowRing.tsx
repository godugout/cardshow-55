import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFlowRingProps {
  radius: number;
  selectedStyleId: string;
  hoveredSatellite: string | null;
  satellitePositions: Array<{ style: any; position: THREE.Vector3; angle: number }>;
}

const vertexShader = `
  attribute float alpha;
  attribute float size;
  attribute float phase;
  
  varying float vAlpha;
  varying vec3 vColor;
  
  uniform float time;
  uniform vec3 orangeColor;
  uniform vec3 blueColor;
  uniform float flowSpeed;
  
  void main() {
    vAlpha = alpha * 0.15; // Much more subtle
    
    // Create gradient from orange to blue around the ring
    float angle = atan(position.z, position.x) + time * flowSpeed * 0.2;
    float gradientFactor = (sin(angle) + 1.0) * 0.5;
    vColor = mix(orangeColor, blueColor, gradientFactor);
    
    // Animate position along the ring with subtle movement
    float animatedPhase = phase + time * flowSpeed * 0.5;
    vec3 animatedPosition = position;
    animatedPosition.y += sin(animatedPhase) * 0.05;
    
    // Add subtle radius variation for organic flow
    float radiusVariation = sin(animatedPhase * 3.0) * 0.1;
    animatedPosition.x += normalize(animatedPosition).x * radiusVariation;
    animatedPosition.z += normalize(animatedPosition).z * radiusVariation;
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Smaller, softer particles
    float distanceSize = size * 0.5 * (1.0 + sin(animatedPhase * 2.0) * 0.2);
    gl_PointSize = distanceSize * (200.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // Create very soft, gas-like particles
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Very soft falloff for gas-like effect
    float alpha = vAlpha * pow(1.0 - dist * 2.0, 3.0);
    alpha *= 0.3; // Extra subtle
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const ParticleFlowRing: React.FC<ParticleFlowRingProps> = ({
  radius,
  selectedStyleId,
  hoveredSatellite,
  satellitePositions
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create particle geometry and attributes
  const { geometry, particleCount } = useMemo(() => {
    const count = 800; // More particles for gas effect
    const geo = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // More spread for gas effect
      const radiusSpread = (Math.random() - 0.5) * 0.8;
      const particleRadius = radius + radiusSpread;
      
      positions[i * 3] = Math.cos(angle) * particleRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4; // More vertical spread
      positions[i * 3 + 2] = Math.sin(angle) * particleRadius;
      
      alphas[i] = Math.random() * 0.4 + 0.1; // Much lower alpha
      sizes[i] = Math.random() * 8 + 2; // Larger but softer particles
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    
    return { geometry: geo, particleCount: count };
  }, [radius]);

  // Get color for selected style
  const getStyleColor = (styleId: string) => {
    const style = satellitePositions.find(s => s.style.id === styleId)?.style;
    if (!style) return new THREE.Color(0x22c55e); // Default green
    
    // Extract color from gradient or use default
    const gradient = style.ui_preview_gradient;
    if (gradient && gradient.includes('#')) {
      const colorMatch = gradient.match(/#[0-9a-fA-F]{6}/);
      if (colorMatch) {
        return new THREE.Color(colorMatch[0]);
      }
    }
    return new THREE.Color(0x22c55e);
  };

  // Shader material with CRD gradient colors
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        orangeColor: { value: new THREE.Color('#ff6b35') }, // CRD orange
        blueColor: { value: new THREE.Color('#06b6d4') }, // CRD blue
        flowSpeed: { value: 0.5 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update time uniform for animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    
    // Subtle flow speed changes on interaction
    const flowSpeed = hoveredSatellite ? 0.8 : 0.5;
    materialRef.current.uniforms.flowSpeed.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.flowSpeed.value,
      flowSpeed,
      0.02
    );
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
};