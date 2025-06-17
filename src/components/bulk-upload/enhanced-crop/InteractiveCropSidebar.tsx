
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Lock, 
  Unlock, 
  Undo, 
  Redo, 
  ArrowLeft,
  ArrowRight,
  Check,
  Grid3X3
} from 'lucide-react';

interface InteractiveCropSidebarProps {
  currentCardIndex: number;
  totalCards: number;
  currentCard: any;
  zoom: number;
  showGrid: boolean;
  aspectRatioLocked: boolean;
  aspectRatio: 'card' | 'square';
  canUndo: boolean;
  canRedo: boolean;
  cropArea: any;
  onZoomChange: (zoom: number) => void;
  onToggleGrid: () => void;
  onToggleAspectRatio: () => void;
  onSetAspectRatio: (ratio: 'card' | 'square') => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onApplyCrop: () => void;
  onBack: () => void;
}

export const InteractiveCropSidebar: React.FC<InteractiveCropSidebarProps> = ({
  currentCardIndex,
  totalCards,
  currentCard,
  zoom,
  showGrid,
  aspectRatioLocked,
  aspectRatio,
  canUndo,
  canRedo,
  cropArea,
  onZoomChange,
  onToggleGrid,
  onToggleAspectRatio,
  onSetAspectRatio,
  onUndo,
  onRedo,
  onPrevious,
  onNext,
  onApplyCrop,
  onBack
}) => {
  return (
    <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 p-6 space-y-8 overflow-y-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Crop Controls</h3>
          <Badge className="bg-crd-green text-black font-medium">
            {currentCardIndex + 1}/{totalCards}
          </Badge>
        </div>
        <p className="text-crd-lightGray text-sm">{currentCard?.title}</p>
      </div>

      {/* Interactive Zoom Control */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Zoom Control</h4>
        <div className="bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30">
          <div className="flex items-center justify-between mb-3">
            <Button
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
              className="bg-crd-blue hover:bg-crd-blue/80 text-white border-0"
              size="sm"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 mx-4 relative">
              <div className="bg-crd-mediumGray h-2 rounded-full">
                <div 
                  className="bg-gradient-to-r from-crd-blue to-crd-green h-2 rounded-full transition-all"
                  style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
                />
                <div 
                  className="absolute w-4 h-4 bg-white border-2 border-crd-green rounded-full -top-1 transform -translate-x-1/2 cursor-pointer shadow-lg"
                  style={{ left: `${((zoom - 0.5) / 2.5) * 100}%` }}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-crd-green font-semibold">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
            
            <Button
              onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
              disabled={zoom >= 3}
              className="bg-crd-blue hover:bg-crd-blue/80 text-white border-0"
              size="sm"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => onZoomChange(1)}
            variant="outline"
            size="sm"
            className="w-full text-crd-lightGray border-crd-mediumGray hover:bg-crd-mediumGray/20"
          >
            Reset to 100%
          </Button>
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Aspect Ratio</h4>
        <div className="bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSetAspectRatio('card')}
              className={`p-3 rounded-lg border-2 transition-all ${
                aspectRatio === 'card' 
                  ? 'border-crd-green bg-crd-green/20' 
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}
            >
              <div className="bg-crd-mediumGray rounded mb-2 mx-auto" style={{ width: 30, height: 42 }} />
              <div className="text-xs text-center text-white">Card</div>
              <div className="text-xs text-center text-crd-lightGray">2.5:3.5</div>
            </button>
            
            <button
              onClick={() => onSetAspectRatio('square')}
              className={`p-3 rounded-lg border-2 transition-all ${
                aspectRatio === 'square' 
                  ? 'border-crd-green bg-crd-green/20' 
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}
            >
              <div className="bg-crd-mediumGray rounded mb-2 mx-auto" style={{ width: 30, height: 30 }} />
              <div className="text-xs text-center text-white">Square</div>
              <div className="text-xs text-center text-crd-lightGray">1:1</div>
            </button>
          </div>
          
          <button
            onClick={onToggleAspectRatio}
            className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              aspectRatioLocked 
                ? 'border-crd-green bg-crd-green/20 text-crd-green' 
                : 'border-crd-mediumGray text-crd-lightGray hover:border-crd-green/50'
            }`}
          >
            {aspectRatioLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            {aspectRatioLocked ? 'Ratio Locked' : 'Ratio Unlocked'}
          </button>
        </div>
      </div>

      {/* Grid Toggle */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Grid Overlay</h4>
        <button
          onClick={onToggleGrid}
          className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-3 ${
            showGrid 
              ? 'border-crd-blue bg-crd-blue/20 text-crd-blue' 
              : 'border-crd-mediumGray text-crd-lightGray hover:border-crd-blue/50'
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="font-medium">{showGrid ? 'Hide Grid' : 'Show Grid'}</span>
        </button>
      </div>

      {/* History Controls */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">History</h4>
        <div className="flex gap-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex-1 ${canUndo ? 'bg-crd-blue hover:bg-crd-blue/80' : 'bg-crd-mediumGray'} text-white border-0`}
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex-1 ${canRedo ? 'bg-crd-blue hover:bg-crd-blue/80' : 'bg-crd-mediumGray'} text-white border-0`}
          >
            <Redo className="w-4 h-4 mr-2" />
            Redo
          </Button>
        </div>
      </div>

      {/* Crop Info */}
      <div className="space-y-4">
        <h4 className="text-white font-medium">Crop Details</h4>
        <div className="bg-crd-darkGray rounded-lg p-4 border border-crd-mediumGray/30 space-y-2 text-sm">
          <div className="flex justify-between text-crd-lightGray">
            <span>Position:</span>
            <span>{Math.round(cropArea.x)}, {Math.round(cropArea.y)}</span>
          </div>
          <div className="flex justify-between text-crd-lightGray">
            <span>Size:</span>
            <span>{Math.round(cropArea.width)} × {Math.round(cropArea.height)}</span>
          </div>
          <div className="flex justify-between text-crd-lightGray">
            <span>Rotation:</span>
            <span>{cropArea.rotation}°</span>
          </div>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="space-y-4 pt-4 border-t border-crd-mediumGray/30">
        <div className="flex gap-2">
          <Button
            onClick={onPrevious}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="flex-1 text-white border-crd-mediumGray hover:bg-crd-mediumGray/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={currentCardIndex >= totalCards - 1}
            variant="outline"
            className="flex-1 text-white border-crd-mediumGray hover:bg-crd-mediumGray/20"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <Button
          onClick={onApplyCrop}
          className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold py-3"
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Crop & Continue
        </Button>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full text-crd-lightGray border-crd-mediumGray hover:bg-crd-mediumGray/20"
        >
          Back to Selection
        </Button>
      </div>
    </div>
  );
};
