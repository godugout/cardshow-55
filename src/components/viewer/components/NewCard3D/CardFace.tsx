
import React from 'react';

interface CardFaceProps {
  image: string;
  title?: string;
  isBack?: boolean;
  isVisible: boolean;
  className?: string;
}

export const CardFace: React.FC<CardFaceProps> = ({
  image,
  title,
  isBack = false,
  isVisible,
  className = ''
}) => {
  console.log(`🎴 CardFace render - ${isBack ? 'BACK' : 'FRONT'}:`, {
    image,
    isVisible,
    title
  });

  return (
    <div
      className={`absolute inset-0 w-full h-full rounded-xl overflow-hidden ${className}`}
      style={{
        transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
        opacity: isVisible ? 1 : 0,
        zIndex: isVisible ? 10 : 5,
        backfaceVisibility: 'hidden',
        transition: 'opacity 0.3s ease'
      }}
      data-face={isBack ? 'back' : 'front'}
      data-visible={isVisible}
    >
      {/* Background for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      
      {/* Main Image */}
      <img
        src={image}
        alt={isBack ? 'Card Back' : title || 'Card Front'}
        className="w-full h-full object-cover relative z-10"
        style={{
          imageRendering: 'crisp-edges',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: 'none'
        }}
        draggable={false}
        onLoad={() => {
          console.log(`✅ ${isBack ? 'BACK' : 'FRONT'} image loaded:`, image);
        }}
        onError={(e) => {
          console.error(`❌ ${isBack ? 'BACK' : 'FRONT'} image failed:`, image, e);
        }}
      />
      
      {/* Debug indicator */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded z-20">
        {isBack ? 'BACK' : 'FRONT'} - {isVisible ? 'VISIBLE' : 'HIDDEN'}
      </div>
      
      {/* Title overlay for front face */}
      {!isBack && title && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3">
            <h3 className="text-white text-lg font-bold">{title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};
