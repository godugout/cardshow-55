
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CropArea } from './types';
import { Eye, EyeOff, Trash2, Image, Square, Layers } from 'lucide-react';

interface LayerSidebarProps {
  cropAreas: CropArea[];
  imageLoaded: boolean;
  selectedCropIds: string[];
  onSelectCrop: (cropId: string, multiSelect?: boolean) => void;
  onRemoveCrop: (cropId: string) => void;
  onToggleVisibility: (cropId: string) => void;
}

export const LayerSidebar: React.FC<LayerSidebarProps> = ({
  cropAreas,
  imageLoaded,
  selectedCropIds,
  onSelectCrop,
  onRemoveCrop,
  onToggleVisibility
}) => {
  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'main': return <Image className="w-4 h-4" />;
      case 'frame': return <Square className="w-4 h-4" />;
      case 'element': return <Layers className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const getLayerTypeLabel = (type: string) => {
    switch (type) {
      case 'main': return 'Main Card Image';
      case 'frame': return 'Frame';
      case 'element': return 'Element';
      default: return 'Layer';
    }
  };

  const isSelected = (cropId: string) => selectedCropIds.includes(cropId);

  return (
    <div className="w-80 bg-crd-darker border-l border-crd-mediumGray/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-crd-mediumGray/30">
        <h3 className="text-white font-semibold text-lg mb-1">Layers</h3>
        <p className="text-crd-lightGray text-sm">
          {cropAreas.length} layer{cropAreas.length !== 1 ? 's' : ''} • Click to select
        </p>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {cropAreas.map((crop, index) => (
            <Card
              key={crop.id}
              className={`p-3 cursor-pointer transition-all border-2 hover:shadow-md ${
                isSelected(crop.id) 
                  ? 'border-crd-green bg-crd-green/10 shadow-lg' 
                  : 'border-crd-mediumGray bg-crd-darkGray hover:border-crd-lightGray hover:bg-crd-mediumGray/20'
              }`}
              onClick={(e) => onSelectCrop(crop.id, e.ctrlKey || e.metaKey)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Layer Color and Icon */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border border-white/20 flex items-center justify-center"
                      style={{ backgroundColor: crop.color }}
                    >
                      {React.cloneElement(getLayerIcon(crop.type), {
                        className: "w-2.5 h-2.5 text-white",
                        style: { filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }
                      })}
                    </div>
                    
                    {/* Layer Index */}
                    <span className="text-crd-lightGray text-xs font-mono w-4 text-center">
                      {cropAreas.length - index}
                    </span>
                  </div>
                  
                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {crop.label}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-crd-lightGray">
                      <span>{getLayerTypeLabel(crop.type)}</span>
                      <span>•</span>
                      <span>{Math.round(crop.width)}×{Math.round(crop.height)}</span>
                      {crop.rotation !== 0 && (
                        <>
                          <span>•</span>
                          <span>{crop.rotation}°</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Layer Controls */}
                <div className="flex items-center gap-1 ml-2">
                  {/* Visibility Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(crop.id);
                    }}
                    className={`p-1 h-auto ${
                      crop.visible !== false 
                        ? 'text-crd-green hover:text-crd-green/80' 
                        : 'text-crd-lightGray hover:text-white'
                    }`}
                    title={crop.visible !== false ? 'Hide layer' : 'Show layer'}
                  >
                    {crop.visible !== false ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Delete Button */}
                  {crop.id !== 'main' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCrop(crop.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 h-auto"
                      title="Delete layer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Selection Indicator */}
              {isSelected(crop.id) && (
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                  style={{ backgroundColor: crop.color }}
                />
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Layer Tips */}
      <div className="p-4 border-t border-crd-mediumGray/30">
        <div className="bg-crd-darkGray/50 rounded-lg p-3">
          <h4 className="text-white font-medium text-sm mb-2">Layer Tips</h4>
          <ul className="text-crd-lightGray text-xs space-y-1">
            <li>• Click to select a layer</li>
            <li>• Use eye icon to show/hide</li>
            <li>• Drag corners to resize</li>
            <li>• Use rotation handle to rotate</li>
            <li>• Hold Ctrl for multi-select</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
