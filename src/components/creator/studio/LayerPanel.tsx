
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import type { DesignLayer } from '@/types/creator';

interface LayerPanelProps {
  layers: DesignLayer[];
  selectedLayers: string[];
  onLayerSelect: (layerIds: string[]) => void;
  onLayerUpdate: (layerId: string, updates: Partial<DesignLayer>) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerDuplicate: (layerId: string) => void;
  onLayersReorder: (layerIds: string[]) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayers,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  onLayerDuplicate,
  onLayersReorder
}) => {
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const handleLayerClick = (layerId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Add/remove from selection
      if (selectedLayers.includes(layerId)) {
        onLayerSelect(selectedLayers.filter(id => id !== layerId));
      } else {
        onLayerSelect([...selectedLayers, layerId]);
      }
    } else {
      // Select single layer
      onLayerSelect([layerId]);
    }
  };

  const handleToggleVisibility = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onLayerUpdate(layerId, { visible: !layer.visible });
    }
  };

  const handleToggleLock = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      onLayerUpdate(layerId, { locked: !layer.locked });
    }
  };

  const handleOpacityChange = (layerId: string, opacity: number[]) => {
    onLayerUpdate(layerId, { opacity: opacity[0] / 100 });
  };

  const handleNameChange = (layerId: string, name: string) => {
    onLayerUpdate(layerId, { name });
  };

  const getLayerIcon = (type: DesignLayer['type']) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'shape': return '🔷';
      case 'effect': return '✨';
      case 'background': return '🎨';
      default: return '📄';
    }
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Layers</h3>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-gray-700"
        >
          Add Layer
        </Button>
      </div>

      <div className="space-y-1">
        {sortedLayers.map((layer) => {
          const isSelected = selectedLayers.includes(layer.id);
          
          return (
            <div
              key={layer.id}
              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-600 border-blue-500' 
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
              onClick={(e) => handleLayerClick(layer.id, e)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm">{getLayerIcon(layer.type)}</span>
                  <Input
                    value={layer.name}
                    onChange={(e) => handleNameChange(layer.id, e.target.value)}
                    className="text-sm bg-transparent border-none p-0 h-auto text-white"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-6 h-6 p-0 text-white hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(layer.id);
                    }}
                  >
                    {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-6 h-6 p-0 text-white hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLock(layer.id);
                    }}
                  >
                    {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="text-xs text-gray-300 mb-1 block">Opacity</label>
                    <Slider
                      value={[layer.opacity * 100]}
                      onValueChange={(value) => handleOpacityChange(layer.id, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-gray-600 flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDuplicate(layer.id);
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Duplicate
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-600 hover:text-white flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDelete(layer.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {layers.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">No layers yet</p>
          <p className="text-xs mt-1">Add text, images, or shapes to get started</p>
        </div>
      )}
    </div>
  );
};
