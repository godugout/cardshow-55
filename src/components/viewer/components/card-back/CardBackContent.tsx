
import React from 'react';
import type { CardData } from '@/hooks/useCardEditor';
import { InteractiveLogo } from '../InteractiveLogo';
import { getTextStyles } from './CardBackMaterialStyles';

interface CardBackContentProps {
  card?: CardData;
  selectedMaterial: any;
}

export const CardBackContent: React.FC<CardBackContentProps> = ({
  card,
  selectedMaterial
}) => {
  const textStyles = getTextStyles(selectedMaterial.id);

  const handleLogoClick = () => {
    console.log('🎉 Logo clicked! Adding some magic...');
  };

  return (
    <div className="relative h-full flex flex-col justify-between p-6 z-30">
      {/* Top Section - Very Subtle Card Info */}
      <div className="text-center">
        <div 
          className="rounded-lg p-3 border border-white border-opacity-5"
          style={{
            background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
              ? 'rgba(255, 255, 255, 0.02)' 
              : 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)'
          }}
        >
          <h3 
            className="text-xs font-medium mb-1"
            style={{...textStyles, opacity: 0.4, fontSize: '0.65rem'}}
          >
            Card Details
          </h3>
          {card && (
            <>
              <p 
                className="text-xs mb-1"
                style={{...textStyles, fontSize: '0.6rem', opacity: 0.3}}
              >
                {card.title}
              </p>
              {card.rarity && (
                <p 
                  className="text-xs uppercase tracking-wide"
                  style={{...textStyles, fontSize: '0.55rem', opacity: 0.25}}
                >
                  {card.rarity}
                </p>
              )}
              {card.creator_attribution?.creator_name && (
                <p 
                  className="text-xs"
                  style={{...textStyles, fontSize: '0.5rem', opacity: 0.2}}
                >
                  Created by: {card.creator_attribution.creator_name}
                </p>
              )}
            </>
          )}
        </div>

        {/* Holographic sticker overlay for crystal/glass materials */}
        {(selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice') && (
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `
                linear-gradient(45deg, 
                  rgba(255, 107, 107, 0.08) 0%, 
                  rgba(78, 205, 196, 0.08) 25%, 
                  rgba(69, 183, 209, 0.08) 50%, 
                  rgba(150, 206, 180, 0.08) 75%, 
                  rgba(255, 234, 167, 0.08) 100%
                )
              `,
              animation: 'holographic-shift 4s ease-in-out infinite',
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </div>

      {/* Center Section - CRD Logo (Primary Focus) */}
      <div className="flex-1 flex items-center justify-center">
        <InteractiveLogo
          logoUrl="/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png"
          alt="CRD Logo"
          onLogoClick={handleLogoClick}
        />
      </div>

      {/* Bottom Section - Very Subtle Additional Info */}
      <div className="text-center">
        <div 
          className="rounded-lg p-2 border border-white border-opacity-3"
          style={{
            background: selectedMaterial.id === 'crystal' || selectedMaterial.id === 'ice' 
              ? 'rgba(255, 255, 255, 0.015)' 
              : 'rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(1px)'
          }}
        >
          <p 
            className="text-xs"
            style={{...textStyles, fontSize: '0.55rem', opacity: 0.2}}
          >
            Collectible Trading Card
          </p>
          <p 
            className="text-xs"
            style={{...textStyles, fontSize: '0.5rem', opacity: 0.15}}
          >
            CRD Platform © 2024
          </p>
        </div>
      </div>
    </div>
  );
};
