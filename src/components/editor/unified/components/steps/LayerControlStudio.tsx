
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Move, 
  RotateCcw, 
  Trash2,
  Plus,
  Layers,
  Grid,
  ZoomIn,
  ZoomOut,
  Settings,
  Target,
  Scan,
  Play,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Palette,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  type: 'photo' | 'text' | 'logo' | 'border' | 'background' | 'decoration';
  visible: boolean;
  locked: boolean;
  opacity: number;
  bounds: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface LayerControlStudioProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

export const LayerControlStudio: React.FC<LayerControlStudioProps> = ({
  onNext,
  onPrevious
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [autoDetect, setAutoDetect] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock detected layers - in real implementation, these would come from PSD analysis
  const [detectedLayers] = useState<LayerInfo[]>([
    {
      id: '1',
      name: 'Player Photo',
      type: 'photo',
      visible: true,
      locked: false,
      opacity: 100,
      bounds: { x: 45, y: 60, width: 180, height: 240 },
      confidence: 0.95
    },
    {
      id: '2',
      name: 'Team Logo',
      type: 'logo',
      visible: true,
      locked: false,
      opacity: 100,
      bounds: { x: 200, y: 20, width: 60, height: 60 },
      confidence: 0.88
    },
    {
      id: '3',
      name: 'Player Name',
      type: 'text',
      visible: true,
      locked: false,
      opacity: 100,
      bounds: { x: 20, y: 320, width: 220, height: 30 },
      confidence: 0.92
    },
    {
      id: '4',
      name: 'Card Border',
      type: 'border',
      visible: true,
      locked: true,
      opacity: 100,
      bounds: { x: 0, y: 0, width: 280, height: 400 },
      confidence: 0.98
    },
    {
      id: '5',
      name: 'Background Pattern',
      type: 'background',
      visible: true,
      locked: false,
      opacity: 75,
      bounds: { x: 10, y: 10, width: 260, height: 380 },
      confidence: 0.85
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(url);
      
      // Simulate analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const handleLayerSelect = (layerId: string, multiSelect: boolean = false) => {
    if (multiSelect) {
      setSelectedLayers(prev => 
        prev.includes(layerId) 
          ? prev.filter(id => id !== layerId)
          : [...prev, layerId]
      );
    } else {
      setSelectedLayers([layerId]);
    }
  };

  const layerTypeColors = {
    photo: 'bg-blue-500/20 border-blue-500',
    text: 'bg-green-500/20 border-green-500',
    logo: 'bg-purple-500/20 border-purple-500',
    border: 'bg-orange-500/20 border-orange-500',
    background: 'bg-gray-500/20 border-gray-500',
    decoration: 'bg-pink-500/20 border-pink-500'
  };

  const layerTypeIcons = {
    photo: ImageIcon,
    text: Type,
    logo: Circle,
    border: Square,
    background: Palette,
    decoration: Filter
  };

  return (
    <div className="flex h-full bg-crd-darkest">
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-crd-darker border-r border-crd-mediumGray/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-crd-mediumGray/20">
          <h2 className="text-xl font-bold text-crd-white mb-2 flex items-center gap-2">
            <Scan className="w-6 h-6 text-crd-green" />
            Bulk PSD Analysis
          </h2>
          <p className="text-crd-lightGray text-sm">
            Upload PSD files to automatically detect and extract card elements
          </p>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-b border-crd-mediumGray/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-crd-white font-medium">Auto Detection</label>
              <Switch checked={autoDetect} onCheckedChange={setAutoDetect} />
            </div>
            
            <CRDButton
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PSD File
                </>
              )}
            </CRDButton>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".psd,.psb"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="p-4 border-b border-crd-mediumGray/20">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-crd-green/20 rounded-full flex items-center justify-center">
                  <Scan className="w-4 h-4 text-crd-green animate-pulse" />
                </div>
                <div>
                  <div className="text-crd-white font-medium">Processing Layers</div>
                  <div className="text-crd-lightGray text-sm">Detecting card elements...</div>
                </div>
              </div>
              <div className="w-full bg-crd-mediumGray/20 rounded-full h-2">
                <div className="bg-crd-green h-2 rounded-full transition-all duration-1000 w-2/3"></div>
              </div>
            </div>
          </div>
        )}

        {/* Layers Panel */}
        {analysisComplete && (
          <div className="flex-1 overflow-hidden">
            <div className="p-4 border-b border-crd-mediumGray/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-crd-white font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Detected Layers ({detectedLayers.length})
                </h3>
                <Badge variant="secondary" className="bg-crd-green/20 text-crd-green">
                  Auto-detected
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {detectedLayers.map((layer, index) => {
                const Icon = layerTypeIcons[layer.type];
                const isSelected = selectedLayers.includes(layer.id);
                
                return (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-crd-green bg-crd-green/10' 
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
                    }`}
                    onClick={(e) => handleLayerSelect(layer.id, e.ctrlKey || e.metaKey)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${layerTypeColors[layer.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-crd-white font-medium text-sm">{layer.name}</div>
                        <div className="text-crd-lightGray text-xs capitalize">{layer.type}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(layer.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="text-crd-lightGray hover:text-crd-white">
                          {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button className="text-crd-lightGray hover:text-crd-white">
                          {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      <div className="text-crd-lightGray text-xs">
                        {layer.opacity}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {analysisComplete && (
          <div className="p-4 border-t border-crd-mediumGray/20">
            <div className="space-y-3">
              <CRDButton className="w-full" onClick={onNext}>
                <Play className="w-4 h-4 mr-2" />
                Continue to Template Generation
              </CRDButton>
              
              <div className="flex gap-2">
                <CRDButton variant="outline" size="sm" className="flex-1">
                  <Target className="w-4 h-4 mr-1" />
                  Re-analyze
                </CRDButton>
                <CRDButton variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Settings
                </CRDButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="p-4 border-b border-crd-mediumGray/20 bg-crd-darker">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-crd-white font-semibold">
                {selectedFile ? 'Layer Analysis View' : 'Upload a PSD file to begin'}
              </h3>
              {analysisComplete && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Analysis Complete
                  </Badge>
                  <span className="text-crd-lightGray text-sm">
                    {detectedLayers.length} layers detected
                  </span>
                </div>
              )}
            </div>
            
            {selectedFile && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={`p-2 rounded ${showGrid ? 'bg-crd-green/20 text-crd-green' : 'text-crd-lightGray hover:text-crd-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                  className="p-2 text-crd-lightGray hover:text-crd-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-crd-white text-sm px-2 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                
                <button 
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 text-crd-lightGray hover:text-crd-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 p-6 overflow-auto bg-crd-darkest">
          {!selectedFile ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-12 h-12 text-crd-mediumGray" />
                </div>
                <h3 className="text-crd-white text-xl font-semibold mb-2">
                  Ready for PSD Analysis
                </h3>
                <p className="text-crd-lightGray mb-6 max-w-md">
                  Upload your PSD files to automatically detect and extract card elements. 
                  The AI will identify photos, text, logos, and other components.
                </p>
                <CRDButton onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PSD File
                </CRDButton>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className="relative bg-white rounded-lg shadow-lg"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
              >
                <div className="w-[280px] h-[400px] relative overflow-hidden rounded-lg">
                  {/* Background placeholder for card */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 relative">
                    
                    {/* Grid overlay */}
                    {showGrid && (
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '20px 20px'
                        }}
                      />
                    )}
                    
                    {/* Layer overlays */}
                    {analysisComplete && detectedLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`absolute border-2 transition-all cursor-pointer group ${
                          selectedLayers.includes(layer.id) 
                            ? 'border-crd-green bg-crd-green/20 z-10' 
                            : `${layerTypeColors[layer.type]} opacity-60 hover:opacity-100`
                        }`}
                        style={{
                          left: `${layer.bounds.x}px`,
                          top: `${layer.bounds.y}px`,
                          width: `${layer.bounds.width}px`,
                          height: `${layer.bounds.height}px`,
                        }}
                        onClick={() => handleLayerSelect(layer.id)}
                      >
                        {/* Layer label */}
                        <div className="absolute -top-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {layer.name} ({Math.round(layer.confidence * 100)}%)
                        </div>
                        
                        {/* Resize handles for selected layers */}
                        {selectedLayers.includes(layer.id) && (
                          <>
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-crd-green rounded-full" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-crd-green rounded-full" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-crd-green rounded-full" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crd-green rounded-full" />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
