import React, { useEffect } from 'react';
import { Eye, Printer, Edit3, Move } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

export type ViewMode = 'edit' | 'preview' | 'print';
export type InteractionMode = 'edit' | 'pan';

interface ModeSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  interactionMode: InteractionMode;
  onInteractionModeToggle: () => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  interactionMode,
  onInteractionModeToggle
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        onInteractionModeToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInteractionModeToggle]);

  return (
    <div className="flex items-center gap-3">
      {/* View Mode Switcher */}
      <div className="flex bg-crd-mediumGray/20 rounded-lg p-1">
        <button 
          onClick={() => onViewModeChange('edit')} 
          className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
            viewMode === 'edit' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'
          }`}
          title="Canvas Edit Mode"
        >
          <Eye className="w-4 h-4" />
          Canvas
        </button>
        <button 
          onClick={() => onViewModeChange('preview')} 
          className={`px-3 py-1 text-sm rounded transition-colors ${
            viewMode === 'preview' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'
          }`}
          title="Preview Mode"
        >
          Preview
        </button>
        <button 
          onClick={() => onViewModeChange('print')} 
          className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${
            viewMode === 'print' ? 'bg-crd-blue text-white' : 'text-crd-lightGray hover:text-crd-white'
          }`}
          title="Print Mode"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Interaction Mode Switcher - Only show in edit view mode */}
      {viewMode === 'edit' && (
        <>
          <div className="w-px h-6 bg-crd-mediumGray/30" />
          <div className="flex bg-crd-mediumGray/10 rounded-lg p-0.5">
            <CRDButton 
              variant={interactionMode === 'edit' ? "primary" : "ghost"} 
              size="sm" 
              onClick={() => interactionMode === 'pan' && onInteractionModeToggle()} 
              className="h-7 px-3 text-xs" 
              title="Edit Mode - Modify card elements (Space to toggle)"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </CRDButton>
            <CRDButton 
              variant={interactionMode === 'pan' ? "primary" : "ghost"} 
              size="sm" 
              onClick={() => interactionMode === 'edit' && onInteractionModeToggle()} 
              className="h-7 px-3 text-xs" 
              title="Pan Mode - Drag to move canvas view (Space to toggle)"
            >
              <Move className="w-3 h-3 mr-1" />
              Pan
            </CRDButton>
          </div>
        </>
      )}
    </div>
  );
};