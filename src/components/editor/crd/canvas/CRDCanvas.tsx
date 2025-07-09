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
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
    setPanOffset({ x: 0, y: 0 }); // Reset pan when fitting
  }, []);

  // Panning handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }, [isPanning, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isPanning) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, isPanning, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(100);
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
        onResetView={handleResetView}
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
      <div 
        className={`flex-1 w-full flex items-center justify-center relative z-10 pt-16 overflow-hidden ${
          isPanning ? 'cursor-grab' : 'cursor-default'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`
          }}
        >
          {/* Enhanced Rulers */}
          {showRulers && (
            <>
              {/* Horizontal ruler */}
              <div className="absolute -top-8 left-0 w-full h-8 bg-gray-800/95 border-b-2 border-gray-600/60 text-xs text-gray-200 z-40">
                <div className="relative w-full h-full">
                  {/* Measurement ticks */}
                  {Array.from({ length: Math.ceil(cardWidth / 20) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 border-l border-gray-400/60"
                      style={{ left: `${i * 20}px`, height: i % 5 === 0 ? '16px' : '8px' }}
                    >
                      {i % 5 === 0 && (
                        <span className="absolute -top-4 -left-2 text-xs text-gray-300 font-mono">
                          {Math.round((i * 20 * 2.5) / cardWidth * 100) / 100}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Vertical ruler */}
              <div className="absolute -left-8 top-0 w-8 h-full bg-gray-800/95 border-r-2 border-gray-600/60 text-xs text-gray-200 z-40">
                <div className="relative w-full h-full">
                  {/* Measurement ticks */}
                  {Array.from({ length: Math.ceil(cardHeight / 20) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute right-0 border-t border-gray-400/60"
                      style={{ top: `${i * 20}px`, width: i % 5 === 0 ? '16px' : '8px' }}
                    >
                      {i % 5 === 0 && (
                        <span 
                          className="absolute -right-6 -top-2 text-xs text-gray-300 font-mono transform -rotate-90 origin-center"
                          style={{ transformOrigin: 'center', whiteSpace: 'nowrap' }}
                        >
                          {Math.round((i * 20 * 3.5) / cardHeight * 100) / 100}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Corner ruler intersection */}
              <div className="absolute -top-8 -left-8 w-8 h-8 bg-gray-900/95 border-b-2 border-r-2 border-gray-600/60 z-50 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-mono">IN</span>
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