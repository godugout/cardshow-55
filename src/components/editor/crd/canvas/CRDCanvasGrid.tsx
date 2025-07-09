import React from 'react';

interface CRDCanvasGridProps {
  showGrid: boolean;
  gridType: 'standard' | 'print' | 'golden';
  gridSize: number;
}

export const CRDCanvasGrid: React.FC<CRDCanvasGridProps> = ({
  showGrid,
  gridType,
  gridSize
}) => {
  if (!showGrid) return null;

  const getGridPattern = () => {
    switch (gridType) {
      case 'standard':
        return {
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`
        };
      case 'print':
        return {
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, ${gridSize * 8}px ${gridSize * 8}px, ${gridSize * 8}px ${gridSize * 8}px`
        };
      case 'golden':
        const goldenRatio = 1.618;
        return {
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * goldenRatio}px ${gridSize}px`
        };
      default:
        return {};
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={getGridPattern()}
    />
  );
};