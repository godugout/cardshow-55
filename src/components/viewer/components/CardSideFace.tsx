
import React from 'react';

interface CardSideFaceProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  cardWidth: number;
  cardHeight: number;
  thickness: number;
  isHovering: boolean;
  showEffects: boolean;
}

export const CardSideFace: React.FC<CardSideFaceProps> = ({
  position,
  cardWidth,
  cardHeight,
  thickness,
  isHovering,
  showEffects
}) => {
  // Calculate dimensions and positioning for each side face
  const getSideFaceStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: showEffects && isHovering 
        ? 'inset 0 0 4px rgba(255, 255, 255, 0.2)' 
        : 'inset 0 0 2px rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease'
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
      {/* Subtle texture overlay for realism */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${position === 'top' || position === 'bottom' ? '90deg' : '0deg'},
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.02) 50%,
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          mixBlendMode: 'soft-light'
        }}
      />
    </div>
  );
};
