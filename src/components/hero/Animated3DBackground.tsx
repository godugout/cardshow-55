
import React from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

export const Animated3DBackground: React.FC = () => {
  const { x, y } = useMousePosition();
  
  // Convert mouse position to transform values
  const mouseX = (x / window.innerWidth - 0.5) * 2; // -1 to 1
  const mouseY = (y / window.innerHeight - 0.5) * 2; // -1 to 1
  
  // Create grid of panels (6x4)
  const panels = Array.from({ length: 24 }, (_, i) => {
    const row = Math.floor(i / 6);
    const col = i % 6;
    
    // Different gradient variations using CRD colors
    const gradients = [
      'linear-gradient(135deg, hsl(142, 70%, 50%), hsl(200, 75%, 60%))',
      'linear-gradient(135deg, hsl(200, 75%, 60%), hsl(219, 70%, 65%))',
      'linear-gradient(135deg, hsl(219, 70%, 65%), hsl(260, 40%, 65%))',
      'linear-gradient(135deg, hsl(260, 40%, 65%), hsl(142, 70%, 50%))',
      'linear-gradient(135deg, hsl(142, 70%, 50%), hsl(219, 70%, 65%))',
      'linear-gradient(135deg, hsl(200, 75%, 60%), hsl(260, 40%, 65%))',
    ];
    
    const gradientIndex = (row + col) % gradients.length;
    
    return {
      id: i,
      row,
      col,
      gradient: gradients[gradientIndex],
      delay: (row + col) * 0.1,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="relative w-full h-full"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${mouseY * 5}deg) rotateY(${mouseX * 5}deg)`,
          }}
        >
          {panels.map((panel) => (
            <div
              key={panel.id}
              className="absolute w-16 h-12 opacity-80"
              style={{
                left: `${20 + panel.col * 12}%`,
                top: `${20 + panel.row * 15}%`,
                background: panel.gradient,
                transform: `
                  translate3d(${mouseX * (panel.col + 1) * 2}px, ${mouseY * (panel.row + 1) * 2}px, ${(panel.row + panel.col) * 10}px)
                  rotateX(45deg) 
                  rotateY(-25deg)
                `,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s ease-out',
                borderRadius: '4px',
                boxShadow: `
                  0 0 20px rgba(${142 + panel.col * 20}, ${200 + panel.row * 10}, ${255 - panel.col * 30}, 0.3),
                  0 8px 32px rgba(0, 0, 0, 0.2)
                `,
                animation: `float-${panel.id} ${4 + panel.delay}s ease-in-out infinite`,
                willChange: 'transform',
              }}
            >
              {/* Panel face */}
              <div
                className="absolute inset-0 rounded"
                style={{
                  background: panel.gradient,
                  transform: 'translateZ(2px)',
                }}
              />
              {/* Panel side */}
              <div
                className="absolute top-0 right-0 w-1 h-full"
                style={{
                  background: `linear-gradient(to bottom, 
                    rgba(255, 255, 255, 0.3), 
                    rgba(0, 0, 0, 0.2)
                  )`,
                  transform: 'rotateY(90deg) translateZ(-2px)',
                  transformOrigin: 'left center',
                }}
              />
              {/* Panel bottom */}
              <div
                className="absolute bottom-0 left-0 w-full h-1"
                style={{
                  background: `linear-gradient(to right, 
                    rgba(0, 0, 0, 0.3), 
                    rgba(255, 255, 255, 0.1)
                  )`,
                  transform: 'rotateX(-90deg) translateZ(-2px)',
                  transformOrigin: 'center top',
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating animation keyframes */}
      <style jsx>{`
        ${panels.map(panel => `
          @keyframes float-${panel.id} {
            0%, 100% { 
              transform: 
                translate3d(${mouseX * (panel.col + 1) * 2}px, ${mouseY * (panel.row + 1) * 2}px, ${(panel.row + panel.col) * 10}px)
                rotateX(45deg) 
                rotateY(-25deg)
                translateZ(0px);
            }
            50% { 
              transform: 
                translate3d(${mouseX * (panel.col + 1) * 2}px, ${mouseY * (panel.row + 1) * 2}px, ${(panel.row + panel.col) * 10}px)
                rotateX(45deg) 
                rotateY(-25deg)
                translateZ(${Math.sin(panel.id) * 5 + 5}px);
            }
          }
        `).join('\n')}
        
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
