import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { CardEffectsLayer } from './CardEffectsLayer';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';

interface CardBackProps {
  card: CardData;
  isFlipped: boolean;
  isHovering: boolean;
  showEffects: boolean;
  effectIntensity: number[];
  mousePosition: { x: number; y: number };
  physicalEffectStyles: React.CSSProperties;
  SurfaceTexture: React.ReactNode;
  effectValues?: EffectValues;
  interactiveLighting?: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({
  card,
  isFlipped,
  isHovering,
  showEffects,
  effectIntensity,
  mousePosition,
  physicalEffectStyles,
  SurfaceTexture,
  effectValues,
  interactiveLighting = false
}) => {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
      style={{
        transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Enhanced CRD Branded Background */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: `
            radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 35%, #0f172a 70%, #000000 100%),
            linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #1e293b 75%, #0f172a 100%)
          `,
          backgroundBlendMode: 'multiply'
        }}
      />

      {/* Enhanced Geometric Pattern Overlay */}
      <div 
        className="absolute inset-0 z-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.08) 0%, transparent 25%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.015) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(255, 255, 255, 0.015) 50%, transparent 60%)
          `,
          backgroundSize: '200px 200px, 200px 200px, 100px 100px, 100px 100px'
        }}
      />

      {/* Enhanced Card Information Panel */}
      <div className="absolute inset-0 z-30 p-8 flex flex-col">
        {/* Top Section - Card Details */}
        <div className="flex-1 space-y-6">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/60 backdrop-blur-sm rounded-lg p-4 border border-slate-600/30">
            <h3 className="text-white text-lg font-bold mb-2">{card.title || 'Digital Card'}</h3>
            {card.description && (
              <p className="text-slate-300 text-sm">{card.description}</p>
            )}
            {card.rarity && (
              <div className="mt-3 inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                <span className="text-white text-xs font-medium uppercase tracking-wide">{card.rarity}</span>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-lg p-4 border border-slate-600/20">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-slate-400 text-xs uppercase tracking-wide">Edition</div>
                <div className="text-white font-bold">Limited</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs uppercase tracking-wide">Series</div>
                <div className="text-white font-bold">CRD Gen 1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - CRD Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent flex-1" />
            <div className="text-slate-400 text-xs uppercase tracking-widest">Powered By</div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent flex-1" />
          </div>
          
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png" 
              alt="CRD Logo" 
              className="w-32 h-auto opacity-90"
              style={{
                filter: showEffects 
                  ? 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.4)) brightness(1.05)' 
                  : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}
            />
          </div>

          <div className="text-slate-500 text-xs">
            Authentic Digital Trading Card
          </div>
        </div>
      </div>

      {/* Enhanced Effects Layer */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <CardEffectsLayer
          showEffects={showEffects}
          isHovering={isHovering}
          effectIntensity={effectIntensity}
          mousePosition={mousePosition}
          physicalEffectStyles={physicalEffectStyles}
          effectValues={effectValues}
          interactiveLighting={interactiveLighting}
        />
      </div>

      {/* Enhanced Interactive Lighting for Back */}
      {interactiveLighting && isHovering && (
        <div
          className="absolute inset-0 z-45 pointer-events-none rounded-xl"
          style={{
            background: `
              radial-gradient(
                ellipse 150% 120% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(16, 185, 129, 0.12) 0%,
                rgba(59, 130, 246, 0.08) 30%,
                rgba(255, 255, 255, 0.04) 60%,
                transparent 80%
              )
            `,
            mixBlendMode: 'screen',
            transition: 'opacity 0.2s ease',
            opacity: showEffects ? 1 : 0.8
          }}
        />
      )}

      {/* Enhanced Glow Effect Border */}
      {showEffects && (
        <div 
          className="absolute inset-0 z-50 pointer-events-none rounded-xl"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.25)) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
      )}
    </div>
  );
};
