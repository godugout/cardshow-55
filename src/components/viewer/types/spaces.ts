
import type { CardData } from '@/hooks/useCardEditor';

export interface SpaceCard {
  id: string;
  card: CardData;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  isSelected: boolean;
}

export interface SpaceTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'gallery' | 'stadium' | 'constellation' | 'museum';
  maxCards: number;
  defaultPositions: Array<{ x: number; y: number; z: number }>;
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  environment: {
    background: string;
    lighting: string;
    fog?: { color: string; near: number; far: number };
  };
}

export interface SpaceState {
  selectedTemplate: SpaceTemplate | null;
  cards: SpaceCard[];
  selectedCardIds: string[];
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  isEditMode: boolean;
}

export interface SpaceConfiguration {
  id: string;
  name: string;
  template: SpaceTemplate;
  cards: SpaceCard[];
  createdAt: Date;
  updatedAt: Date;
}
