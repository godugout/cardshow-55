
import React, { useState } from 'react';

interface InteractiveLogoProps {
  logoUrl: string;
  alt: string;
  className?: string;
  onLogoClick?: () => void;
}

export const InteractiveLogo: React.FC<InteractiveLogoProps> = ({
  logoUrl,
  alt,
  className = '',
  onLogoClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    
    setIsAnimating(true);
    onLogoClick?.();
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onClick={handleLogoClick}
    >
      <img 
        src={logoUrl}
        alt={alt}
        className={`
          w-64 h-auto relative z-10 transition-all duration-300 ease-out
          group-hover:scale-105 group-hover:brightness-110
          ${isAnimating ? 'animate-pulse scale-110' : ''}
        `}
        style={{
          filter: `
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))
            ${isAnimating ? 'drop-shadow(0 0 20px rgba(0, 200, 81, 0.6))' : ''}
          `,
          imageRendering: 'crisp-edges',
          objectFit: 'contain'
        }}
        onLoad={() => console.log('✅ Interactive CRD logo loaded successfully')}
        onError={() => console.log('❌ Error loading interactive CRD logo')}
        draggable={false}
      />
      
      {/* Ripple effect on click */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 border-2 border-crd-green rounded-full animate-ping opacity-75" />
          <div className="absolute w-48 h-48 border border-crd-green rounded-full animate-ping animation-delay-150 opacity-50" />
        </div>
      )}
      
      {/* Hover hint */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
          Click for surprise!
        </div>
      </div>
    </div>
  );
};
