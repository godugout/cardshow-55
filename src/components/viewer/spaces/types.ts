
export interface SpaceEnvironment {
  id: string;
  name: string;
  description?: string;
  type: 'void' | 'cosmic' | 'cartoon' | 'matrix' | 'sketch' | 'forest' | 'neon' | 'ocean' | 'studio' | 'abstract';
  emoji: string;
  previewUrl: string;
  config: {
    backgroundColor: string;
    lightIntensity: number;
    ambientColor: string;
    fogColor?: string;
    fogDensity?: number;
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

export interface HDRIEnvironment {
  id: string;
  name: string;
  type: 'hdri';
  emoji: string;
  previewUrl: string;
  hdriUrl: string;
  fallbackUrl?: string;
}
