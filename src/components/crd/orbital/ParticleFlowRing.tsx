import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFlowRingProps {
  radius: number;
  selectedStyleId: string;
  hoveredSatellite: string | null;
  satellitePositions: Array<{ style: any; position: THREE.Vector3; angle: number }>;
  isPaused?: boolean;
}

const vertexShader = `
  attribute float alpha;
  attribute float size;
  attribute float phase;
  
  varying float vAlpha;
  varying vec3 vColor;
  varying float vLightning;
  
  uniform float time;
  uniform vec3 orangeColor;
  uniform vec3 blueColor;
  uniform vec3 waveColor;
  uniform float flowSpeed;
  uniform float waveProgress;
  uniform float waveAngle;
  uniform bool hasWave;
  uniform bool isPaused;
  uniform vec4 stormCenters[4];  // [angle, intensity, phase, range] for each storm
  uniform float stormActivity;   // Overall storm activity level
  
  void main() {
    vAlpha = alpha * 0.4;
    
    // Calculate particle angle
    float particleAngle = atan(position.z, position.x);
    if (particleAngle < 0.0) particleAngle += 6.28318530718; // Normalize to 0-2π
    
    // Color wave logic
    vec3 baseColor;
    if (hasWave) {
      // Calculate distance from wave front (both directions)
      float waveAngleNorm = waveAngle;
      if (waveAngleNorm < 0.0) waveAngleNorm += 6.28318530718;
      
      float angleDiff1 = abs(particleAngle - waveAngleNorm);
      float angleDiff2 = 6.28318530718 - angleDiff1; // Other direction around circle
      float minAngleDiff = min(angleDiff1, angleDiff2);
      
      // Wave propagation (travels both ways around ring)
      float waveRadius = waveProgress * 0.4;
      float waveFactor = smoothstep(waveRadius + 0.1, waveRadius - 0.1, minAngleDiff);
      
      // Pulsing animation for breathing effect
      float pulseSpeed = 2.0;
      float pulsePhase = sin(time * pulseSpeed) * 0.5 + 0.5;
      
      // Calculate lightning from multiple storm centers
      float totalLightning = 0.0;
      
      for (int i = 0; i < 4; i++) {
        vec4 storm = stormCenters[i];
        float stormAngle = storm.x;
        float stormIntensity = storm.y;
        float stormPhase = storm.z;
        float stormRange = storm.w;
        
        if (stormIntensity > 0.1) { // Only process active storms
          // Calculate angular distance to storm center
          float angleDiff1 = abs(particleAngle - stormAngle);
          float angleDiff2 = 6.28318530718 - angleDiff1;
          float stormDistance = min(angleDiff1, angleDiff2);
          
          // Lightning effect within storm range
          if (stormDistance < stormRange) {
            float distanceFactor = stormDistance / stormRange;
            float rangeFalloff = 1.0 - smoothstep(0.0, 1.0, distanceFactor);
            
            // Random lightning strikes with storm phase
            float lightningFreq = 12.0 + sin(stormPhase * 3.0) * 4.0; // Varying frequency
            float lightning = pow(sin(time * lightningFreq + stormPhase + particleAngle * 8.0) * 0.5 + 0.5, 3.0);
            
            // Add random flicker
            float flicker = sin(time * 25.0 + stormPhase * 7.0) * 0.3 + 0.7;
            lightning *= flicker;
            
            // Apply storm intensity and range falloff
            lightning *= stormIntensity * rangeFalloff * stormActivity;
            
            totalLightning += lightning;
          }
        }
      }
      
      vLightning = min(totalLightning, 1.0); // Clamp to prevent over-brightness
      
      // Mix colors based on wave
      float angle = particleAngle + time * flowSpeed * 0.2;
      float gradientFactor = (sin(angle) + 1.0) * 0.5;
      vec3 originalColor = mix(orangeColor, blueColor, gradientFactor);
      baseColor = mix(originalColor, waveColor, waveFactor);
    } else {
      vLightning = 0.0;
      // Original gradient
      float angle = particleAngle + time * flowSpeed * 0.2;
      float gradientFactor = (sin(angle) + 1.0) * 0.5;
      baseColor = mix(orangeColor, blueColor, gradientFactor);
    }
    
    vColor = baseColor;
    
    // Animate position along the ring with subtle movement
    float animatedPhase = phase + (isPaused ? 0.0 : time * flowSpeed * 0.5);
    vec3 animatedPosition = position;
    animatedPosition.y += sin(animatedPhase) * 0.05;
    
    // Add subtle radius variation for organic flow
    float radiusVariation = sin(animatedPhase * 3.0) * 0.1;
    animatedPosition.x += normalize(animatedPosition).x * radiusVariation;
    animatedPosition.z += normalize(animatedPosition).z * radiusVariation;
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Smaller, softer particles with lightning enhancement
    float lightningSize = 1.0 + vLightning * 0.5;
    float distanceSize = size * 0.5 * (1.0 + sin(animatedPhase * 2.0) * 0.2) * lightningSize;
    gl_PointSize = distanceSize * (200.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  varying float vLightning;
  
  void main() {
    // Create softer, more gas-like particles
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // More gradual falloff for less obvious circles
    float alpha = vAlpha * pow(1.0 - dist * 2.0, 4.0);
    alpha *= 0.5; // Reduced visibility for subtler effect
    
    // Add layered lightning glow with gradual falloff
    vec3 finalColor = vColor;
    
    // Primary glow layer - strongest in center
    float primaryGlow = pow(vLightning, 0.8);
    finalColor += vec3(0.3, 0.4, 0.5) * primaryGlow * 0.3;
    
    // Secondary glow layer - softer and more widespread
    float secondaryGlow = pow(vLightning, 0.4);
    finalColor += vec3(0.2, 0.3, 0.4) * secondaryGlow * 0.15;
    
    // Outer glow layer - very soft and subtle
    float outerGlow = pow(vLightning, 0.2);
    finalColor += vec3(0.1, 0.15, 0.2) * outerGlow * 0.08;
    
    // Gradual alpha boost based on lightning intensity
    alpha += vLightning * vLightning * 0.15; // Quadratic for smoother falloff
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const ParticleFlowRing: React.FC<ParticleFlowRingProps> = ({
  radius,
  selectedStyleId,
  hoveredSatellite,
  satellitePositions,
  isPaused = false
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Wave animation state
  const waveStateRef = useRef({
    isActive: false,
    startTime: 0,
    duration: 0.8, // Faster wave - 0.8 seconds for full wave
    hoveredAngle: 0,
    hoveredColor: new THREE.Color('#22c55e')
  });

  // Storm system state
  const stormStateRef = useRef({
    storms: [
      { angle: 0, intensity: 0, phase: 0, duration: 0, startTime: 0 },
      { angle: 0, intensity: 0, phase: 0, duration: 0, startTime: 0 },
      { angle: 0, intensity: 0, phase: 0, duration: 0, startTime: 0 },
      { angle: 0, intensity: 0, phase: 0, duration: 0, startTime: 0 }
    ],
    lastStormUpdate: 0,
    stormUpdateInterval: 2.0 // Update storm positions every 2 seconds
  });

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
      
      alphas[i] = Math.random() * 0.6 + 0.2; // Brighter for gradient visibility
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

  // Shader material with CRD gradient colors and wave uniforms
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        orangeColor: { value: new THREE.Color('#ff6b35') }, // CRD orange
        blueColor: { value: new THREE.Color('#06b6d4') }, // CRD blue
        waveColor: { value: new THREE.Color('#22c55e') }, // Wave color
        flowSpeed: { value: 0.15 },
        waveProgress: { value: 0 },
        waveAngle: { value: 0 },
        hasWave: { value: false },
        isPaused: { value: isPaused },
        stormCenters: { value: [
          new THREE.Vector4(0, 0, 0, 0.4),  // Storm 1: angle, intensity, phase, range
          new THREE.Vector4(0, 0, 0, 0.4),  // Storm 2
          new THREE.Vector4(0, 0, 0, 0.4),  // Storm 3
          new THREE.Vector4(0, 0, 0, 0.4)   // Storm 4
        ]},
        stormActivity: { value: 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Animation loop with wave management and storm system
  useFrame((state) => {
    if (!materialRef.current) return;
    
    // Update time uniform for animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.isPaused.value = isPaused;
    
    // Update storm system during hover
    if (hoveredSatellite) {
      const currentTime = state.clock.elapsedTime;
      
      // Update storm activity level
      materialRef.current.uniforms.stormActivity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.stormActivity.value,
        1.0,
        0.05
      );
      
      // Generate new storms periodically
      if (currentTime - stormStateRef.current.lastStormUpdate > stormStateRef.current.stormUpdateInterval) {
        stormStateRef.current.lastStormUpdate = currentTime;
        
        // Update 2-3 storms at random positions
        const activeStorms = Math.floor(Math.random() * 2) + 2; // 2-3 storms
        
        for (let i = 0; i < 4; i++) {
          if (i < activeStorms) {
            stormStateRef.current.storms[i] = {
              angle: Math.random() * Math.PI * 2,
              intensity: 0.6 + Math.random() * 0.4, // Varying intensity
              phase: Math.random() * Math.PI * 2,
              duration: 1.5 + Math.random() * 2.0, // 1.5-3.5 second storms
              startTime: currentTime
            };
          } else {
            // Deactivate storm
            stormStateRef.current.storms[i].intensity = 0;
          }
        }
      }
      
      // Update storm uniforms
      const stormCenters = stormStateRef.current.storms.map(storm => {
        const elapsed = currentTime - storm.startTime;
        let currentIntensity = storm.intensity;
        
        // Fade out storms over their duration
        if (elapsed > storm.duration) {
          currentIntensity = Math.max(0, storm.intensity * (1 - (elapsed - storm.duration) * 2));
        }
        
        return new THREE.Vector4(storm.angle, currentIntensity, storm.phase, 0.4);
      });
      
      materialRef.current.uniforms.stormCenters.value = stormCenters;
    } else {
      // Fade out storm activity when not hovering
      materialRef.current.uniforms.stormActivity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.stormActivity.value,
        0.0,
        0.02
      );
    }
    
    
    // Stop rotation during hover wave effect
    let flowSpeed = 0.15; // Normal speed
    if (waveStateRef.current.isActive) {
      flowSpeed = 0; // Stop rotation during wave
    } else if (hoveredSatellite) {
      flowSpeed = 0; // Stop rotation on hover (before wave starts)
    }
    
    materialRef.current.uniforms.flowSpeed.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.flowSpeed.value,
      flowSpeed,
      0.1 // Faster lerp for more responsive stopping
    );
    
    // Handle hover wave effect
    if (hoveredSatellite && !waveStateRef.current.isActive) {
      // Start new wave
      const hoveredSatellite_ = satellitePositions.find(s => s.style.id === hoveredSatellite);
      if (hoveredSatellite_) {
        waveStateRef.current.isActive = true;
        waveStateRef.current.startTime = state.clock.elapsedTime;
        waveStateRef.current.hoveredAngle = hoveredSatellite_.angle;
        waveStateRef.current.hoveredColor = getStyleColor(hoveredSatellite);
        
        materialRef.current.uniforms.hasWave.value = true;
        materialRef.current.uniforms.waveAngle.value = hoveredSatellite_.angle;
        materialRef.current.uniforms.waveColor.value = waveStateRef.current.hoveredColor;
      }
    }
    
    // Update active wave
    if (waveStateRef.current.isActive) {
      const elapsed = state.clock.elapsedTime - waveStateRef.current.startTime;
      const progress = Math.min(elapsed / waveStateRef.current.duration, 1.0);
      
      materialRef.current.uniforms.waveProgress.value = progress;
      
      // End wave when complete
      if (progress >= 1.0) {
        waveStateRef.current.isActive = false;
        materialRef.current.uniforms.hasWave.value = false;
        materialRef.current.uniforms.waveProgress.value = 0;
      }
    }
    
    // Stop wave immediately when hover ends
    if (!hoveredSatellite && waveStateRef.current.isActive) {
      waveStateRef.current.isActive = false;
      materialRef.current.uniforms.hasWave.value = false;
      materialRef.current.uniforms.waveProgress.value = 0;
    }
  });

  return (
    <points ref={particlesRef} geometry={geometry} material={material}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
};