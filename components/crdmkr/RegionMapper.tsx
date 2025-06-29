
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Rect, FabricImage } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  EyeOff, 
  Square, 
  Type, 
  Image as ImageIcon,
  Palette,
  Trash2,
  RotateCcw,
  Zap,
  Brain
} from 'lucide-react';
import type { DetectedRegion } from '@/types/crdmkr';

interface RegionMapperProps {
  imageUrl: string;
  detectedRegions: DetectedRegion[];
  onRegionsUpdate: (regions: DetectedRegion[]) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const RegionMapper = ({ 
  imageUrl, 
  detectedRegions, 
  onRegionsUpdate,
  onAnalysisComplete 
}: RegionMapperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [showRegions, setShowRegions] = useState(true);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
      selection: true,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Handle region selection
    canvas.on('selection:created', (e) => {
      const activeObjects = canvas.getActiveObjects();
      const regionIds = activeObjects
        .filter(obj => obj.data?.regionId)
        .map(obj => obj.data.regionId);
      setSelectedRegions(new Set(regionIds));
    });

    canvas.on('selection:updated', (e) => {
      const activeObjects = canvas.getActiveObjects();
      const regionIds = activeObjects
        .filter(obj => obj.data?.regionId)
        .map(obj => obj.data.regionId);
      setSelectedRegions(new Set(regionIds));
    });

    canvas.on('selection:cleared', () => {
      setSelectedRegions(new Set());
    });

    // Handle region modifications
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj?.data?.regionId) {
        updateRegionBounds(obj.data.regionId, obj);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load image when imageUrl changes
  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Scale image to fit canvas
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );
      
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        data: { isBackground: true }
      });

      fabricCanvas.clear();
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
    });
  }, [fabricCanvas, imageUrl]);

  // Update regions when detectedRegions changes
  useEffect(() => {
    if (!fabricCanvas || !detectedRegions) return;

    // Remove existing region rectangles
    const objects = fabricCanvas.getObjects();
    const regionObjects = objects.filter(obj => obj.data?.regionId);
    regionObjects.forEach(obj => fabricCanvas.remove(obj));

    // Add new region rectangles
    detectedRegions
      .filter(region => region.confidence >= confidenceThreshold[0])
      .forEach(region => {
        addRegionToCanvas(region);
      });

    fabricCanvas.renderAll();
  }, [fabricCanvas, detectedRegions, confidenceThreshold, showRegions]);

  const addRegionToCanvas = useCallback((region: DetectedRegion) => {
    if (!fabricCanvas || !showRegions) return;

    const regionColor = getRegionColor(region.type);
    const opacity = 0.3 + (region.confidence * 0.4);

    const rect = new Rect({
      left: region.bounds.x,
      top: region.bounds.y,
      width: region.bounds.width,
      height: region.bounds.height,
      fill: `${regionColor}33`,
      stroke: regionColor,
      strokeWidth: 2,
      opacity,
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
      data: {
        regionId: region.id,
        regionType: region.type,
        confidence: region.confidence
      }
    });

    fabricCanvas.add(rect);
  }, [fabricCanvas, showRegions]);

  const getRegionColor = (type: DetectedRegion['type']): string => {
    const colors = {
      photo: '#10b981',
      text: '#3b82f6',
      logo: '#f59e0b',
      border: '#ef4444',
      background: '#6b7280',
      decoration: '#a855f7'
    };
    return colors[type] || '#6b7280';
  };

  const updateRegionBounds = useCallback((regionId: string, fabricObject: any) => {
    const updatedRegions = detectedRegions.map(region => {
      if (region.id === regionId) {
        return {
          ...region,
          bounds: {
            x: fabricObject.left,
            y: fabricObject.top,
            width: fabricObject.width * fabricObject.scaleX,
            height: fabricObject.height * fabricObject.scaleY
          }
        };
      }
      return region;
    });

    onRegionsUpdate(updatedRegions);
  }, [detectedRegions, onRegionsUpdate]);

  const handleAddRegion = (type: DetectedRegion['type']) => {
    if (!fabricCanvas) return;

    const newRegion: DetectedRegion = {
      id: `manual-${Date.now()}`,
      type,
      bounds: {
        x: 100,
        y: 100,
        width: 150,
        height: 100
      },
      confidence: 1.0,
      layerIds: []
    };

    const updatedRegions = [...detectedRegions, newRegion];
    onRegionsUpdate(updatedRegions);
  };

  const handleDeleteSelected = () => {
    if (selectedRegions.size === 0) return;

    const updatedRegions = detectedRegions.filter(
      region => !selectedRegions.has(region.id)
    );
    
    onRegionsUpdate(updatedRegions);
    setSelectedRegions(new Set());
  };

  const handleResetRegions = () => {
    onRegionsUpdate([]);
    setSelectedRegions(new Set());
  };

  const regionStats = {
    total: detectedRegions.length,
    visible: detectedRegions.filter(r => r.confidence >= confidenceThreshold[0]).length,
    highConfidence: detectedRegions.filter(r => r.confidence >= 0.8).length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Main Canvas */}
      <div className="lg:col-span-3">
        <Card className="bg-crd-darker border-crd-mediumGray/20 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Region Analysis
              </CardTitle>
              <div className="flex items-center gap-2">
                <CRDButton
                  size="sm"
                  variant={showRegions ? "primary" : "outline"}
                  onClick={() => setShowRegions(!showRegions)}
                >
                  {showRegions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </CRDButton>
                <CRDButton
                  size="sm"
                  variant="outline"
                  onClick={handleResetRegions}
                >
                  <RotateCcw className="w-4 h-4" />
                </CRDButton>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-crd-mediumGray/30 rounded-lg shadow-lg max-w-full"
              />
              
              {isAnalysisMode && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-crd-green mx-auto mb-2 animate-pulse" />
                    <p className="text-crd-white">AI Analysis in progress...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-6">
        {/* Quick Add Tools */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-sm">Add Regions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CRDButton
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddRegion('border')}
            >
              <Square className="w-4 h-4 mr-2" />
              Border
            </CRDButton>
            <CRDButton
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddRegion('text')}
            >
              <Type className="w-4 h-4 mr-2" />
              Text
            </CRDButton>
            <CRDButton
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddRegion('photo')}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Photo
            </CRDButton>
            <CRDButton
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAddRegion('logo')}
            >
              <Palette className="w-4 h-4 mr-2" />
              Logo
            </CRDButton>
          </CardContent>
        </Card>

        {/* Confidence Threshold */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-sm">Confidence Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-crd-lightGray text-sm">Threshold</span>
                <span className="text-crd-white text-sm">{Math.round(confidenceThreshold[0] * 100)}%</span>
              </div>
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-sm">Detection Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-crd-lightGray text-sm">Total Regions</span>
              <Badge variant="secondary">{regionStats.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-crd-lightGray text-sm">Visible</span>
              <Badge variant="secondary">{regionStats.visible}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-crd-lightGray text-sm">High Confidence</span>
              <Badge variant="secondary">{regionStats.highConfidence}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Selected Region Actions */}
        {selectedRegions.size > 0 && (
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-sm">
                Selected ({selectedRegions.size})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CRDButton
                variant="outline"
                className="w-full justify-start text-red-400 border-red-400/20 hover:bg-red-400/10"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </CRDButton>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
