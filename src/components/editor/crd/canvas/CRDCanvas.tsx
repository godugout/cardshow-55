import React from 'react';
import { Ruler, Grid, Eye } from 'lucide-react';
import { DustyAssistant } from '../assistant/DustyAssistant';

interface CRDCanvasProps {
  template: string;
  colorPalette: string;
  typography: string;
  effects: string[];
  cardTitle: string;
  cardDescription: string;
  playerImage: string | null;
  playerStats: Record<string, string>;
  previewMode: 'edit' | 'preview' | 'print';
  showGuides: boolean;
  onShowGuidesToggle: () => void;
}

export const CRDCanvas: React.FC<CRDCanvasProps> = ({
  template,
  colorPalette,
  typography,
  effects,
  cardTitle,
  cardDescription,
  playerImage,
  playerStats,
  previewMode,
  showGuides,
  onShowGuidesToggle
}) => {
  // Calculate card aspect ratio (standard trading card: 2.5" × 3.5")
  const cardAspectRatio = 2.5 / 3.5;
  const canvasWidth = 320;
  const canvasHeight = canvasWidth / cardAspectRatio;

  const getBackgroundStyle = () => {
    const paletteColors = {
      classic: '#1E40AF',
      sports: '#DC2626', 
      premium: '#D97706',
      modern: '#7C3AED',
      nature: '#059669'
    };
    
    const baseColor = paletteColors[colorPalette as keyof typeof paletteColors] || '#1E40AF';
    
    if (effects.includes('gradient')) {
      return {
        background: `linear-gradient(135deg, ${baseColor}, ${baseColor}80)`
      };
    }
    
    return { backgroundColor: baseColor };
  };

  const getEffectsOverlay = () => {
    const overlayEffects = [];
    
    if (effects.includes('foil')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-60');
    }
    
    if (effects.includes('holographic')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-45 before:from-purple-500/30 before:via-blue-500/30 before:to-green-500/30');
    }
    
    if (effects.includes('chrome')) {
      overlayEffects.push('before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-300/40 before:via-white/60 before:to-gray-300/40');
    }
    
    return overlayEffects.join(' ');
  };

  // Calculate layout heights
  const headerHeight = 64; // Approximate header height
  const availableHeight = typeof window !== 'undefined' ? window.innerHeight - headerHeight : 800;
  const cardAreaHeight = Math.floor(availableHeight * 0.6); // 60% for card area
  const dustyAreaHeight = Math.floor(availableHeight * 0.4); // 40% for Dusty

  return (
    <div className="flex flex-col relative h-full">
      {/* Upper Canvas Area - Fixed Height */}
      <div 
        className="flex flex-col items-center justify-center relative"
        style={{ height: cardAreaHeight }}
      >
        {/* Canvas Controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            onClick={onShowGuidesToggle}
            className={`p-2 rounded-lg border transition-colors ${
              showGuides 
                ? 'border-crd-blue bg-crd-blue/20 text-crd-blue' 
                : 'border-crd-mediumGray/20 bg-crd-darker/80 text-crd-lightGray hover:text-crd-white'
            }`}
            title="Toggle guides"
          >
            <Grid className="w-4 h-4" />
          </button>
          <div className="p-2 rounded-lg border border-crd-mediumGray/20 bg-crd-darker/80 text-crd-lightGray">
            <Eye className="w-4 h-4" />
          </div>
        </div>

        {/* Canvas Area - Perfectly Centered */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div 
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ 
              width: canvasWidth, 
              height: canvasHeight,
              transform: previewMode === 'print' ? 'scale(0.7)' : 'scale(0.85)'
            }}
          >
            {/* Print Guidelines */}
            {(showGuides || previewMode === 'print') && (
              <>
                {/* Bleed area */}
                <div className="absolute inset-0 border-2 border-red-500/50 pointer-events-none" />
                {/* Safe area */}
                <div className="absolute inset-4 border border-green-500/50 pointer-events-none" />
                {/* Center guides */}
                <div className="absolute top-0 left-1/2 w-px h-full bg-blue-500/30 pointer-events-none" />
                <div className="absolute left-0 top-1/2 w-full h-px bg-blue-500/30 pointer-events-none" />
              </>
            )}

            {/* Card Content */}
            <div 
              className={`w-full h-full relative overflow-hidden ${getEffectsOverlay()}`}
              style={getBackgroundStyle()}
            >
              {/* Background Pattern/Texture */}
              {effects.includes('texture') && (
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                </div>
              )}

              {/* Main Content Area */}
              <div className="relative z-10 p-4 h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-3">
                  <h1 className={`text-white font-bold text-lg leading-tight ${
                    typography === 'classic' ? 'font-serif' :
                    typography === 'sport' ? 'font-black tracking-wide' :
                    typography === 'elegant' ? 'font-light italic' :
                    'font-sans'
                  }`}>
                    {cardTitle || 'Player Name'}
                  </h1>
                  <div className="text-white/80 text-xs mt-1">
                    {playerStats.Team || 'Team Name'} • #{playerStats.Number || '00'}
                  </div>
                </div>

                {/* Player Image Area */}
                <div className="flex-1 flex items-center justify-center mb-3">
                  {playerImage ? (
                    <img
                      src={playerImage}
                      alt="Player"
                      className="max-w-full max-h-full object-contain rounded border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-32 h-40 border-2 border-dashed border-white/40 rounded flex items-center justify-center">
                      <span className="text-white/60 text-xs text-center">
                        Player<br />Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats Section */}
                <div className="bg-black/30 rounded p-2 text-white text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(playerStats).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="opacity-80">{key}:</span>
                        <span className="font-medium">{value || '--'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-2">
                  <div className="text-white/70 text-xs">
                    {playerStats.Season || '2024'} • CRDMKR
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Info */}
          <div className="text-center">
            <div className="text-crd-lightGray text-xs">
              2.5" × 3.5" • 300 DPI • Print Ready
            </div>
            <div className="text-crd-lightGray/70 text-xs mt-1">
              {previewMode === 'edit' && 'Edit Mode - Make changes to see live preview'}
              {previewMode === 'preview' && 'Preview Mode - See how your card will look'}
              {previewMode === 'print' && 'Print Mode - View with print guidelines'}
            </div>
          </div>
        </div>
      </div>

      {/* Dusty AI Assistant Area - Fixed Height */}
      <div 
        className="border-t border-crd-mediumGray/20 overflow-hidden"
        style={{ height: dustyAreaHeight }}
      >
        <DustyAssistant 
          cardTitle={cardTitle}
          playerImage={playerImage}
          selectedTemplate={template}
          colorPalette={colorPalette}
          effects={effects}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
};