
import type { CardData } from '@/hooks/useCardEditor';

export type BackgroundType = 'scene' | '3dSpace';

export interface ImmersiveCardViewerProps {
  card: CardData;
  cards?: CardData[];
  currentCardIndex?: number;
  onCardChange?: (card: CardData, index: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (card: CardData) => void;
  onDownload?: (cards: CardData[]) => void;
  allowRotation?: boolean;
  showStats?: boolean;
  ambient?: boolean;
}

export interface EnvironmentScene {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  hdriUrl?: string;
  panoramicUrl?: string;
  emoji?: string;
  config?: {
    intensity?: number;
    blur?: number;
    background?: boolean;
  };
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  description: string;
  config: {
    ambientIntensity: number;
    directionalIntensity: number;
    pointLights: Array<{
      position: [number, number, number];
      intensity: number;
      color: string;
    }>;
    shadows: boolean;
    shadowIntensity: number;
  };
}

export interface MaterialSettings {
  roughness: number;
  metalness: number;
  reflectivity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  ior: number;
  transmission: number;
  thickness: number;
}

export interface EnvironmentControls {
  depthOfField: number;
  parallaxIntensity: number;
  fieldOfView: number;
  atmosphericDensity: number;
}
