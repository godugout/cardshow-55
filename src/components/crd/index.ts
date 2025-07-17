// Main CRD System Exports
export { CRDViewer } from './CRDViewer';
export { Card3DCore } from './core/Card3DCore';
export { MaterialSystem } from './materials/MaterialSystem';
export { AnimationController } from './animation/AnimationController';
export { LightingRig } from './lighting/LightingRig';

// Types
export type {
  AnimationMode,
  MaterialMode,
  LightingPreset,
  PathTheme,
  CRDTransform,
  CRDViewerConfig,
  PetInteractionEvent,
  VirtualSpaceConfig
} from './types/CRDTypes';

// Future: Achievement Pet System Integration
// export { AchievementPet } from './pet/AchievementPet';
// export { PetEvolution } from './pet/PetEvolution';

// Future: Virtual Spaces Integration  
// export { SportsArenaSpace } from './spaces/SportsArenaSpace';
// export { SciFiArcadeSpace } from './spaces/SciFiArcadeSpace';
// export { NaturePreserveSpace } from './spaces/NaturePreserveSpace';

// Future: Duel System Integration
// export { CardDuelViewer } from './duel/CardDuelViewer';
// export { DuelAnimations } from './duel/DuelAnimations';