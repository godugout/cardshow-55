import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitalRing } from './OrbitalRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';

interface OrbitalMaterialSystemProps {
  cardRotation: THREE.Euler;
  onStyleChange: (styleId: string) => void;
  selectedStyleId: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  showRing?: boolean;
  showLockIndicators?: boolean;
  isPaused?: boolean;
}

export const OrbitalMaterialSystem: React.FC<OrbitalMaterialSystemProps> = ({
  cardRotation,
  onStyleChange,
  selectedStyleId,
  autoRotate = true,
  rotationSpeed = 1,
  showRing = true,
  showLockIndicators = true,
  isPaused = false
}) => {
  const [currentStyle, setCurrentStyle] = useState<CRDVisualStyle>(
    CRDVisualStyles.find(s => s.id === selectedStyleId) || CRDVisualStyles[1]
  );

  const handleStyleChange = useCallback((style: CRDVisualStyle) => {
    console.log('🌟 Orbital System: Style change requested:', style.displayName, 'ID:', style.id);
    if (style.id !== selectedStyleId) {
      setCurrentStyle(style);
      onStyleChange(style.id);
      console.log('✅ Orbital system changed style to:', style.displayName);
    }
  }, [selectedStyleId, onStyleChange]);

  return (
    <group>
      {/* Main Orbital Ring */}
      <OrbitalRing
        radius={4.5}
        cardRotation={cardRotation}
        onStyleChange={handleStyleChange}
        selectedStyleId={selectedStyleId}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        showRing={showRing}
        showLockIndicators={showLockIndicators}
        isPaused={isPaused}
      />

      {/* Optional: Secondary ring for premium styles */}
      {CRDVisualStyles.filter(s => s.category === 'premium' && !s.locked).length > 0 && (
        <OrbitalRing
          radius={5.5}
          cardRotation={cardRotation}
          onStyleChange={handleStyleChange}
          selectedStyleId={selectedStyleId}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed * 0.8} // Slightly slower
          showRing={showRing}
          showLockIndicators={showLockIndicators}
          isPaused={isPaused}
        />
      )}
    </group>
  );
};