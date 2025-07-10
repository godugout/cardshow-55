import React, { useState, useCallback, useEffect } from 'react';
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
  onImageUpload?: (files: File[]) => void;
  // New props for sidebar awareness
  leftSidebarCollapsed?: boolean;
  rightSidebarCollapsed?: boolean;
  isMobile?: boolean;
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
  onImageUpload,
  leftSidebarCollapsed = true,
  rightSidebarCollapsed = true,
  isMobile = false
}) => {
  // Canvas state - fixed optimal default zoom
  const [zoom, setZoom] = useState(125); // Single optimal default for engagement
  const [showGrid, setShowGrid] = useState(false);
  const [gridType, setGridType] = useState<'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography'>('standard');
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
    setZoom(125); // Reset to optimal default
  }, []);

  // Calculate card dimensions
  const cardAspectRatio = 2.5 / 3.5;
  const baseCardWidth = 420; // Increased from 320
  const baseCardHeight = baseCardWidth / cardAspectRatio;

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

  const getGridRulerColors = () => {
    switch (gridType) {
      case 'standard':
        return {
          background: 'rgb(30, 64, 175, 0.95)', // blue-800
          border: 'rgb(59, 130, 246, 0.6)', // blue-500
          tick: 'rgb(59, 130, 246, 0.6)', // blue-500
          text: 'rgb(147, 197, 253)', // blue-300
          label: 'STD'
        };
      case 'print':
        return {
          background: 'rgb(21, 128, 61, 0.95)', // green-800
          border: 'rgb(34, 197, 94, 0.6)', // green-500
          tick: 'rgb(34, 197, 94, 0.6)', // green-500
          text: 'rgb(134, 239, 172)', // green-300
          label: 'PRT'
        };
      case 'golden':
        return {
          background: 'rgb(180, 83, 9, 0.95)', // amber-800
          border: 'rgb(251, 191, 36, 0.6)', // amber-500
          tick: 'rgb(251, 191, 36, 0.6)', // amber-500
          text: 'rgb(252, 211, 77)', // amber-300
          label: 'GLD'
        };
      case 'isometric':
        return {
          background: 'rgb(88, 28, 135, 0.95)', // purple-800
          border: 'rgb(147, 51, 234, 0.6)', // purple-500
          tick: 'rgb(147, 51, 234, 0.6)', // purple-500
          text: 'rgb(196, 181, 253)', // purple-300
          label: 'ISO'
        };
      case 'blueprint':
        return {
          background: 'rgb(14, 116, 144, 0.95)', // cyan-800
          border: 'rgb(6, 182, 212, 0.6)', // cyan-500
          tick: 'rgb(6, 182, 212, 0.6)', // cyan-500
          text: 'rgb(103, 232, 249)', // cyan-300
          label: 'BLP'
        };
      case 'photography':
        return {
          background: 'rgb(157, 23, 77, 0.95)', // pink-800
          border: 'rgb(236, 72, 153, 0.6)', // pink-500
          tick: 'rgb(236, 72, 153, 0.6)', // pink-500
          text: 'rgb(244, 114, 182)', // pink-300
          label: 'PHO'
        };
      default:
        return {
          background: 'rgb(75, 85, 99, 0.95)',
          border: 'rgb(156, 163, 175, 0.6)',
          tick: 'rgb(156, 163, 175, 0.6)',
          text: 'rgb(209, 213, 219)',
          label: 'GEN'
        };
    }
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
    <div className="relative h-full w-full overflow-hidden bg-transparent flex flex-col">
      {/* Toolbar */}
      <CRDToolbar
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        
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
          {/* Enhanced Grid-Themed Rulers */}
          {showRulers && (() => {
            const rulerColors = getGridRulerColors();
            return (
              <>
                {/* Horizontal ruler */}
                <div 
                  className="absolute -top-8 left-0 w-full h-8 border-b-2 text-xs z-40"
                  style={{ 
                    backgroundColor: rulerColors.background,
                    borderBottomColor: rulerColors.border,
                    color: rulerColors.text
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Measurement ticks */}
                    {Array.from({ length: Math.ceil(cardWidth / 20) }, (_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-0 border-l"
                        style={{ 
                          left: `${i * 20}px`, 
                          height: i % 5 === 0 ? '16px' : '8px',
                          borderLeftColor: rulerColors.tick
                        }}
                      >
                        {i % 5 === 0 && (
                          <span 
                            className="absolute -top-4 -left-2 text-xs font-mono font-semibold"
                            style={{ color: rulerColors.text }}
                          >
                            {Math.round((i * 20 * 2.5) / cardWidth * 100) / 100}"
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Vertical ruler */}
                <div 
                  className="absolute -left-8 top-0 w-8 h-full border-r-2 text-xs z-40"
                  style={{ 
                    backgroundColor: rulerColors.background,
                    borderRightColor: rulerColors.border,
                    color: rulerColors.text
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Measurement ticks */}
                    {Array.from({ length: Math.ceil(cardHeight / 20) }, (_, i) => (
                      <div
                        key={i}
                        className="absolute right-0 border-t"
                        style={{ 
                          top: `${i * 20}px`, 
                          width: i % 5 === 0 ? '16px' : '8px',
                          borderTopColor: rulerColors.tick
                        }}
                      >
                        {i % 5 === 0 && (
                          <span 
                            className="absolute -right-6 -top-2 text-xs font-mono font-semibold transform -rotate-90 origin-center"
                            style={{ 
                              color: rulerColors.text,
                              transformOrigin: 'center', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {Math.round((i * 20 * 3.5) / cardHeight * 100) / 100}"
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Corner ruler intersection with grid type indicator */}
                <div 
                  className="absolute -top-8 -left-8 w-8 h-8 border-b-2 border-r-2 z-50 flex items-center justify-center"
                  style={{ 
                    backgroundColor: rulerColors.background,
                    borderBottomColor: rulerColors.border,
                    borderRightColor: rulerColors.border
                  }}
                >
                  <span 
                    className="text-xs font-mono font-bold"
                    style={{ color: rulerColors.text }}
                    title={`${gridType.charAt(0).toUpperCase() + gridType.slice(1)} Grid`}
                  >
                    {rulerColors.label}
                  </span>
                </div>
              </>
            );
          })()}

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
                <div className="flex-1 flex items-center justify-center mb-3 relative">
                  {playerImage ? (
                    <img
                      src={playerImage}
                      alt="Player"
                      className="max-w-full max-h-full object-contain rounded border-2 border-white/20"
                    />
                  ) : (
                    <div 
                      className="w-full h-full border-2 border-dashed border-white/40 rounded bg-transparent hover:border-white/60 hover:bg-white/5 transition-all duration-200 cursor-pointer relative z-20 flex items-center justify-center group"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement;
                          const files = Array.from(target.files || []);
                          if (files.length > 0 && onImageUpload) {
                            onImageUpload(files);
                          }
                        };
                        input.click();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-white/80', 'bg-white/10');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-white/80', 'bg-white/10');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-white/80', 'bg-white/10');
                        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                        if (files.length > 0 && onImageUpload) {
                          onImageUpload(files);
                        }
                      }}
                    >
                      <div className="text-center">
                        <div className="text-white/60 text-xs mb-1 group-hover:text-white/80 transition-colors">
                          Drop image or click
                        </div>
                        <div className="text-white/40 text-xs">
                          Player Image
                        </div>
                      </div>
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