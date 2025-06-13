
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
  // Calculate visibility based on rotation for better performance
  const getVisibility = () => {
    const normalizedRotationY = ((rotation.y % 360) + 360) % 360;
    const normalizedRotationX = ((rotation.x % 360) + 360) % 360;
    
    switch (position) {
      case 'top':
        return normalizedRotationX > 15 && normalizedRotationX < 165;
      case 'bottom':
        return normalizedRotationX > 195 && normalizedRotationX < 345;
      case 'left':
        return normalizedRotationY > 105 && normalizedRotationY < 255;
      case 'right':
        return normalizedRotationY > 285 || normalizedRotationY < 75;
      default:
        return true;
    }
  };

  const isVisible = getVisibility();
  
  // Calculate dimensions and positioning for each side face
  const getSideFaceStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #404040 30%, #2a2a2a 70%, #1a1a1a 100%)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: showEffects && isHovering 
        ? 'inset 0 0 6px rgba(255, 255, 255, 0.3), 0 0 4px rgba(0, 0, 0, 0.8)' 
        : 'inset 0 0 3px rgba(255, 255, 255, 0.2), 0 0 2px rgba(0, 0, 0, 0.6)',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0,
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
      data-visible={isVisible}
    >
      {/* Enhanced texture overlay for better realism */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              ${position === 'top' || position === 'bottom' ? '90deg' : '0deg'},
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.03) 25%,
              rgba(255, 255, 255, 0.06) 50%,
              rgba(255, 255, 255, 0.03) 75%,
              rgba(255, 255, 255, 0.08) 100%
            )
          `,
          mixBlendMode: 'soft-light'
        }}
      />
      
      {/* Subtle metallic reflection for enhanced 3D effect */}
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
      
      <style>
        {`
          @keyframes metallic-shimmer {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};
