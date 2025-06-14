
import React, { useRef, useEffect, useState } from 'react';
import { CardText } from '../components/CardText';
import type { CardData } from '@/hooks/useCardEditor';
import type { Panoramic360Environment } from './Panoramic360Library';

interface CSS3DCardProps {
  card: CardData;
  environment: Panoramic360Environment;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  autoRotate?: boolean;
  zoom?: number;
  onClick?: () => void;
}

export const CSS3DCard: React.FC<CSS3DCardProps> = ({
  card,
  environment,
  mousePosition,
  isHovering,
  autoRotate = false,
  zoom = 1,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });

  console.log('🎴 CSS3DCard rendering:', card.title);

  // Image loading
  useEffect(() => {
    if (!card.image_url) return;

    const img = new Image();
    img.onload = () => {
      console.log('✅ Card image loaded for CSS 3D:', card.title);
      setImageLoaded(true);
    };
    img.src = card.image_url;
  }, [card.image_url, card.title]);

  // Mouse interaction
  useEffect(() => {
    if (!cardRef.current || !imageLoaded) return;

    const rotationStrength = 15;
    const targetRotationX = (mousePosition.y - 0.5) * rotationStrength;
    const targetRotationY = (mousePosition.x - 0.5) * -rotationStrength;

    // Smooth rotation interpolation
    const animate = () => {
      rotationRef.current.x += (targetRotationX - rotationRef.current.x) * 0.1;
      rotationRef.current.y += (targetRotationY - rotationRef.current.y) * 0.1;
      
      if (autoRotate) {
        rotationRef.current.z += environment.camera.autoRotateSpeed;
      }

      if (cardRef.current) {
        const scale = isHovering ? 1.05 * zoom : zoom;
        const translateZ = isHovering ? 50 : 0;
        
        cardRef.current.style.transform = `
          perspective(1000px)
          rotateX(${rotationRef.current.x}deg)
          rotateY(${rotationRef.current.y}deg)
          rotateZ(${rotationRef.current.z}deg)
          scale3d(${scale}, ${scale}, ${scale})
          translateZ(${translateZ}px)
        `;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [mousePosition, isHovering, autoRotate, zoom, environment.camera.autoRotateSpeed, imageLoaded]);

  if (!imageLoaded && card.image_url) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-64 h-80 bg-gray-800 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full perspective-1000">
      <div
        ref={cardRef}
        className="relative w-64 h-80 cursor-pointer transition-all duration-200 preserve-3d"
        onClick={onClick}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {/* Card Front */}
        <div 
          className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl backface-hidden"
          style={{
            backgroundImage: card.image_url ? `url(${card.image_url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: card.image_url ? 'transparent' : '#1f2937',
            filter: `brightness(${environment.lighting.brightness}) contrast(${environment.lighting.contrast})`
          }}
        >
          {!card.image_url && (
            <div className="flex items-center justify-center h-full text-white text-xl font-bold">
              {card.title}
            </div>
          )}
          
          {/* Card overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
          
          {/* Holographic effect */}
          {isHovering && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 animate-pulse" />
          )}
        </div>

        {/* Card Back */}
        <div 
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 shadow-2xl backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center justify-center h-full text-white text-lg font-bold">
            CRD
          </div>
        </div>

        {/* Enhanced edge lighting */}
        {isHovering && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
        )}

        {/* Card title floating above */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <h3 className="text-lg font-bold drop-shadow-lg">{card.title}</h3>
          {card.rarity && (
            <p className="text-sm text-yellow-400 font-semibold">★ {card.rarity.toUpperCase()} ★</p>
          )}
        </div>
      </div>
    </div>
  );
};
