
export interface SpaceEnvironment {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  type: 'void' | 'cosmic' | 'studio' | 'abstract' | 'matrix' | 'cartoon' | 'sketch' | 'neon' | 'forest' | 'ocean';
  emoji: string;
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
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
