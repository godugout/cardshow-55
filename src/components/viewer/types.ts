
export interface MaterialSettings {
  metalness?: number;
  roughness?: number;
  reflectivity?: number;
  clearcoat?: number;
  // Effect intensities
  holographic?: number | string | boolean;
  crystal?: number | string | boolean;
  chrome?: number | string | boolean;
  brushedmetal?: number | string | boolean;
  gold?: number | string | boolean;
  vintage?: number | string | boolean;
  prizm?: number | string | boolean;
  interference?: number | string | boolean;
  foilspray?: number | string | boolean;
  aurora?: number | string | boolean;
  starlight?: number | string | boolean; // Add Starlight as a specific property
  ice?: number | string | boolean;
  lunar?: number | string | boolean;
  waves?: number | string | boolean;
}

export interface EnvironmentScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  category: 'natural' | 'fantasy' | 'futuristic' | 'architectural';
  panoramicUrl: string;
  previewUrl: string;
  backgroundImage: string;
  lighting: {
    color: string;
    intensity: number;
    elevation: number;
    azimuth: number;
  };
  atmosphere?: {
    fog: boolean;
    fogColor: string;
    fogDensity: number;
    particles: boolean;
  };
  depth?: {
    layers: number;
    parallaxIntensity: number;
    fieldOfView: number;
  };
  config?: {
    skybox?: string;
    lighting?: {
      ambient: number;
      directional: number;
    };
    fog?: {
      enabled: boolean;
      color: string;
      density: number;
    };
  };
}

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  brightness: number;
  contrast: number;
  shadows: number;
  highlights: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  shadowSoftness: number;
  ambient: number;
  directional: number;
  color: string;
  intensity: number;
}

export interface EnvironmentControls {
  depthOfField: number;
  parallaxIntensity: number;
  fieldOfView: number;
  atmosphericDensity: number;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: string;
  intensity: number;
  parameters: Record<string, any>;
}

export type BackgroundType = '2dEnvironment' | '3dSpace' | 'scene';
