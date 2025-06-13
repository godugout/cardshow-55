
import React, { useState, useCallback } from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface RenderModeManagerProps {
  card: CardData;
  effectValues: EffectValues;
  children: (props: {
    enableTrue3D: boolean;
    onToggle3D: (enabled: boolean) => void;
  }) => React.ReactNode;
}

export const RenderModeManager: React.FC<RenderModeManagerProps> = ({
  card,
  effectValues,
  children
}) => {
  // Default to sophisticated 2D effects system
  const [enableTrue3D, setEnableTrue3D] = useState(false);

  const handleToggle3D = useCallback((enabled: boolean) => {
    console.log('🎛️ Toggling 3D mode:', enabled ? 'TRUE 3D' : 'Enhanced 2D');
    setEnableTrue3D(enabled);
  }, []);

  return (
    <>
      {children({
        enableTrue3D,
        onToggle3D: handleToggle3D
      })}
    </>
  );
};
