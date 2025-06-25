
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import type { DesignLayer, ToolProperties } from '@/types/creator';

interface PropertiesPanelProps {
  layers: DesignLayer[];
  onLayerUpdate: (layerId: string, updates: Partial<DesignLayer>) => void;
  toolProperties: ToolProperties;
  onToolPropertiesChange: (properties: ToolProperties) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  layers,
  onLayerUpdate,
  toolProperties,
  onToolPropertiesChange
}) => {
  const selectedLayer = layers[0]; // Show properties for first selected layer

  if (!selectedLayer) {
    return (
      <div className="text-white">
        <h3 className="font-semibold mb-4">Properties</h3>
        <p className="text-gray-400 text-sm">Select a layer to edit properties</p>
      </div>
    );
  }

  const updateLayerProperty = (property: string, value: any) => {
    onLayerUpdate(selectedLayer.id, {
      properties: {
        ...selectedLayer.properties,
        [property]: value
      }
    });
  };

  const updateLayerTransform = (property: string, value: any) => {
    onLayerUpdate(selectedLayer.id, { [property]: value });
  };

  return (
    <div className="text-white space-y-6">
      <h3 className="font-semibold">Properties</h3>

      {/* Transform Properties */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Transform</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-400">X</Label>
            <Input
              type="number"
              value={selectedLayer.position.x}
              onChange={(e) => updateLayerTransform('position', {
                ...selectedLayer.position,
                x: Number(e.target.value)
              })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Y</Label>
            <Input
              type="number"
              value={selectedLayer.position.y}
              onChange={(e) => updateLayerTransform('position', {
                ...selectedLayer.position,
                y: Number(e.target.value)
              })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-400">Width</Label>
            <Input
              type="number"
              value={selectedLayer.size.width}
              onChange={(e) => updateLayerTransform('size', {
                ...selectedLayer.size,
                width: Number(e.target.value)
              })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Height</Label>
            <Input
              type="number"
              value={selectedLayer.size.height}
              onChange={(e) => updateLayerTransform('size', {
                ...selectedLayer.size,
                height: Number(e.target.value)
              })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-400">Rotation</Label>
          <Slider
            value={[selectedLayer.rotation]}
            onValueChange={(value) => updateLayerTransform('rotation', value[0])}
            min={-180}
            max={180}
            step={1}
            className="mt-1"
          />
          <span className="text-xs text-gray-400">{selectedLayer.rotation}°</span>
        </div>
      </div>

      {/* Type-specific Properties */}
      {selectedLayer.type === 'text' && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Text</h4>
          
          <div>
            <Label className="text-xs text-gray-400">Content</Label>
            <Input
              value={selectedLayer.properties.text || ''}
              onChange={(e) => updateLayerProperty('text', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Font Family</Label>
            <Select
              value={selectedLayer.properties.fontFamily || 'Arial'}
              onValueChange={(value) => updateLayerProperty('fontFamily', value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-400">Font Size</Label>
            <Input
              type="number"
              value={selectedLayer.properties.fontSize || 16}
              onChange={(e) => updateLayerProperty('fontSize', Number(e.target.value))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Color</Label>
            <ColorPicker
              color={selectedLayer.properties.color || '#000000'}
              onChange={(color) => updateLayerProperty('color', color)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Text Align</Label>
            <Select
              value={selectedLayer.properties.textAlign || 'left'}
              onValueChange={(value) => updateLayerProperty('textAlign', value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selectedLayer.type === 'shape' && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Shape</h4>
          
          <div>
            <Label className="text-xs text-gray-400">Fill Color</Label>
            <ColorPicker
              color={selectedLayer.properties.fill || '#3b82f6'}
              onChange={(color) => updateLayerProperty('fill', color)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Stroke Color</Label>
            <ColorPicker
              color={selectedLayer.properties.stroke || '#1e40af'}
              onChange={(color) => updateLayerProperty('stroke', color)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400">Stroke Width</Label>
            <Input
              type="number"
              value={selectedLayer.properties.strokeWidth || 2}
              onChange={(e) => updateLayerProperty('strokeWidth', Number(e.target.value))}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {selectedLayer.properties.shapeType === 'rectangle' && (
            <div>
              <Label className="text-xs text-gray-400">Border Radius</Label>
              <Input
                type="number"
                value={selectedLayer.properties.borderRadius || 0}
                onChange={(e) => updateLayerProperty('borderRadius', Number(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}
        </div>
      )}

      {/* Blend Mode */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Blend</h4>
        
        <div>
          <Label className="text-xs text-gray-400">Blend Mode</Label>
          <Select
            value={selectedLayer.blendMode}
            onValueChange={(value: any) => updateLayerTransform('blendMode', value)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="screen">Screen</SelectItem>
              <SelectItem value="overlay">Overlay</SelectItem>
              <SelectItem value="soft-light">Soft Light</SelectItem>
              <SelectItem value="hard-light">Hard Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
