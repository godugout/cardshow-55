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
  uniform vec3 selectedColor;
  uniform vec3 baseColor;
  uniform float flowSpeed;
  
  void main() {
    vAlpha = alpha;
    
    // Mix colors based on proximity to selected satellite
    float selectedInfluence = smoothstep(2.0, 0.5, distance(position, vec3(0.0)));
    vColor = mix(baseColor, selectedColor, selectedInfluence);
    
    // Animate position along the ring
    float animatedPhase = phase + time * flowSpeed;
    vec3 animatedPosition = position;
    animatedPosition.y += sin(animatedPhase) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Dynamic size based on distance and animation
    float distanceSize = size * (1.0 + sin(animatedPhase * 2.0) * 0.3);
    gl_PointSize = distanceSize * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  
  void main() {
    // Create circular particles with soft edges
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    float alpha = vAlpha * (1.0 - smoothstep(0.3, 0.5, dist));
    
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
    const count = 500; // Number of particles
    const geo = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // Add some randomness to the radius for organic flow
      const particleRadius = radius + (Math.random() - 0.5) * 0.3;
      
      positions[i * 3] = Math.cos(angle) * particleRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // Slight vertical spread
      positions[i * 3 + 2] = Math.sin(angle) * particleRadius;
      
      alphas[i] = Math.random() * 0.8 + 0.2; // Random alpha for variation
      sizes[i] = Math.random() * 3 + 1; // Random sizes
      phases[i] = Math.random() * Math.PI * 2; // Random phase for animation
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
    if (gradient.includes('#')) {
      const colorMatch = gradient.match(/#[0-9a-fA-F]{6}/);
      if (colorMatch) {
        return new THREE.Color(colorMatch[0]);
      }
    }
    return new THREE.Color(0x22c55e);
  };

  // Shader material with uniforms
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        selectedColor: { value: getStyleColor(selectedStyleId) },
        baseColor: { value: new THREE.Color(0x06b6d4) }, // CRD blue
        flowSpeed: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, [selectedStyleId, satellitePositions]);

  // Animation loop
  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update time uniform for animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    
    // Update flow speed based on interaction
    const flowSpeed = hoveredSatellite ? 2.0 : 1.0;
    materialRef.current.uniforms.flowSpeed.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.flowSpeed.value,
      flowSpeed,
      0.05
    );
    
    // Update selected color when style changes
    const newColor = getStyleColor(selectedStyleId);
    materialRef.current.uniforms.selectedColor.value.lerp(newColor, 0.1);
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
};