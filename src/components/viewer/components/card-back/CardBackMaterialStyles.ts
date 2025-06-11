
export const getTextStyles = (materialId: string) => {
  switch (materialId) {
    case 'chrome':
    case 'gold':
      // Etched/embossed metallic effect - deeper integration
      return {
        textShadow: `
          inset 0 2px 4px rgba(0, 0, 0, 0.8),
          inset 0 -1px 2px rgba(255, 255, 255, 0.1),
          0 1px 0 rgba(255, 255, 255, 0.05)
        `,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '600',
        letterSpacing: '0.5px',
        filter: 'contrast(0.8) brightness(0.9)'
      };
    
    case 'vintage':
      // Stamped/pressed paper effect - more subtle
      return {
        textShadow: `
          inset 0 1px 3px rgba(0, 0, 0, 0.6),
          0 1px 0 rgba(139, 69, 19, 0.2)
        `,
        color: 'rgba(139, 69, 19, 0.6)',
        fontWeight: '500',
        letterSpacing: '0.3px',
        filter: 'sepia(0.3) contrast(0.9)'
      };
    
    case 'crystal':
    case 'ice':
      // Glass/crystal with holographic overlay - very subtle
      return {
        textShadow: `
          0 0 8px rgba(148, 163, 184, 0.4),
          inset 0 1px 2px rgba(255, 255, 255, 0.1)
        `,
        color: 'rgba(255, 255, 255, 0.3)',
        fontWeight: '400',
        letterSpacing: '0.8px',
        filter: 'blur(0.5px) brightness(1.1)'
      };
    
    default:
      // Default subtle styling
      return {
        textShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '500'
      };
  }
};

export const getDynamicFrameStyles = (frameStyles: React.CSSProperties, selectedMaterial: any) => {
  return {
    ...frameStyles,
    background: selectedMaterial.background,
    border: `2px solid ${selectedMaterial.borderColor}`,
    opacity: selectedMaterial.opacity,
    ...(selectedMaterial.blur && {
      backdropFilter: `blur(${selectedMaterial.blur}px)`
    }),
    boxShadow: `
      0 0 30px ${selectedMaterial.borderColor},
      inset 0 0 20px rgba(255, 255, 255, 0.1)
    `
  };
};
