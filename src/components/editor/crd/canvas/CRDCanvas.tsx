import React, { useState, useCallback } from 'react';
import { CRDCanvasGrid } from './CRDCanvasGrid';
import { CRDToolbar } from '../toolbar/CRDToolbar';

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
  previewMode
}) => {
  // Canvas state
  const [zoom, setZoom] = useState(150);
  const [showGrid, setShowGrid] = useState(false);
  const [gridType, setGridType] = useState<'standard' | 'print' | 'golden'>('standard');
  const [showRulers, setShowRulers] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  // Canvas controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  const handleZoomFit = useCallback(() => {
    setZoom(85);
  }, []);
  // Calculate card dimensions
  const cardAspectRatio = 2.5 / 3.5;
  const baseCardWidth = 420; // Increased from 320
  const baseCardHeight = baseCardWidth / cardAspectRatio;
  const cardWidth = (baseCardWidth * zoom) / 100;
  const cardHeight = (baseCardHeight * zoom) / 100;

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

  return (
    <div className="relative h-full w-full overflow-hidden bg-crd-darkest flex flex-col">
      {/* Toolbar */}
      <CRDToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onZoomFit={handleZoomFit}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
        gridType={gridType}
        onGridTypeChange={setGridType}
        showRulers={showRulers}
        onRulersToggle={() => setShowRulers(!showRulers)}
        isPanning={isPanning}
        onPanToggle={() => setIsPanning(!isPanning)}
      />

      {/* Grid Background */}
      <CRDCanvasGrid
        showGrid={showGrid}
        gridType={gridType}
        gridSize={20}
      />

      {/* Canvas Area */}
      <div className="flex-1 w-full flex items-start justify-center relative z-10 pt-16">
        <div className="relative">
          {/* Rulers */}
          {showRulers && (
            <>
              {/* Horizontal ruler */}
              <div className="absolute -top-6 left-0 w-full h-6 bg-crd-darker/90 border-b border-crd-mediumGray/20 text-xs text-crd-lightGray flex items-end">
                <div className="w-full h-4 bg-gradient-to-r from-crd-mediumGray/10 to-crd-mediumGray/20" />
              </div>
              {/* Vertical ruler */}
              <div className="absolute -left-6 top-0 w-6 h-full bg-crd-darker/90 border-r border-crd-mediumGray/20 text-xs text-crd-lightGray flex justify-end">
                <div className="w-4 h-full bg-gradient-to-b from-crd-mediumGray/10 to-crd-mediumGray/20" />
              </div>
            </>
          )}

          {/* Floating Card Preview */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
            style={{ 
              width: cardWidth, 
              height: cardHeight,
              transform: `perspective(1000px) rotateX(${isPanning ? '0deg' : '1deg'}) rotateY(${isPanning ? '0deg' : '1deg'})`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Print Guidelines */}
            {previewMode === 'print' && (
              <>
                {/* Bleed area */}
                <div className="absolute inset-0 border-2 border-red-500/50 pointer-events-none z-30" />
                {/* Safe area */}
                <div className="absolute inset-4 border border-green-500/50 pointer-events-none z-30" />
                {/* Center guides */}
                <div className="absolute top-0 left-1/2 w-px h-full bg-blue-500/30 pointer-events-none z-30" />
                <div className="absolute left-0 top-1/2 w-full h-px bg-blue-500/30 pointer-events-none z-30" />
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
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-crd-darker/90 backdrop-blur-sm border border-crd-mediumGray/20 rounded-lg px-3 py-2">
              <div className="text-crd-lightGray text-xs">
                2.5" × 3.5" • 300 DPI • {Math.round(zoom)}% • Print Ready
              </div>
              <div className="text-crd-lightGray/70 text-xs mt-1">
                {previewMode === 'edit' && 'Edit Mode - Make changes to see live preview'}
                {previewMode === 'preview' && 'Preview Mode - See how your card will look'}
                {previewMode === 'print' && 'Print Mode - View with print guidelines'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};