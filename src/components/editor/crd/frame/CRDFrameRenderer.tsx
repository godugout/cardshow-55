import React from 'react';
import type { CRDFrame } from '@/types/crd-frame';

interface CRDFrameRendererProps {
  frame: CRDFrame;
  content?: Record<string, any>;
  colorTheme?: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  className?: string;
}

export const CRDFrameRenderer: React.FC<CRDFrameRendererProps> = ({
  frame,
  content = {},
  colorTheme = {
    primary: 'hsl(220, 100%, 50%)',
    secondary: 'hsl(220, 100%, 70%)',
    accent: 'hsl(45, 100%, 60%)',
    neutral: 'hsl(220, 10%, 80%)'
  },
  className = ''
}) => {
  const { width, height } = frame.frame_config.dimensions;

  // Default CRD data
  const crdData = {
    catalogNumber: content.catalogNumber || 'CRD-001',
    seriesNumber: content.seriesNumber || '#001',
    available: content.available || '1:1',
    crdName: content.crdName || 'Legendary Card',
    creator: content.creator || 'Creator Name',
    logo: content.logo || null,
    rarity: content.rarity || 'common',
    ...content
  };

  const rarityGlow = {
    common: 'drop-shadow-sm',
    uncommon: 'drop-shadow-md',
    rare: 'drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    epic: 'drop-shadow-xl filter drop-shadow-[0_0_12px_rgba(147,51,234,0.6)]',
    legendary: 'drop-shadow-2xl filter drop-shadow-[0_0_16px_rgba(251,191,36,0.7)]',
    mythic: 'filter drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]'
  };

  // Check if this is the full bleed back frame
  const isFullBleedBack = frame.id === 'full-bleed-back';

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
    >
      {isFullBleedBack ? (
        // Full Bleed CRD Back Layout
        <>
          <div 
            className="absolute inset-0 rounded-lg shadow-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.secondary}, ${colorTheme.accent})`
            }}
          >
            {/* Background Pattern */}
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${colorTheme.primary}40 0%, transparent 50%)`
              }}
            />
            
            {/* Centered CRD Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/crd-logo-gradient.png" 
                alt="CRD Logo"
                className="w-32 h-32 object-contain drop-shadow-lg"
              />
            </div>
            
            {/* Subtle corner accents */}
            <div 
              className="absolute top-0 right-0 w-16 h-16 opacity-30"
              style={{
                background: `linear-gradient(225deg, ${colorTheme.accent} 0%, transparent 50%)`
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-16 h-16 opacity-30"
              style={{
                background: `linear-gradient(45deg, ${colorTheme.accent} 0%, transparent 50%)`
              }}
            />
          </div>
          
          {/* Catalog and Series Numbers Below Card */}
          <div className="absolute top-full mt-2 left-0 right-0 flex justify-between text-xs font-mono text-white/90">
            <span>{crdData.catalogNumber}</span>
            <span>{crdData.seriesNumber}</span>
          </div>
        </>
      ) : (
        // Standard Frame Layout
        <div 
          className="absolute inset-0 rounded-lg border-4 shadow-lg"
          style={{
            borderColor: colorTheme.primary,
            background: `linear-gradient(145deg, ${colorTheme.primary}20, ${colorTheme.secondary}10)`
          }}
        >
          {/* Main Image Region */}
          <div className="absolute inset-2 rounded-md overflow-hidden bg-crd-darkest">
            {content.mainImage ? (
              <img 
                src={content.mainImage} 
                alt="Card main image"
                className={`w-full h-full object-cover ${rarityGlow[crdData.rarity]}`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkest flex items-center justify-center">
                <span className="text-crd-lightGray text-sm">Add Image</span>
              </div>
            )}
          </div>

        {/* CRD Elements */}
        
        {/* Top Header - CRD Catalog # and Series # */}
        <div 
          className="absolute top-1 left-1 right-1 h-6 rounded-sm flex items-center justify-between px-2 text-xs font-bold"
          style={{ backgroundColor: `${colorTheme.primary}E6` }}
        >
          <span className="text-white">{crdData.catalogNumber}</span>
          <span className="text-white">{crdData.seriesNumber}</span>
        </div>

        {/* Top Right - Available Copies */}
        <div 
          className="absolute top-8 right-1 px-2 py-1 rounded-sm text-xs font-bold text-white"
          style={{ backgroundColor: `${colorTheme.accent}E6` }}
        >
          {crdData.available}
        </div>

        {/* Bottom Banner - CRD Name */}
        <div 
          className="absolute bottom-1 left-1 right-1 h-8 rounded-sm flex items-center justify-center px-2"
          style={{ 
            background: `linear-gradient(90deg, ${colorTheme.primary}E6, ${colorTheme.secondary}E6)`
          }}
        >
          <span className="text-white font-bold text-sm truncate">{crdData.crdName}</span>
        </div>

        {/* Creator Badge - Bottom Left */}
        <div 
          className="absolute bottom-10 left-1 px-2 py-1 rounded-sm text-xs text-white"
          style={{ backgroundColor: `${colorTheme.neutral}80` }}
        >
          by {crdData.creator}
        </div>

        {/* Logo Placeholder - Top Left Corner */}
        {crdData.logo && (
          <div className="absolute top-8 left-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white">
            <img src={crdData.logo} alt="Creator logo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Rarity Indicator - Glowing corner */}
        <div 
          className="absolute top-0 right-0 w-6 h-6 rounded-bl-lg"
          style={{ 
            backgroundColor: colorTheme.accent,
            boxShadow: `0 0 12px ${colorTheme.accent}80`
          }}
        />

        {/* Effects/Animation Indicators */}
        {content.effects && content.effects.length > 0 && (
          <div className="absolute bottom-10 right-1 flex space-x-1">
            {content.effects.slice(0, 3).map((effect: string, index: number) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colorTheme.accent }}
                title={effect}
              />
            ))}
          </div>
        )}

        {/* Glow Effect for Higher Rarities */}
        {(crdData.rarity === 'legendary' || crdData.rarity === 'mythic') && (
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(45deg, transparent 30%, ${colorTheme.accent}20 50%, transparent 70%)`,
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />
        )}
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};