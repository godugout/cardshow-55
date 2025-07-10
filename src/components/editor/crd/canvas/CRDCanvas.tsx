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
  const [panOffset, setPanOffset] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });

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
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    });
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
  const cardWidth = baseCardWidth * zoom / 100;
  const cardHeight = baseCardHeight * zoom / 100;
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
    return {
      backgroundColor: baseColor
    };
  };
  const getGridRulerColors = () => {
    switch (gridType) {
      case 'standard':
        return {
          background: 'rgb(30, 64, 175, 0.95)',
          // blue-800
          border: 'rgb(59, 130, 246, 0.6)',
          // blue-500
          tick: 'rgb(59, 130, 246, 0.6)',
          // blue-500
          text: 'rgb(147, 197, 253)',
          // blue-300
          label: 'STD'
        };
      case 'print':
        return {
          background: 'rgb(21, 128, 61, 0.95)',
          // green-800
          border: 'rgb(34, 197, 94, 0.6)',
          // green-500
          tick: 'rgb(34, 197, 94, 0.6)',
          // green-500
          text: 'rgb(134, 239, 172)',
          // green-300
          label: 'PRT'
        };
      case 'golden':
        return {
          background: 'rgb(180, 83, 9, 0.95)',
          // amber-800
          border: 'rgb(251, 191, 36, 0.6)',
          // amber-500
          tick: 'rgb(251, 191, 36, 0.6)',
          // amber-500
          text: 'rgb(252, 211, 77)',
          // amber-300
          label: 'GLD'
        };
      case 'isometric':
        return {
          background: 'rgb(88, 28, 135, 0.95)',
          // purple-800
          border: 'rgb(147, 51, 234, 0.6)',
          // purple-500
          tick: 'rgb(147, 51, 234, 0.6)',
          // purple-500
          text: 'rgb(196, 181, 253)',
          // purple-300
          label: 'ISO'
        };
      case 'blueprint':
        return {
          background: 'rgb(14, 116, 144, 0.95)',
          // cyan-800
          border: 'rgb(6, 182, 212, 0.6)',
          // cyan-500
          tick: 'rgb(6, 182, 212, 0.6)',
          // cyan-500
          text: 'rgb(103, 232, 249)',
          // cyan-300
          label: 'BLP'
        };
      case 'photography':
        return {
          background: 'rgb(157, 23, 77, 0.95)',
          // pink-800
          border: 'rgb(236, 72, 153, 0.6)',
          // pink-500
          tick: 'rgb(236, 72, 153, 0.6)',
          // pink-500
          text: 'rgb(244, 114, 182)',
          // pink-300
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
  return <div className="relative h-full w-full overflow-hidden bg-transparent flex flex-col">
      {/* Toolbar */}
      <CRDToolbar zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onZoomReset={handleZoomReset} showGrid={showGrid} onGridToggle={() => setShowGrid(!showGrid)} gridType={gridType} onGridTypeChange={setGridType} showRulers={showRulers} onRulersToggle={() => setShowRulers(!showRulers)} isPanning={isPanning} onPanToggle={() => setIsPanning(!isPanning)} />

      {/* Grid Background */}
      <CRDCanvasGrid showGrid={showGrid} gridType={gridType} gridSize={20} />

      {/* Canvas Area */}
      <div className={`flex-1 w-full flex items-center justify-center relative z-10 pt-16 overflow-hidden ${isPanning ? 'cursor-grab' : 'cursor-default'} ${isDragging ? 'cursor-grabbing' : ''}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        
        {/* Card Dropzone */}
        <div 
          className="relative z-20 transition-transform duration-300 ease-out"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          {playerImage ? (
            // Show uploaded image
            <div className="w-full h-full rounded-lg overflow-hidden bg-white shadow-2xl">
              <img
                src={playerImage}
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            // Show clean card placeholder
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-2xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Card header */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <h3 className="text-white text-sm font-bold tracking-wide">CLASSIC BASEBALL CARD</h3>
              </div>
              
              {/* Main content area */}
              <div className="flex flex-col items-center justify-center text-center mt-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-gray-800 text-lg font-semibold mb-1">Player Name</h4>
                <p className="text-gray-600 text-sm mb-2">Position • Team</p>
                <p className="text-gray-500 text-xs">Season 2024</p>
              </div>
              
              {/* Stats area placeholder */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 rounded p-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-gray-400">AVG</div>
                    <div className="text-gray-600 font-semibold">---</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">HR</div>
                    <div className="text-gray-600 font-semibold">--</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">RBI</div>
                    <div className="text-gray-600 font-semibold">--</div>
                  </div>
                </div>
              </div>
              
              {/* Card dimensions indicator */}
              <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white/70 px-1 py-0.5 rounded text-[10px]">
                400×560px
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;
};