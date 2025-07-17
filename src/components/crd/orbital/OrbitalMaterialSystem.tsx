import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitalRing } from './OrbitalRing';
import { CRDVisualStyles, type CRDVisualStyle } from '../styles/StyleRegistry';

interface OrbitalMaterialSystemProps {
  cardRotation: THREE.Euler;
  onStyleChange: (styleId: string) => void;
  selectedStyleId: string;
}

export const OrbitalMaterialSystem: React.FC<OrbitalMaterialSystemProps> = ({
  cardRotation,
  onStyleChange,
  selectedStyleId
}) => {
  const [currentStyle, setCurrentStyle] = useState<CRDVisualStyle>(
    CRDVisualStyles.find(s => s.id === selectedStyleId) || CRDVisualStyles[1]
  );

  const handleStyleChange = useCallback((style: CRDVisualStyle) => {
    if (!style.locked && style.id !== selectedStyleId) {
      setCurrentStyle(style);
      onStyleChange(style.id);
      console.log('🎨 Orbital system changed style to:', style.displayName);
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
      />

      {/* Optional: Secondary ring for premium styles */}
      {CRDVisualStyles.filter(s => s.category === 'premium' && !s.locked).length > 0 && (
        <OrbitalRing
          radius={5.5}
          cardRotation={cardRotation}
          onStyleChange={handleStyleChange}
          selectedStyleId={selectedStyleId}
        />
      )}
    </group>
  );
};