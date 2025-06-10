
export interface SpaceEnvironment {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  type: 'void' | 'cosmic' | 'studio' | 'abstract' | 'matrix' | 'cartoon' | 'sketch' | 'neon' | 'forest' | 'ocean' | 'sports' | 'cultural' | 'retail' | 'natural' | 'professional';
  category: 'basic' | 'themed' | 'sports' | 'cultural' | 'retail' | 'natural' | 'professional';
  emoji: string;
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
    venue?: string; // Specific venue type within category
  };
}

export interface SpaceControls {
  orbitSpeed: number;
  floatIntensity: number;
  cameraDistance: number;
  autoRotate: boolean;
  gravityEffect: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  rotation: { x: number; y: number };
}
