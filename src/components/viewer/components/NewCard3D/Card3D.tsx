
import React from 'react';
import { CardFace } from './CardFace';
import { CardEffects } from './CardEffects';
import { useCard3D } from './useCard3D';
import type { Card3DProps } from './types';

export const Card3D: React.FC<Card3DProps> = ({
  frontImage,
  backImage = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
  title,
  className = '',
  onClick,
  onFlip,
  interactive = true,
  effects = {}
}) => {
  const { state, actions } = useCard3D();

  console.log('🎯 Card3D render:', {
    frontImage,
    backImage,
    isFlipped: state.isFlipped,
    title
  });

  const handleClick = () => {
    if (interactive) {
      actions.handleFlip();
      onFlip?.(state.isFlipped);
      onClick?.();
    }
  };

  const cardTransform = `
    perspective(1000px)
    rotateX(${state.rotation.x}deg)
    rotateY(${state.isFlipped ? 180 : 0}deg)
    rotateZ(0deg)
    scale(${state.isHovering ? 1.02 : 1})
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Card Container */}
      <div
        className={`
          relative w-[400px] h-[560px] cursor-pointer
          transform-gpu transition-all duration-500 ease-out
          ${interactive ? 'hover:shadow-2xl' : ''}
        `}
        style={{
          transform: cardTransform,
          transformStyle: 'preserve-3d'
        }}
        onClick={handleClick}
        onMouseEnter={actions.handleMouseEnter}
        onMouseLeave={actions.handleMouseLeave}
        onMouseMove={actions.handleMouseMove}
      >
        {/* Front Face */}
        <CardFace
          image={frontImage}
          title={title}
          isBack={false}
          isVisible={!state.isFlipped}
          className="shadow-lg"
        />

        {/* Back Face */}
        <CardFace
          image={backImage}
          isBack={true}
          isVisible={state.isFlipped}
          className="shadow-lg"
        />

        {/* Effects Layer */}
        <CardEffects
          effects={effects}
          isHovering={state.isHovering}
          mousePosition={state.mousePosition}
        />
      </div>

      {/* Interaction Hint */}
      {interactive && state.isHovering && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap animate-fade-in">
            Click to flip
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="absolute -bottom-16 left-0 right-0 text-center text-xs text-gray-400">
        State: {state.isFlipped ? 'BACK' : 'FRONT'} | 
        Mouse: ({state.mousePosition.x.toFixed(2)}, {state.mousePosition.y.toFixed(2)}) |
        Hovering: {state.isHovering ? 'YES' : 'NO'}
      </div>
    </div>
  );
};
