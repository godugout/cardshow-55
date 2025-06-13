
import React from 'react';

interface CardSideFaceProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  cardWidth: number;
  cardHeight: number;
  thickness: number;
  isHovering: boolean;
  showEffects: boolean;
  rotation: { x: number; y: number };
}

export const CardSideFace: React.FC<CardSideFaceProps> = ({
  position,
  cardWidth,
  cardHeight,
  thickness,
  isHovering,
  showEffects,
  rotation
}) => {
  // Calculate dimensions and positioning for each side face
  const getSideFaceStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 30%, #2a2a2a 70%, #1a1a1a 100%)',
      // Remove the white border that's causing the line
      border: 'none',
      boxShadow: showEffects && isHovering 
        ? 'inset 0 0 8px rgba(255, 255, 255, 0.2), 0 0 6px rgba(0, 0, 0, 0.9)' 
        : 'inset 0 0 4px rgba(255, 255, 255, 0.1), 0 0 3px rgba(0, 0, 0, 0.7)',
      transition: 'all 0.3s ease',
      opacity: 1,
      zIndex: 5
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          width: `${cardWidth}px`,
          height: `${thickness}px`,
          top: `${-thickness / 2}px`,
          left: '0px',
          transform: 'rotateX(90deg)',
          transformOrigin: 'center bottom'
        };
      case 'bottom':
        return {
          ...baseStyle,
          width: `${cardWidth}px`,
          height: `${thickness}px`,
          bottom: `${-thickness / 2}px`,
          left: '0px',
          transform: 'rotateX(-90deg)',
          transformOrigin: 'center top'
        };
      case 'left':
        return {
          ...baseStyle,
          width: `${thickness}px`,
          height: `${cardHeight}px`,
          top: '0px',
          left: `${-thickness / 2}px`,
          transform: 'rotateY(-90deg)',
          transformOrigin: 'right center'
        };
      case 'right':
        return {
          ...baseStyle,
          width: `${thickness}px`,
          height: `${cardHeight}px`,
          top: '0px',
          right: `${-thickness / 2}px`,
          transform: 'rotateY(90deg)',
          transformOrigin: 'left center'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      className="card-side-face"
      style={getSideFaceStyle()}
      data-side={position}
    >
      {/* Enhanced texture overlay for better realism */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${position === 'top' || position === 'bottom' ? '90deg' : '0deg'},
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.04) 25%,
              rgba(255, 255, 255, 0.06) 50%,
              rgba(255, 255, 255, 0.04) 75%,
              rgba(255, 255, 255, 0.08) 100%
            )
          `,
          mixBlendMode: 'soft-light'
        }}
      />
      
      {/* Enhanced metallic reflection for better 3D effect */}
      {showEffects && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                ${position === 'left' || position === 'right' ? '0deg' : '90deg'},
                transparent 0%,
                rgba(255, 255, 255, 0.1) 20%,
                transparent 40%,
                rgba(255, 255, 255, 0.05) 60%,
                transparent 100%
              )
            `,
            animation: isHovering ? 'metallic-shimmer 2s ease-in-out infinite' : 'none'
          }}
        />
      )}
    </div>
  );
};
