
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Image, Type, Square, Layers, Upload, Download, Trash2, Info, Sparkles, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { PSDProcessor, type PSDLayer, type PSDProcessingResult } from '@/lib/crdmkr/psdProcessor';

interface PSDLayerManagerProps {
  psdFile: File;
  userImage?: string;
  onFrameGenerated: (frameData: any) => void;
  onCancel: () => void;
}

export const PSDLayerManager: React.FC<PSDLayerManagerProps> = ({
  psdFile,
  userImage,
  onFrameGenerated,
  onCancel
}) => {
  const [processingResult, setProcessingResult] = useState<PSDProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedPhotoLayer, setSelectedPhotoLayer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  // Process PSD file on mount
  useEffect(() => {
    const processPSD = async () => {
      try {
        console.log('🎨 Starting enhanced PSD processing...');
        setIsProcessing(true);
        setError(null);
        
        const result = await PSDProcessor.processPSDFile(psdFile);
        setProcessingResult(result);
        
        // Initialize all non-photo layers as visible
        const initialVisible = new Set<string>();
        result.layers.forEach(layer => {
          if (!layer.isPhotoLayer) {
            initialVisible.add(layer.id);
          }
        });
        setVisibleLayers(initialVisible);
        
        // Find the first photo layer
        const photoLayer = result.layers.find(layer => layer.isPhotoLayer);
        if (photoLayer) {
          setSelectedPhotoLayer(photoLayer.id);
        }
        
        setPreviewUrl(result.previewUrl);
        
        console.log('✅ Enhanced PSD processing complete:', result);
        toast.success('PSD layers extracted and enhanced!');
      } catch (error) {
        console.error('❌ PSD processing error:', error);
        setError(error instanceof Error ? error.message : 'Failed to process PSD');
        toast.error('Failed to process PSD file');
      } finally {
        setIsProcessing(false);
      }
    };

    processPSD();
  }, [psdFile]);

  // Update preview when layer visibility changes
  useEffect(() => {
    if (!processingResult) return;
    
    const updatePreview = async () => {
      try {
        const newPreview = await PSDProcessor.generateCompositePreview(
          processingResult.layers,
          processingResult.dimensions,
          visibleLayers,
          processingResult.flattenedImage
        );
        setPreviewUrl(newPreview);
      } catch (error) {
        console.error('❌ Preview update error:', error);
      }
    };

    updatePreview();
  }, [visibleLayers, processingResult]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  }, []);

  const handleReplacePhotoLayer = useCallback((layerId: string) => {
    setSelectedPhotoLayer(layerId);
    // Make photo layer visible when selected for replacement
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      newSet.add(layerId);
      return newSet;
    });
    toast.success('Photo layer selected for replacement');
  }, []);

  const generateCRDFrame = useCallback(async () => {
    if (!processingResult || visibleLayers.size === 0) {
      toast.error('Please select at least one layer');
      return;
    }

    try {
      console.log('🎯 Generating CRD Frame from layers...');
      
      // Get only visible layers
      const activeLayers = processingResult.layers.filter(layer => 
        visibleLayers.has(layer.id)
      );
      
      // Create frame data structure
      const frameData = {
        id: `psd-frame-${Date.now()}`,
        name: `${psdFile.name.replace(/\.(psd|psb)$/i, '')} Frame`,
        category: 'PSD Generated',
        description: `Custom frame generated from ${psdFile.name}`,
        dimensions: processingResult.dimensions,
        layers: activeLayers,
        photoReplacement: selectedPhotoLayer ? {
          layerId: selectedPhotoLayer,
          bounds: processingResult.layers.find(l => l.id === selectedPhotoLayer)?.bounds
        } : null,
        previewUrl,
        sourceFile: psdFile.name,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ CRD Frame generated:', frameData);
      onFrameGenerated(frameData);
      toast.success('CRD Frame created successfully!');
    } catch (error) {
      console.error('❌ Frame generation error:', error);
      toast.error('Failed to generate CRD Frame');
    }
  }, [processingResult, visibleLayers, selectedPhotoLayer, previewUrl, psdFile.name, onFrameGenerated]);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'image': return Image;
      case 'shape': return Square;
      default: return Layers;
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/40 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 mb-6">
              <Trash2 className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Processing Failed</h3>
            </div>
            <p className="text-red-200 mb-6 text-lg">{error}</p>
            <div className="bg-red-900/30 rounded-lg p-4 mb-6 text-sm text-red-100">
              <p className="font-medium mb-2">💡 Development Note:</p>
              <p>This is an enhanced preview version. For production, we'll integrate full PSD parsing capabilities.</p>
            </div>
            <CRDButton 
              onClick={onCancel} 
              variant="outline"
              className="border-red-400/50 text-red-200 hover:bg-red-900/30"
            >
              Go Back
            </CRDButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-crd-darkGray to-crd-darker border-crd-green/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="relative mb-8">
              <div className="w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-crd-green/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-crd-green border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-crd-white mb-4">Processing PSD File</h3>
            <p className="text-crd-lightGray text-lg">Extracting layers and generating enhanced previews...</p>
            <div className="mt-6 flex items-center justify-center space-x-2 text-crd-green">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Enhanced Processing</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!processingResult) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 to-crd-blue/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-crd-darkGray to-crd-darker border border-crd-green/30 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-crd-green to-crd-blue bg-clip-text text-transparent">
                PSD Layer Studio
              </h2>
              <p className="text-crd-lightGray text-lg">
                Craft your custom CRD Frame from <span className="text-crd-green font-medium">{psdFile.name}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <CRDButton onClick={onCancel} variant="outline" className="border-crd-mediumGray/40">
                Cancel
              </CRDButton>
              <CRDButton 
                onClick={generateCRDFrame}
                className="bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-black font-bold px-8 shadow-lg"
                disabled={visibleLayers.size === 0}
              >
                <Download className="w-5 h-5 mr-2" />
                Generate CRD Frame
              </CRDButton>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Info Banner */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-crd-blue/10 border-blue-400/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <Info className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-blue-300 font-bold text-lg mb-2">Enhanced PSD Processing</h4>
              <p className="text-blue-100 leading-relaxed">
                Experience our next-generation PSD layer management with real-time preview compositing, 
                intelligent layer detection, and seamless frame generation capabilities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Enhanced Preview Panel */}
        <Card className="bg-gradient-to-br from-crd-darkGray to-crd-darker border-crd-green/30 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-crd-white flex items-center gap-3 text-xl">
              <div className="bg-crd-green/20 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-crd-green" />
              </div>
              Live Preview Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-[5/7] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-crd-mediumGray/30">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Enhanced layer composite"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-2 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-crd-mediumGray">Generating preview...</p>
                  </div>
                </div>
              )}
              
              {/* User image overlay indicator */}
              {userImage && selectedPhotoLayer && (
                <div className="absolute top-4 right-4 bg-crd-green/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-black" />
                  <span className="text-black text-sm font-medium">Photo Ready</span>
                </div>
              )}
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-crd-mediumGray/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-crd-green">{processingResult.dimensions.width} × {processingResult.dimensions.height}</div>
                <div className="text-crd-lightGray text-sm">Canvas Size</div>
              </div>
              <div className="bg-crd-mediumGray/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-crd-blue">{visibleLayers.size} / {processingResult.layers.length}</div>
                <div className="text-crd-lightGray text-sm">Active Layers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Layer Management Panel */}
        <Card className="bg-gradient-to-br from-crd-darkGray to-crd-darker border-crd-blue/30 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-crd-white flex items-center gap-3 text-xl">
              <div className="bg-crd-blue/20 p-2 rounded-lg">
                <Layers className="w-6 h-6 text-crd-blue" />
              </div>
              Layer Control Studio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {processingResult.layers.map((layer) => {
                const IconComponent = getLayerIcon(layer.type);
                const isVisible = visibleLayers.has(layer.id);
                const isPhotoReplacement = selectedPhotoLayer === layer.id;
                const isHovered = hoveredLayer === layer.id;
                
                return (
                  <div
                    key={layer.id}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isPhotoReplacement 
                        ? 'border-crd-green bg-gradient-to-r from-crd-green/20 to-crd-green/10 shadow-lg' 
                        : isHovered
                        ? 'border-crd-blue/50 bg-crd-blue/5 shadow-md transform scale-[1.02]'
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50 bg-crd-mediumGray/10'
                    }`}
                    onMouseEnter={() => setHoveredLayer(layer.id)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isVisible 
                            ? 'text-crd-green bg-crd-green/20 hover:bg-crd-green/30 shadow-md' 
                            : 'text-crd-mediumGray bg-crd-mediumGray/10 hover:bg-crd-mediumGray/20 hover:text-crd-lightGray'
                        }`}
                      >
                        {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      
                      <div className={`p-2 rounded-lg ${
                        layer.isPhotoLayer ? 'bg-blue-500/20' : 'bg-crd-mediumGray/20'
                      }`}>
                        <IconComponent className="w-5 h-5 text-crd-lightGray" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-crd-white font-semibold text-lg">{layer.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs bg-crd-mediumGray/20 border-crd-mediumGray/40"
                          >
                            {layer.type}
                          </Badge>
                          {layer.isPhotoLayer && (
                            <Badge className="bg-blue-500/20 text-blue-300 text-xs border-blue-400/30">
                              Photo Layer
                            </Badge>
                          )}
                          {isPhotoReplacement && (
                            <Badge className="bg-crd-green/20 text-crd-green text-xs border-crd-green/40">
                              <Upload className="w-3 h-3 mr-1" />
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {layer.isPhotoLayer && !isPhotoReplacement && (
                        <CRDButton
                          size="sm"
                          onClick={() => handleReplacePhotoLayer(layer.id)}
                          className="bg-gradient-to-r from-crd-green/20 to-crd-blue/20 text-crd-green hover:from-crd-green/30 hover:to-crd-blue/30 border border-crd-green/30"
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Select
                        </CRDButton>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-crd-mediumGray">
                      <span>{layer.bounds.width} × {layer.bounds.height}px</span>
                      <span>Opacity: {Math.round(layer.opacity * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
