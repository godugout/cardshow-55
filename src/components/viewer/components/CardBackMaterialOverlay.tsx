
import React from 'react';
import type { CardBackMaterial } from '../hooks/useDynamicCardBackMaterials';

interface CardBackMaterialOverlayProps {
  selectedMaterial: CardBackMaterial;
}

export const CardBackMaterialOverlay: React.FC<CardBackMaterialOverlayProps> = ({
  selectedMaterial
}) => {
  return (
    <>
      {/* Noise Texture */}
      {selectedMaterial.texture === 'noise' && (
        <div 
          className="absolute inset-0 z-25 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            animation: 'noise-shift 8s ease-in-out infinite alternate',
            pointerEvents: 'none',
            backfaceVisibility: 'hidden'
          }}
        />
      )}

      {/* Glitter Texture */}
      {selectedMaterial.texture === 'glitter' && (
        <>
          <div 
            className="absolute inset-0 z-25 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='glitter' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='3' cy='7' r='0.8' fill='%23ffffff' opacity='0.9'/%3E%3Ccircle cx='15' cy='2' r='0.6' fill='%23e1e5e9' opacity='0.7'/%3E%3Ccircle cx='8' cy='15' r='0.7' fill='%23f8fafc' opacity='0.8'/%3E%3Ccircle cx='18' cy='11' r='0.5' fill='%23ffffff' opacity='0.6'/%3E%3Ccircle cx='6' cy='19' r='0.4' fill='%23e2e8f0' opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23glitter)'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
              animation: 'glitter-sparkle 4s ease-in-out infinite alternate',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
          <div 
            className="absolute inset-0 z-26 opacity-25 mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='sparkles' x='0' y='0' width='30' height='30' patternUnits='userSpaceOnUse'%3E%3Cpolygon points='15,5 17,12 24,12 18.5,16.5 21,24 15,19 9,24 11.5,16.5 6,12 13,12' fill='%23ffffff' opacity='0.8'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23sparkles)'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
              animation: 'sparkles-twinkle 6s ease-in-out infinite alternate-reverse',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
        </>
      )}

      {/* Ice Scratches Texture */}
      {selectedMaterial.texture === 'ice-scratches' && (
        <>
          <div 
            className="absolute inset-0 z-25 opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='scratches' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M5,10 L35,15 M8,25 L38,20 M2,35 L32,30' stroke='%23ffffff' stroke-width='0.5' opacity='0.6'/%3E%3Cpath d='M15,5 L25,35 M30,8 L40,38' stroke='%23e0f2fe' stroke-width='0.3' opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23scratches)'/%3E%3C/svg%3E")`,
              backgroundSize: '160px 160px',
              animation: 'ice-shimmer 10s ease-in-out infinite alternate',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
          <div 
            className="absolute inset-0 z-26 opacity-15 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='crystals' x='0' y='0' width='25' height='25' patternUnits='userSpaceOnUse'%3E%3Cpolygon points='12.5,2 20,12.5 12.5,23 5,12.5' fill='none' stroke='%23bae6fd' stroke-width='0.5' opacity='0.7'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23crystals)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              animation: 'crystal-pulse 8s ease-in-out infinite alternate-reverse',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
        </>
      )}

      {/* Moon Dust Texture */}
      {selectedMaterial.texture === 'moon-dust' && (
        <>
          <div 
            className="absolute inset-0 z-25 opacity-35 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='dust' x='0' y='0' width='5' height='5' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='1' cy='1' r='0.3' fill='%23d1d5db' opacity='0.8'/%3E%3Ccircle cx='3' cy='3' r='0.2' fill='%23e5e7eb' opacity='0.6'/%3E%3Ccircle cx='2' cy='4' r='0.15' fill='%23f3f4f6' opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23dust)'/%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px',
              animation: 'dust-drift 12s linear infinite',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
          <div 
            className="absolute inset-0 z-26 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grain' x='0' y='0' width='8' height='8' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='2' cy='2' r='0.5' fill='%239ca3af' opacity='0.5'/%3E%3Ccircle cx='6' cy='6' r='0.3' fill='%236b7280' opacity='0.3'/%3E%3Ccircle cx='4' cy='7' r='0.2' fill='%234b5563' opacity='0.4'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grain)'/%3E%3C/svg%3E")`,
              backgroundSize: '32px 32px',
              animation: 'grain-float 15s ease-in-out infinite alternate',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden'
            }}
          />
        </>
      )}

      {/* Material-specific accent overlay */}
      <div 
        className="absolute inset-0 z-27"
        style={{
          background: `radial-gradient(
            circle at 30% 30%, 
            ${selectedMaterial.borderColor} 0%, 
            transparent 40%
          ), radial-gradient(
            circle at 70% 70%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 30%
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.6,
          pointerEvents: 'none',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* CSS animations */}
      <style>
        {`
          @keyframes noise-shift {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-20px, -20px); }
          }
          
          @keyframes glitter-sparkle {
            0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
            50% { transform: translate(-5px, -5px) scale(1.1); opacity: 0.6; }
            100% { transform: translate(-10px, -10px) scale(1); opacity: 0.4; }
          }
          
          @keyframes sparkles-twinkle {
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0.25; }
            50% { transform: translate(3px, 3px) rotate(180deg); opacity: 0.4; }
            100% { transform: translate(6px, 6px) rotate(360deg); opacity: 0.25; }
          }
          
          @keyframes ice-shimmer {
            0% { transform: translate(0, 0) scaleX(1); opacity: 0.2; }
            50% { transform: translate(-3px, 2px) scaleX(1.05); opacity: 0.3; }
            100% { transform: translate(-6px, 4px) scaleX(1); opacity: 0.2; }
          }
          
          @keyframes crystal-pulse {
            0% { transform: scale(1) rotate(0deg); opacity: 0.15; }
            50% { transform: scale(1.1) rotate(5deg); opacity: 0.25; }
            100% { transform: scale(1) rotate(0deg); opacity: 0.15; }
          }
          
          @keyframes dust-drift {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-2px, -1px); }
            50% { transform: translate(-4px, -2px); }
            75% { transform: translate(-6px, -3px); }
            100% { transform: translate(-8px, -4px); }
          }
          
          @keyframes grain-float {
            0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
            50% { transform: translate(-2px, -1px) scale(1.05); opacity: 0.3; }
            100% { transform: translate(-4px, -2px) scale(1); opacity: 0.2; }
          }
        `}
      </style>
    </>
  );
};
