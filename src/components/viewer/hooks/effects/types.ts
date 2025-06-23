
// Core types for the enhanced visual effects system
export interface EffectParameter {
  id: string;
  name: string;
  type: 'slider' | 'toggle' | 'color' | 'select';
  defaultValue: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
}

export interface VisualEffectConfig {
  id: string;
  name: string;
  description: string;
  category: 'metallic' | 'prismatic' | 'surface' | 'vintage';
  parameters: EffectParameter[];
  performanceImpact: 'low' | 'medium' | 'high';
  mobileSupported: boolean;
}

export interface EffectValues {
  [effectId: string]: {
    [parameterId: string]: number | boolean | string;
  };
}

export interface RarityMaterialPreset {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  effects: EffectValues;
  performanceScore: number;
}
