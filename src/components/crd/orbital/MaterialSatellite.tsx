import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialSystem } from '../materials/MaterialSystem';
import { type CRDVisualStyle } from '../styles/StyleRegistry';

// Shader for dust particles
const particleVertexShader = `
  attribute float size;
  attribute float phase;
  attribute float speed;
  
  uniform float time;
  uniform float hover;
  
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    vColor = color;
    
    // Particle movement
    float localTime = time * speed + phase;
    
    // Spiral motion with hover intensity
    float angle = localTime * 0.8;
    float radius = 0.2 + sin(localTime) * 0.05 * hover;
    float spiral = 0.05 * hover * sin(localTime * 3.0);
    
    // Calculate new position
    vec3 pos = position;
    pos.x += cos(angle) * radius;
    pos.z += sin(angle) * radius;
    pos.y += cos(localTime) * 0.05 * hover;
    
    // Apply hover intensity to size
    float dynamicSize = size * (1.0 + hover * 0.5);
    
    // Calculate opacity based on hover and spiral effect
    vOpacity = (0.2 + 0.8 * hover) * (0.5 + 0.5 * sin(localTime * 2.0));
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = dynamicSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  uniform sampler2D particleTexture;
  
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    // Soft particle look
    vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec4 texColor = texture2D(particleTexture, uv);
    
    // Soften the particles
    float alpha = texColor.a * vOpacity;
    alpha = smoothstep(0.0, 0.8, alpha);
    
    gl_FragColor = vec4(vColor, alpha);
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
  const particlesRef = useRef<THREE.Points>(null);
  const hoverIntensity = useRef(0);
  
  // Generate particle texture - a soft cloud-like particle
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Draw a soft gradient circle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Create particle system
  const [particles, particlesMaterial] = useMemo(() => {
    // Extract color from style
    const styleColor = new THREE.Color(style.uiPreviewGradient);
    
    // Particle count - more for active styles
    const particleCount = isActive ? 150 : 100;
    
    // Create geometry with custom attributes
    const geometry = new THREE.BufferGeometry();
    
    // Particle positions - initially scattered in a sphere
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      // Random position in a spherical shell
      const radius = 0.2 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (radius * 0.5) * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Slightly vary color for visual interest
      const colorVariation = 0.15;
      const r = Math.max(0, Math.min(1, styleColor.r + (Math.random() - 0.5) * colorVariation));
      const g = Math.max(0, Math.min(1, styleColor.g + (Math.random() - 0.5) * colorVariation));
      const b = Math.max(0, Math.min(1, styleColor.b + (Math.random() - 0.5) * colorVariation));
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
      
      // Random size, phase and speed for varied motion
      sizes[i] = 0.05 + Math.random() * 0.15;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    
    // Create material with custom shaders
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hover: { value: 0 },
        particleTexture: { value: particleTexture }
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    
    return [geometry, material];
  }, [style.uiPreviewGradient, isActive, particleTexture]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Gentle floating animation for the main satellite
    const float = Math.sin(time * 2 + position.x) * 0.02;
    meshRef.current.position.y = position.y + float;
    
    // Update particle system
    if (particlesRef.current && particlesMaterial) {
      // Update time uniform
      particlesMaterial.uniforms.time.value = time;
      
      // Smoothly transition hover intensity
      const targetHover = isActive ? 1.5 : isHovered ? 1.0 : 0.2;
      hoverIntensity.current += (targetHover - hoverIntensity.current) * 0.05;
      particlesMaterial.uniforms.hover.value = hoverIntensity.current;
    }
  });

  const handlePointerEnter = () => onHover(true);
  const handlePointerLeave = () => onHover(false);

  return (
    <group position={position}>
      {/* Particle cloud system */}
      <points ref={particlesRef}>
        <primitive object={particles} attach="geometry" />
        <primitive object={particlesMaterial} attach="material" />
      </points>
      
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
        
        {/* Show the actual material */}
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