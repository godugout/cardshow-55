
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import type { DesignProject, DesignLayer, DesignTool, ToolProperties } from '@/types/creator';

interface DesignCanvasProps {
  project: DesignProject;
  selectedLayers: string[];
  activeTool: DesignTool | null;
  toolProperties: ToolProperties;
  onLayerSelect: (layerIds: string[]) => void;
  onLayerUpdate: (layerId: string, updates: Partial<DesignLayer>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  project,
  selectedLayers,
  activeTool,
  toolProperties,
  onLayerSelect,
  onLayerUpdate,
  canvasRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || activeTool.category !== 'selection') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Find clicked layer
    const clickedLayer = project.layers
      .filter(layer => layer.visible)
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(layer => {
        const { position, size } = layer;
        return x >= position.x && x <= position.x + size.width &&
               y >= position.y && y <= position.y + size.height;
      });

    if (clickedLayer) {
      if (e.ctrlKey || e.metaKey) {
        // Add to selection
        onLayerSelect([...selectedLayers, clickedLayer.id]);
      } else {
        // Select single layer
        onLayerSelect([clickedLayer.id]);
      }
      
      setIsDragging(true);
      setDragStart({ x, y });
    } else {
      // Clear selection
      onLayerSelect([]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || selectedLayers.length === 0) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    selectedLayers.forEach(layerId => {
      const layer = project.layers.find(l => l.id === layerId);
      if (layer) {
        onLayerUpdate(layerId, {
          position: {
            x: layer.position.x + deltaX,
            y: layer.position.y + deltaY
          }
        });
      }
    });

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(prev => Math.max(0.1, Math.min(3, prev * delta)));
    }
  };

  const renderLayer = (layer: DesignLayer) => {
    const isSelected = selectedLayers.includes(layer.id);
    
    return (
      <div
        key={layer.id}
        className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: layer.position.x,
          top: layer.position.y,
          width: layer.size.width,
          height: layer.size.height,
          transform: `rotate(${layer.rotation}deg)`,
          opacity: layer.opacity,
          zIndex: layer.zIndex,
          display: layer.visible ? 'block' : 'none'
        }}
      >
        {layer.type === 'text' && (
          <div
            style={{
              fontFamily: layer.properties.fontFamily,
              fontSize: layer.properties.fontSize,
              fontWeight: layer.properties.fontWeight,
              color: layer.properties.color,
              textAlign: layer.properties.textAlign as any,
              lineHeight: layer.properties.lineHeight,
              letterSpacing: layer.properties.letterSpacing,
              width: '100%',
              height: '100%'
            }}
          >
            {layer.properties.text}
          </div>
        )}
        
        {layer.type === 'image' && layer.properties.src && (
          <img
            src={layer.properties.src}
            alt={layer.name}
            className="w-full h-full object-cover"
            style={{
              filter: layer.properties.filters?.map(f => 
                `${f.type.replace('-', '')}(${f.value}${f.type.includes('hue') ? 'deg' : f.type.includes('blur') ? 'px' : '%'})`
              ).join(' ')
            }}
          />
        )}
        
        {layer.type === 'shape' && (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: layer.properties.fill,
              border: layer.properties.stroke ? `${layer.properties.strokeWidth}px solid ${layer.properties.stroke}` : 'none',
              borderRadius: layer.properties.shapeType === 'circle' ? '50%' : layer.properties.borderRadius
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-xl">
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-crosshair"
        style={{
          width: project.canvas.width * scale,
          height: project.canvas.height * scale,
          minWidth: 400,
          minHeight: 560
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Canvas Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: project.canvas.backgroundColor,
            backgroundImage: project.canvas.backgroundImage ? `url(${project.canvas.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            width: project.canvas.width,
            height: project.canvas.height
          }}
        >
          {/* Render Layers */}
          {project.layers
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(renderLayer)}
        </div>

        {/* Hidden canvas for export */}
        <canvas
          ref={canvasRef}
          className="hidden"
          width={project.canvas.width}
          height={project.canvas.height}
        />
      </div>

      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 bg-black/75 text-white px-3 py-1 rounded text-sm">
        {Math.round(scale * 100)}%
      </div>
    </Card>
  );
};
