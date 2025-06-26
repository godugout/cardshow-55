
import { useMemo } from 'react';
import type { CreationMode, ModeConfig } from '../types';

export const useModeConfig = () => {
  const modeConfigs = useMemo((): ModeConfig[] => [
    {
      id: 'quick',
      title: 'Quick Create',
      description: 'Simple form-based card creation',
      icon: 'Zap',
      steps: ['intent', 'upload', 'details', 'publish'],
      features: ['AI assistance', 'Smart defaults', 'One-click publish']
    },
    {
      id: 'guided',
      title: 'Guided Create',
      description: 'Step-by-step wizard with help',
      icon: 'Navigation',
      steps: ['intent', 'upload', 'details', 'design', 'publish'],
      features: ['Progressive guidance', 'Templates', 'Live preview']
    },
    {
      id: 'advanced',
      title: 'Advanced Create',
      description: 'Full editor with all features',
      icon: 'Settings',
      steps: ['intent', 'upload', 'design', 'details', 'publish'],
      features: ['Advanced cropping', 'Custom effects', 'Collaboration']
    },
    {
      id: 'bulk',
      title: 'Bulk Create',
      description: 'Create multiple cards at once',
      icon: 'Copy',
      steps: ['intent', 'upload', 'complete'],
      features: ['Batch processing', 'AI analysis', 'Template application']
    }
  ], []);

  const getConfigById = (mode: CreationMode): ModeConfig | undefined => {
    return modeConfigs.find(config => config.id === mode);
  };

  return { modeConfigs, getConfigById };
};
