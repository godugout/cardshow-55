
export interface MaterialSettings {
  metalness?: number;
  roughness?: number;
  reflectivity?: number;
  clearcoat?: number;
  // Effect intensities
  holographic?: number;
  crystal?: number;
  chrome?: number;
  brushedmetal?: number;
  gold?: number;
  vintage?: number;
  prizm?: number;
  interference?: number;
  foilspray?: number;
  aurora?: number;
  starlight?: number; // Add Starlight as a specific property
  ice?: number;
  lunar?: number;
  waves?: number;
}

export interface EnvironmentScene {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
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

export type BackgroundType = '2dEnvironment' | '3dSpace';
