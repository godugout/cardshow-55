
export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  brightness: number;
  contrast: number;
  highlights: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  shadowSoftness: number;
}

export interface EnvironmentScene {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  panoramicUrl: string;
  previewUrl: string;
  backgroundImage: string;
  hdriUrl: string;
  gradient: string;
  lighting: {
    color: string;
    intensity: number;
    azimuth: number;
  };
  atmosphere: {
    fog: boolean;
    fogColor: string;
    fogDensity: number;
  };
  depth: {
    layers: number;
    parallaxIntensity: number;
    fieldOfView: number;
  };
}

export interface MaterialSettings {
  roughness: number;
  metalness: number;
  clearcoat: number;
  reflectivity: number;
  clearcoatRoughness: number;
  ior: number;
  transmission: number;
  thickness: number;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  type: 'surface' | 'lighting' | 'atmospheric';
  intensity: number[];
  properties: Record<string, any>;
}

export interface ImmersiveCardViewerProps {
  card: any;
  cards: any[];
  currentCardIndex: number;
  onCardChange: (card: any, index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onShare: (card: any) => void;
  onDownload: (cards: any[]) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export type BackgroundType = 'gradient' | 'image' | 'solid';

export interface EnvironmentControls {
  backgroundType: BackgroundType;
  gradientColors: string[];
  backgroundImage?: string;
  backgroundOpacity: number;
  blur: number;
  brightness: number;
  contrast: number;
}
