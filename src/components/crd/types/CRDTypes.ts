// Core CRD Types
export type AnimationMode = 'monolith' | 'showcase' | 'ice' | 'gold' | 'glass' | 'holo';

export type MaterialMode = 
  | 'monolith' 
  | 'showcase' 
  | 'ice' 
  | 'gold' 
  | 'glass' 
  | 'holo'
  | 'glass-case'
  | 'sports'      // Future: Sports path theming
  | 'fantasy'     // Future: Fantasy/Sci-Fi path theming  
  | 'life';       // Future: Life path theming

export type LightingPreset = 
  | 'studio'
  | 'dramatic'
  | 'soft'
  | 'sports-arena'    // Future: Sports path lighting
  | 'sci-fi-arcade'   // Future: Fantasy/Sci-Fi path lighting
  | 'nature-preserve' // Future: Life path lighting
  | 'showcase';

export type PathTheme = 'sports' | 'fantasy' | 'life' | 'neutral';

export interface CRDTransform {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

export interface CRDViewerConfig {
  animationMode: AnimationMode;
  materialMode?: MaterialMode;
  lightingPreset: LightingPreset;
  pathTheme: PathTheme;
  intensity: number;
  enableInteraction: boolean;
  enableGlassCase: boolean;
  autoRotate: boolean;
}

// Future: Achievement Pet Integration
export interface PetInteractionEvent {
  type: 'card-created' | 'card-sold' | 'crd-earned' | 'community-like';
  data: any;
}

// Future: Virtual Space Integration  
export interface VirtualSpaceConfig {
  spaceType: PathTheme;
  ambientEffects: boolean;
  interactiveElements: string[];
}

import * as THREE from 'three';