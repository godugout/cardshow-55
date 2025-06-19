
import React from 'react';
import { AdvancedEffectsStudio } from './AdvancedEffectsStudio';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface EffectsStylingStepProps {
  selectedTemplate: DesignTemplate | null;
  selectedPhoto: string;
  onEffectsUpdate: (effects: any) => void;
  initialEffects?: any;
}

export const EffectsStylingStep = (props: EffectsStylingStepProps) => {
  return <AdvancedEffectsStudio {...props} />;
};
