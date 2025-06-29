
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, EyeOff, Lock, Unlock, Move, RotateCcw, Trash2, 
  Plus, Layers, Grid, ZoomIn, ZoomOut, Undo, Redo
} from 'lucide-react';
import type { DetectedRegion } from '@/types/crdmkr';

interface AdvancedRegionMapperProps {
  imageUrl: string;
  detectedRegions: DetectedRegion[];
  onRegionsUpdate: (regions: DetectedRegion[]) => void;
}

export const AdvancedRegionMapper: React.FC<AdvancedRegionMapperProps> = ({
  imageUrl,
  detectedRegions,
  onRegionsUpdate
}) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DetectedRegion[][]>([detectedRegions]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const addToHistory = (newRegions: DetectedRegion[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newRegions]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onRegionsUpdate(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onRegionsUpdate(history[historyIndex + 1]);
    }
  };

  const handleRegionSelect = (regionId: string, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      setSelectedRegions(prev => 
        prev.includes(regionId) 
          ? prev.filter(id => id !== regionId)
          : [...prev, regionId]
      );
    } else {
      setSelectedRegions([regionId]);
    }
  };

  const handleRegionUpdate = (regionId: string, updates: Partial<DetectedRegion>) => {
    const newRegions = detectedRegions.map(region =>
      region.id === regionId ? { ...region, ...updates } : region
    );
    addToHistory(newRegions);
    onRegionsUpdate(newRegions);
  };

  const deleteSelectedRegions = () => {
    const newRegions = detectedRegions.filter(region => !selectedRegions.includes(region.id));
    addToHistory(newRegions);
    onRegionsUpdate(newRegions);
    setSelectedRegions([]);
  };

  const regionTypeColors = {
    photo: 'border-blue-400 bg-blue-400/10',
    text: 'border-green-400 bg-green-400/10',
    logo: 'border-purple-400 bg-purple-400/10',
    border: 'border-orange-400 bg-orange-400/10',
    background: 'border-gray-400 bg-gray-400/10',
    decoration: 'border-pink-400 bg-pink-400/10'
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <div className="mb-4 flex items-center gap-2">
          <CRDButton
            size="sm"
            variant="outline"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'bg-crd-green/20' : ''}
          >
            <Grid className="w-4 h-4" />
          </CRDButton>
          
          <CRDButton size="sm" variant="outline" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </CRDButton>
          
          <span className="text-crd-white text-sm px-2">{Math.round(zoom * 100)}%</span>
          
          <CRDButton size="sm" variant="outline" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </CRDButton>

          <div className="flex-1" />
          
          <CRDButton size="sm" variant="outline" onClick={undo} disabled={historyIndex === 0}>
            <Undo className="w-4 h-4" />
          </CRDButton>
          
          <CRDButton size="sm" variant="outline" onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="w-4 h-4" />
          </CRDButton>
        </div>

        <div 
          ref={canvasRef}
          className="relative border border-crd-mediumGray/30 rounded-lg overflow-hidden bg-white"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          <img 
            ref={imageRef}
            src={imageUrl} 
            alt="Analysis target"
            className="w-full h-auto block"
            draggable={false}
          />
          
          {/* Grid Overlay */}
          {showGrid && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}
          
          {/* Region Overlays */}
          {detectedRegions.map((region) => (
            <div
              key={region.id}
              className={`absolute border-2 cursor-pointer transition-all group ${
                selectedRegions.includes(region.id) 
                  ? 'border-crd-green bg-crd-green/20 z-10' 
                  : regionTypeColors[region.type] || 'border-gray-400 bg-gray-400/10'
              }`}
              style={{
                left: `${region.bounds.x}px`,
                top: `${region.bounds.y}px`,
                width: `${region.bounds.width}px`,
                height: `${region.bounds.height}px`,
              }}
              onClick={(e) => handleRegionSelect(region.id, e.ctrlKey || e.metaKey)}
            >
              {/* Region Label */}
              <div className="absolute -top-7 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {region.type} ({Math.round(region.confidence * 100)}%)
              </div>

              {/* Resize Handles */}
              {selectedRegions.includes(region.id) && (
                <>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green rounded-full cursor-nw-resize" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full cursor-ne-resize" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green rounded-full cursor-sw-resize" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green rounded-full cursor-se-resize" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-80 space-y-4">
        {/* Layer Panel */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-lg flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Layers ({detectedRegions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {detectedRegions.map((region, index) => (
              <div
                key={region.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRegions.includes(region.id) 
                    ? 'border-crd-green bg-crd-green/10' 
                    : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
                }`}
                onClick={() => handleRegionSelect(region.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ 
                        backgroundColor: regionTypeColors[region.type]?.split(' ')[1]?.replace('bg-', '').replace('/10', '') || 'gray'
                      }}
                    />
                    <span className="text-crd-white font-medium">Layer {index + 1}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(region.confidence * 100)}%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <select
                    value={region.type}
                    onChange={(e) => handleRegionUpdate(region.id, { 
                      type: e.target.value as DetectedRegion['type'] 
                    })}
                    className="bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-2 py-1 text-sm text-crd-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="photo">Photo</option>
                    <option value="text">Text</option>
                    <option value="logo">Logo</option>
                    <option value="border">Border</option>
                    <option value="background">Background</option>
                    <option value="decoration">Decoration</option>
                  </select>
                  
                  <div className="flex items-center gap-1">
                    <CRDButton size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Eye className="w-3 h-3" />
                    </CRDButton>
                    <CRDButton size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Lock className="w-3 h-3" />
                    </CRDButton>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Selection Tools */}
        {selectedRegions.length > 0 && (
          <Card className="bg-crd-darker border-crd-mediumGray/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white text-sm">
                Selected ({selectedRegions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <CRDButton size="sm" variant="outline">
                  <Move className="w-4 h-4 mr-1" />
                  Move
                </CRDButton>
                <CRDButton size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </CRDButton>
                <CRDButton size="sm" variant="outline" onClick={deleteSelectedRegions}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </CRDButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <CRDButton size="sm" variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Region
              </CRDButton>
              <CRDButton size="sm" variant="outline" className="w-full justify-start">
                <Grid className="w-4 h-4 mr-2" />
                Auto-align
              </CRDButton>
              <CRDButton size="sm" variant="outline" className="w-full justify-start">
                <Layers className="w-4 h-4 mr-2" />
                Group Layers
              </CRDButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
