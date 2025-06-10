
export interface SpaceEnvironment {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  type: 'void' | 'cosmic' | 'studio' | 'abstract' | 'matrix' | 'cartoon' | 'sketch' | 'neon' | 'forest' | 'ocean' | 'desert' | 'sports' | 'cultural' | 'retail' | 'natural' | 'professional' | 'panoramic';
  category: 'basic' | 'themed' | 'sports' | 'cultural' | 'retail' | 'natural' | 'professional' | 'photorealistic';
  emoji: string;
  config: {
    backgroundColor: string;
    ambientColor: string;
    lightIntensity: number;
    particleCount?: number;
    animationSpeed?: number;
    venue?: string;
    // New panoramic-specific properties
    panoramicPhotoId?: string;
    exposure?: number;
    saturation?: number;
    autoRotation?: number;
  };
}

export interface SpaceControls {
  orbitSpeed: number;
  floatIntensity: number;
  cameraDistance: number;
  autoRotate: boolean;
  gravityEffect: number;
  // New panoramic controls
  panoramicAutoRotate?: boolean;
  panoramicRotationSpeed?: number;
  fieldOfView?: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  rotation: { x: number; y: number };
}
