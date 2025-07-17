import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFBO } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse;
  uniform int iFrame;
  uniform sampler2D iPreviousFrame;
  uniform float uBrushSize;
  uniform float uBrushStrength;
  uniform float uFluidDecay;
  uniform float uTrailLength;
  uniform float uStopDecay;
  varying vec2 vUv;
  
  vec2 ur, U;
  
  float ln(vec2 p, vec2 a, vec2 b) {
      return length(p-a-(b-a)*clamp(dot(p-a,b-a)/dot(b-a,b-a),0.,1.));
  }
  
  vec4 t(vec2 v, int a, int b) {
      return texture2D(iPreviousFrame, fract((v+vec2(float(a),float(b)))/ur));
  }
  
  vec4 t(vec2 v) {
      return texture2D(iPreviousFrame, fract(v/ur));
  }
  
  float area(vec2 a, vec2 b, vec2 c) {
      float A = length(b-c), B = length(c-a), C = length(a-b), s = 0.5*(A+B+C);
      return sqrt(s*(s-A)*(s-B)*(s-C));
  }
  
  void main() {
      U = vUv * iResolution;
      ur = iResolution.xy;
      
      if (iFrame < 1) {
          float w = 0.5+sin(0.2*U.x)*0.5;
          float q = length(U-0.5*ur);
          gl_FragColor = vec4(0.1*exp(-0.001*q*q),0,0,w);
      } else {
          vec2 v = U,
               A = v + vec2( 1, 1),
               B = v + vec2( 1,-1),
               C = v + vec2(-1, 1),
               D = v + vec2(-1,-1);
          
          for (int i = 0; i < 6; i++) {
              v -= t(v).xy;
              A -= t(A).xy;
              B -= t(B).xy;
              C -= t(C).xy;
              D -= t(D).xy;
          }
          
          vec4 me = t(v);
          vec4 n = t(v, 0, 1),
              e = t(v, 1, 0),
              s = t(v, 0, -1),
              w = t(v, -1, 0);
          vec4 ne = .25*(n+e+s+w);
          me = mix(t(v), ne, vec4(0.1,0.1,0.95,0.));
          me.z = me.z - 0.008*((area(A,B,C)+area(B,C,D))-4.);
          
          vec4 pr = vec4(e.z,w.z,n.z,s.z);
          me.xy = me.xy + 80.*vec2(pr.x-pr.y, pr.z-pr.w)/ur;
          
          me.xy *= uFluidDecay;
          me.z *= uTrailLength;
          
          // Automatic fluid movement for ocean-like waves
          vec2 autoFlow = vec2(sin(iTime * 0.3), cos(iTime * 0.2)) * 0.02;
          me.xy += autoFlow;
          
          gl_FragColor = clamp(me, -0.3, 0.3);
      }
  }
`;

interface FluidFoilMaterialProps {
  intensity?: number;
}

export const FluidFoilMaterial: React.FC<FluidFoilMaterialProps> = ({ 
  intensity = 1 
}) => {
  const { gl } = useThree();
  const fluidMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const fluidMeshRef = useRef<THREE.Mesh>(null);
  
  const fluidTarget1 = useFBO(256, 256, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const fluidTarget2 = useFBO(256, 256, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });

  const [currentFluidTarget, setCurrentFluidTarget] = useState(fluidTarget1);
  const [previousFluidTarget, setPreviousFluidTarget] = useState(fluidTarget2);
  const [frameCount, setFrameCount] = useState(0);
  
  const fluidCamera = useMemo(() => {
    return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (fluidMaterialRef.current && fluidMeshRef.current) {
      fluidMaterialRef.current.uniforms.iTime.value = time;
      fluidMaterialRef.current.uniforms.iFrame.value = frameCount;
      fluidMaterialRef.current.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
      
      // Render fluid simulation
      gl.setRenderTarget(currentFluidTarget);
      gl.render(fluidMeshRef.current, fluidCamera);
      gl.setRenderTarget(null);

      // Swap targets
      const temp = currentFluidTarget;
      setCurrentFluidTarget(previousFluidTarget);
      setPreviousFluidTarget(temp);
      
      setFrameCount(prev => prev + 1);
    }
  });

  // Ocean-themed shader material using fluid simulation as texture
  return (
    <>
      {/* Hidden fluid simulation mesh */}
      <mesh ref={fluidMeshRef} visible={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={fluidMaterialRef}
          uniforms={{
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(256, 256) },
            iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
            iFrame: { value: 0 },
            iPreviousFrame: { value: null },
            uBrushSize: { value: 20.0 },
            uBrushStrength: { value: 0.3 },
            uFluidDecay: { value: 0.99 },
            uTrailLength: { value: 0.9 },
            uStopDecay: { value: 0.95 },
          }}
          vertexShader={vertexShader}
          fragmentShader={fluidShader}
        />
      </mesh>
      
      {/* Actual material to be applied */}
      <meshStandardMaterial
        color="#0ea5e9"
        metalness={0.3}
        roughness={0.1}
        emissive="#06b6d4"
        emissiveIntensity={0.4 * intensity}
        envMapIntensity={2.2}
        map={currentFluidTarget.texture}
        transparent
        opacity={0.9}
      />
    </>
  );
};