
import { useState, useCallback } from 'react';
import type { EffectValues } from './useEnhancedCardEffects';

export interface CustomStyleControls {
  shimmer: number;        // Overall metallic/holographic intensity
  depth: number;          // Surface depth and dimension
  color: number;          // Color vibrancy and shift
  texture: number;        // Surface texture complexity
  glow: number;           // Edge glow and highlights
  movement: number;       // Animation and flow speed
}

export interface SavedCustomStyle {
  id: string;
  name: string;
  controls: CustomStyleControls;
  createdAt: number;
}

const DEFAULT_CONTROLS: CustomStyleControls = {
  shimmer: 50,
  depth: 50,
  color: 50,
  texture: 50,
  glow: 50,
  movement: 50
};

// Smart mapping from simplified controls to complex effect parameters
const mapControlsToEffects = (controls: CustomStyleControls): EffectValues => {
  const { shimmer, depth, color, texture, glow, movement } = controls;
  
  return {
    holographic: Math.round(shimmer * 0.8),
    foilspray: Math.round(texture * 0.6),
    prizm: Math.round(color * 0.5),
    chrome: Math.round(shimmer * 0.4),
    interference: Math.round(depth * 0.3),
    brushedmetal: Math.round(texture * 0.4),
    crystal: Math.round((shimmer + depth) * 0.25),
    vintage: 0,
    gold: 0,
    aurora: 0,
    waves: 0,
    ice: 0,
    lunar: 0,
    foil: 0,
    prismatic: 0
  };
};

export const useCustomStyleManager = () => {
  const [customControls, setCustomControls] = useState<CustomStyleControls>(DEFAULT_CONTROLS);
  const [savedStyles, setSavedStyles] = useState<SavedCustomStyle[]>(() => {
    try {
      const saved = localStorage.getItem('cardshow-custom-styles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateControl = useCallback((key: keyof CustomStyleControls, value: number) => {
    setCustomControls(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetControls = useCallback(() => {
    setCustomControls(DEFAULT_CONTROLS);
  }, []);

  const saveCustomStyle = useCallback((name: string) => {
    const newStyle: SavedCustomStyle = {
      id: `custom-${Date.now()}`,
      name,
      controls: { ...customControls },
      createdAt: Date.now()
    };
    
    const updated = [...savedStyles, newStyle];
    setSavedStyles(updated);
    localStorage.setItem('cardshow-custom-styles', JSON.stringify(updated));
    
    return newStyle.id;
  }, [customControls, savedStyles]);

  const loadCustomStyle = useCallback((styleId: string) => {
    const style = savedStyles.find(s => s.id === styleId);
    if (style) {
      setCustomControls(style.controls);
    }
  }, [savedStyles]);

  const deleteCustomStyle = useCallback((styleId: string) => {
    const updated = savedStyles.filter(s => s.id !== styleId);
    setSavedStyles(updated);
    localStorage.setItem('cardshow-custom-styles', JSON.stringify(updated));
  }, [savedStyles]);

  const getEffectValues = useCallback(() => {
    return mapControlsToEffects(customControls);
  }, [customControls]);

  return {
    customControls,
    savedStyles,
    updateControl,
    resetControls,
    saveCustomStyle,
    loadCustomStyle,
    deleteCustomStyle,
    getEffectValues
  };
};
