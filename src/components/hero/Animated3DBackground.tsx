
import React, { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface Animated3DBackgroundProps {
  className?: string;
  variant?: 'panels' | 'cards' | 'particles' | 'glass' | 'shapes';
}

export const Animated3DBackground: React.FC<Animated3DBackgroundProps> = ({ 
  className = "",
  variant = 'panels'
}) => {
  const mousePosition = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panels = container.querySelectorAll('.panel-3d');
    
    panels.forEach((panel, index) => {
      const element = panel as HTMLElement;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (mousePosition.x - centerX) / centerX;
      const deltaY = (mousePosition.y - centerY) / centerY;
      
      const rotateX = deltaY * (5 + index * 0.5);
      const rotateY = deltaX * (5 + index * 0.5);
      const translateZ = Math.sin(index * 0.5) * 20;
      
      element.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(${translateZ}px)
      `;
    });
  }, [mousePosition]);

  const renderPanels = () => {
    const panels = [];
    for (let i = 0; i < 24; i++) {
      const delay = i * 0.1;
      const hue = (i * 30) % 360;
      
      panels.push(
        <div
          key={i}
          className="panel-3d absolute w-16 h-16 rounded-lg opacity-20 hover:opacity-40 transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${hue}, 70%, 60%), 
              hsl(${(hue + 60) % 360}, 70%, 70%), 
              hsl(${(hue + 120) % 360}, 70%, 50%))`,
            left: `${(i % 6) * 16 + Math.sin(i * 0.5) * 10}%`,
            top: `${Math.floor(i / 6) * 20 + Math.cos(i * 0.3) * 5}%`,
            animationDelay: `${delay}s`,
            transform: `translateZ(${Math.sin(i * 0.8) * 30}px)`,
            boxShadow: `0 4px 20px hsla(${hue}, 70%, 60%, 0.3)`,
          }}
        />
      );
    }
    return panels;
  };

  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < 12; i++) {
      const delay = i * 0.2;
      const hue = (i * 45) % 360;
      
      cards.push(
        <div
          key={i}
          className="panel-3d absolute w-24 h-32 rounded-xl opacity-15 hover:opacity-30 transition-all duration-700"
          style={{
            background: `linear-gradient(145deg, 
              hsla(${hue}, 80%, 65%, 0.8), 
              hsla(${(hue + 90) % 360}, 80%, 55%, 0.6))`,
            left: `${(i % 4) * 25 + Math.sin(i * 0.7) * 8}%`,
            top: `${Math.floor(i / 4) * 30 + Math.cos(i * 0.4) * 10}%`,
            animationDelay: `${delay}s`,
            transform: `rotateY(${i * 15}deg) translateZ(${Math.sin(i) * 40}px)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid hsla(${hue}, 70%, 70%, 0.3)`,
          }}
        />
      );
    }
    return cards;
  };

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      const delay = i * 0.05;
      const hue = (i * 20) % 360;
      
      particles.push(
        <div
          key={i}
          className="panel-3d absolute w-3 h-3 rounded-full opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, 
              hsl(${hue}, 90%, 70%), 
              hsl(${(hue + 60) % 360}, 90%, 80%))`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${delay}s`,
            transform: `translateZ(${Math.random() * 60 - 30}px)`,
            boxShadow: `0 0 10px hsl(${hue}, 90%, 70%)`,
          }}
        />
      );
    }
    return particles;
  };

  const renderGlass = () => {
    const planes = [];
    for (let i = 0; i < 8; i++) {
      const delay = i * 0.3;
      const hue = (i * 60) % 360;
      
      planes.push(
        <div
          key={i}
          className="panel-3d absolute w-32 h-48 rounded-2xl opacity-10 hover:opacity-20 transition-all duration-1000"
          style={{
            background: `linear-gradient(160deg, 
              hsla(${hue}, 60%, 70%, 0.2), 
              hsla(${(hue + 120) % 360}, 60%, 80%, 0.1))`,
            left: `${(i % 3) * 30 + Math.sin(i * 0.6) * 15}%`,
            top: `${Math.floor(i / 3) * 25 + Math.cos(i * 0.8) * 12}%`,
            animationDelay: `${delay}s`,
            transform: `rotateX(${i * 10}deg) rotateY(${i * 20}deg) translateZ(${i * 15}px)`,
            backdropFilter: 'blur(15px)',
            border: `1px solid hsla(${hue}, 60%, 80%, 0.2)`,
          }}
        />
      );
    }
    return planes;
  };

  const renderShapes = () => {
    const shapes = [];
    const shapeTypes = ['triangle', 'hexagon', 'diamond', 'star'];
    
    for (let i = 0; i < 16; i++) {
      const delay = i * 0.15;
      const hue = (i * 40) % 360;
      const shapeType = shapeTypes[i % shapeTypes.length];
      
      shapes.push(
        <div
          key={i}
          className={`panel-3d absolute w-12 h-12 opacity-25 hover:opacity-40 transition-all duration-600 ${
            shapeType === 'triangle' ? 'clip-triangle' :
            shapeType === 'hexagon' ? 'clip-hexagon' :
            shapeType === 'diamond' ? 'rotate-45' :
            'clip-star'
          }`}
          style={{
            background: `conic-gradient(from ${i * 45}deg, 
              hsl(${hue}, 85%, 65%), 
              hsl(${(hue + 90) % 360}, 85%, 75%), 
              hsl(${(hue + 180) % 360}, 85%, 60%))`,
            left: `${(i % 4) * 20 + Math.sin(i * 0.9) * 12}%`,
            top: `${Math.floor(i / 4) * 25 + Math.cos(i * 0.6) * 8}%`,
            animationDelay: `${delay}s`,
            transform: `rotate(${i * 22.5}deg) translateZ(${Math.sin(i * 1.2) * 25}px)`,
            filter: `hue-rotate(${i * 20}deg)`,
          }}
        />
      );
    }
    return shapes;
  };

  const renderVariant = () => {
    switch (variant) {
      case 'cards': return renderCards();
      case 'particles': return renderParticles();
      case 'glass': return renderGlass();
      case 'shapes': return renderShapes();
      default: return renderPanels();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-3d {
            0%, 100% { transform: translateY(0px) translateZ(0px); }
            50% { transform: translateY(-10px) translateZ(15px); }
          }
          
          .panel-3d {
            animation: float-3d 4s ease-in-out infinite;
            transform-style: preserve-3d;
            will-change: transform;
          }
          
          .clip-triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          
          .clip-hexagon {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          }
          
          .clip-star {
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          }
          
          @media (prefers-reduced-motion: reduce) {
            .panel-3d {
              animation: none;
              transform: none !important;
            }
          }
        `
      }} />
      
      <div 
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {renderVariant()}
      </div>
    </>
  );
};
