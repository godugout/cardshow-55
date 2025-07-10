import React, { useState } from 'react';
import { MoreHorizontal, Grid3x3, Ruler, Move, Edit3, Settings } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDMoreMenuProps {
  showGrid: boolean;
  onGridToggle: () => void;
  gridType: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';
  onGridTypeChange: (type: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography') => void;
  showRulers: boolean;
  onRulersToggle: () => void;
  isPanning: boolean;
  onPanToggle: () => void;
}

export const CRDMoreMenu: React.FC<CRDMoreMenuProps> = ({
  showGrid,
  onGridToggle,
  gridType,
  onGridTypeChange,
  showRulers,
  onRulersToggle,
  isPanning,
  onPanToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <CRDButton 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
        title="More tools"
      >
        <MoreHorizontal className="w-4 h-4" />
      </CRDButton>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-10 z-20 w-48 bg-crd-darker border border-crd-mediumGray/30 rounded-lg shadow-xl py-2">
            {/* Grid Controls */}
            <div className="px-3 py-2 border-b border-crd-mediumGray/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-crd-lightGray font-medium">Grid</span>
                <CRDButton 
                  variant={showGrid ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={onGridToggle}
                  className="h-6 w-6 p-0"
                >
                  <Grid3x3 className="w-3 h-3" />
                </CRDButton>
              </div>
              {showGrid && (
                <select 
                  value={gridType} 
                  onChange={e => onGridTypeChange(e.target.value as typeof gridType)}
                  className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-xs text-crd-white h-6"
                >
                  <option value="standard">Standard</option>
                  <option value="print">Print</option>
                  <option value="golden">Golden</option>
                  <option value="isometric">Isometric</option>
                  <option value="blueprint">Blueprint</option>
                  <option value="photography">Photography</option>
                </select>
              )}
            </div>

            {/* Rulers */}
            <div className="px-3 py-2 border-b border-crd-mediumGray/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-crd-lightGray font-medium">Rulers</span>
                <CRDButton 
                  variant={showRulers ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={onRulersToggle}
                  className="h-6 w-6 p-0"
                >
                  <Ruler className="w-3 h-3" />
                </CRDButton>
              </div>
            </div>

            {/* Interaction Mode */}
            <div className="px-3 py-2">
              <span className="text-xs text-crd-lightGray font-medium mb-2 block">Mode</span>
              <div className="flex bg-crd-mediumGray/10 rounded p-0.5">
                <CRDButton 
                  variant={!isPanning ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={() => isPanning && onPanToggle()}
                  className="h-6 px-2 text-xs flex-1"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </CRDButton>
                <CRDButton 
                  variant={isPanning ? "primary" : "ghost"} 
                  size="sm" 
                  onClick={() => !isPanning && onPanToggle()}
                  className="h-6 px-2 text-xs flex-1"
                >
                  <Move className="w-3 h-3 mr-1" />
                  Pan
                </CRDButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};