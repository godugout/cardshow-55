
import type { DesignTemplate } from '@/hooks/useCardEditor';
import { MODULAR_TEMPLATES, convertToDesignTemplate } from './modularTemplates';

// Convert modular templates to legacy format for backward compatibility
export const ESSENTIAL_FRAMES: DesignTemplate[] = MODULAR_TEMPLATES
  .filter(t => ['minimal-grid', 'vintage-trading', 'polaroid-stack'].includes(t.id))
  .map(convertToDesignTemplate);

export const SPORTS_FRAMES: DesignTemplate[] = MODULAR_TEMPLATES
  .filter(t => t.category === 'sports')
  .map(convertToDesignTemplate);

export const ENTERTAINMENT_FRAMES: DesignTemplate[] = MODULAR_TEMPLATES
  .filter(t => t.category === 'entertainment')
  .map(convertToDesignTemplate);

// Combined exports for convenience
export const ALL_FRAMES: DesignTemplate[] = [
  ...ESSENTIAL_FRAMES,
  ...SPORTS_FRAMES,
  ...ENTERTAINMENT_FRAMES
];
