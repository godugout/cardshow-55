
import React, { useMemo } from 'react';

interface HDRBackgroundGalleryProps {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}

export const HDRBackgroundGallery: React.FC<HDRBackgroundGalleryProps> = ({
  mousePosition,
  isHovering
}) => {
  // Cache parallax calculations for performance
  const parallaxLayers = useMemo(() => {
    const baseX = (mousePosition.x - 0.5) * 100;
    const baseY = (mousePosition.y - 0.5) * 50;
    
    return [
      {
        id: 'mountain-summit',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
        depth: -400,
        parallaxX: baseX * 0.3,
        parallaxY: baseY * 0.2,
        scale: 1.2,
        blur: 3,
        opacity: 0.6,
        position: 'top-left'
      },
      {
        id: 'river-mountains',
        image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1920&q=80',
        depth: -300,
        parallaxX: baseX * 0.5,
        parallaxY: baseY * 0.3,
        scale: 1.1,
        blur: 2,
        opacity: 0.4,
        position: 'center-right'
      },
      {
        id: 'starry-night',
        image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&q=80',
        depth: -500,
        parallaxX: baseX * 0.2,
        parallaxY: baseY * 0.1,
        scale: 1.3,
        blur: 4,
        opacity: 0.3,
        position: 'bottom-center'
      },
      {
        id: 'forest-lights',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&q=80',
        depth: -200,
        parallaxX: baseX * 0.7,
        parallaxY: baseY * 0.4,
        scale: 1.0,
        blur: 1,
        opacity: 0.5,
        position: 'top-right'
      }
    ];
  }, [mousePosition.x, mousePosition.y]);

  const getPositionStyles = (position: string) => {
    const positions = {
      'top-left': { top: '10%', left: '5%' },
      'top-right': { top: '15%', right: '8%' },
      'center-right': { top: '45%', right: '12%' },
      'bottom-center': { bottom: '20%', left: '50%', transform: 'translateX(-50%)' },
      'bottom-left': { bottom: '15%', left: '10%' }
    };
    return positions[position as keyof typeof positions] || positions['top-left'];
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* HDR Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(255, 107, 107, 0.04) 0%, 
              rgba(78, 205, 196, 0.03) 30%,
              rgba(69, 183, 209, 0.02) 60%,
              transparent 90%)
          `,
          filter: 'blur(3px)',
          opacity: isHovering ? 0.9 : 0.6,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* HDR Photography Elements */}
      {parallaxLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute rounded-2xl overflow-hidden shadow-2xl"
          style={{
            ...getPositionStyles(layer.position),
            width: '320px',
            height: '240px',
            transform: `
              perspective(1200px) 
              translateZ(${layer.depth}px) 
              translateX(${layer.parallaxX}px) 
              translateY(${layer.parallaxY}px)
              scale(${layer.scale})
              rotateX(${(mousePosition.y - 0.5) * 10}deg)
              rotateY(${(mousePosition.x - 0.5) * 15}deg)
            `,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px) contrast(1.4) saturate(1.6) brightness(1.3)`,
            transition: 'all 0.2s ease-out',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.3),
              0 0 60px rgba(59, 130, 246, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          <img
            src={layer.image}
            alt="HDR Background"
            className="w-full h-full object-cover"
            style={{
              filter: 'hue-rotate(10deg) contrast(1.2)',
              mixBlendMode: 'luminosity'
            }}
            loading="lazy"
          />
          
          {/* HDR Overlay Effects */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(45deg, 
                  rgba(255, 255, 255, 0.1) 0%, 
                  transparent 50%, 
                  rgba(59, 130, 246, 0.05) 100%)
              `,
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Chromatic Aberration Effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
                  rgba(255, 0, 100, 0.03) 0%, 
                  rgba(0, 255, 200, 0.02) 50%,
                  transparent 100%)
              `,
              mixBlendMode: 'screen'
            }}
          />
        </div>
      ))}

      {/* Floating Light Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              transform: `
                translateX(${mousePosition.x * 20}px) 
                translateY(${mousePosition.y * 10}px)
                translateZ(${-100 - i * 50}px)
              `,
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
          />
        ))}
      </div>

      {/* Depth Field Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at center, 
              transparent 0%, 
              rgba(0, 0, 0, 0.1) 70%,
              rgba(0, 0, 0, 0.3) 100%)
          `,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
};
