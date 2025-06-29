
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Image, Type, Square, Layers, Download, Sparkles, Palette, Upload, Play } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedPSDProcessor, type EnhancedPSDLayer, type EnhancedPSDResult } from '@/lib/crdmkr/enhancedPSDProcessor';

interface ProfessionalPSDManagerProps {
  psdFile: File;
  userImage?: string;
  onFrameGenerated: (frameData: any) => void;
  onCancel: () => void;
}

export const ProfessionalPSDManager: React.FC<ProfessionalPSDManagerProps> = ({
  psdFile,
  userImage,
  onFrameGenerated,
  onCancel
}) => {
  const [processingResult, setProcessingResult] = useState<EnhancedPSDResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());
  const [selectedPhotoLayer, setSelectedPhotoLayer] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Process PSD file
  useEffect(() => {
    const processPSD = async () => {
      try {
        console.log('🎨 Starting professional PSD processing...');
        setIsProcessing(true);
        
        const result = await EnhancedPSDProcessor.processPSDFile(psdFile);
        setProcessingResult(result);
        
        // Initialize visible layers (exclude photo layers initially)
        const initialVisible = new Set<string>();
        result.layers.forEach(layer => {
          if (!layer.isPhotoLayer) {
            initialVisible.add(layer.id);
          }
        });
        setVisibleLayers(initialVisible);
        
        // Find first photo layer
        const photoLayer = result.layers.find(layer => layer.isPhotoLayer);
        if (photoLayer) {
          setSelectedPhotoLayer(photoLayer.id);
          initialVisible.add(photoLayer.id); // Make photo layer visible
        }
        
        setPreviewUrl(result.previewUrl);
        
        console.log('✅ Professional PSD processing complete');
        toast.success('PSD processed successfully!', { 
          description: `Found ${result.layers.length} layers`
        });
      } catch (error) {
        console.error('❌ PSD processing error:', error);
        toast.error('Failed to process PSD file');
      } finally {
        setIsProcessing(false);
      }
    };

    processPSD();
  }, [psdFile]);

  // Update preview when layers change
  useEffect(() => {
    if (!processingResult) return;
    
    const updatePreview = async () => {
      try {
        const newPreview = await EnhancedPSDProcessor.generateCompositePreview(
          processingResult.layers,
          processingResult.dimensions,
          visibleLayers,
          processingResult.flattenedCanvas
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

  const selectPhotoLayer = useCallback((layerId: string) => {
    setSelectedPhotoLayer(layerId);
    setVisibleLayers(prev => new Set(prev).add(layerId));
    toast.success('Photo layer selected for replacement');
  }, []);

  const generateCRDFrame = useCallback(async () => {
    if (!processingResult || visibleLayers.size === 0) {
      toast.error('Please select at least one layer');
      return;
    }

    try {
      setIsGenerating(true);
      console.log('🎯 Generating professional CRD Frame...');
      
      // Filter active layers
      const activeLayers = processingResult.layers.filter(layer => 
        visibleLayers.has(layer.id)
      );
      
      // Create comprehensive frame data
      const frameData = {
        id: `professional-frame-${Date.now()}`,
        name: `${psdFile.name.replace(/\.(psd|psb)$/i, '')} Professional Frame`,
        category: 'Professional PSD',
        description: `High-quality frame generated from ${psdFile.name} with ${activeLayers.length} active layers`,
        dimensions: processingResult.dimensions,
        layers: activeLayers,
        photoReplacement: selectedPhotoLayer ? {
          layerId: selectedPhotoLayer,
          bounds: processingResult.layers.find(l => l.id === selectedPhotoLayer)?.bounds
        } : null,
        previewUrl,
        sourceFile: psdFile.name,
        quality: 'professional',
        createdAt: new Date().toISOString(),
        metadata: {
          originalDimensions: processingResult.dimensions,
          layerCount: activeLayers.length,
          hasPhotoReplacement: !!selectedPhotoLayer,
          processingMethod: 'enhanced-psd-processor'
        }
      };
      
      console.log('✅ Professional CRD Frame ready:', frameData);
      onFrameGenerated(frameData);
      
      toast.success('Professional CRD Frame created!', {
        description: 'Ready to use in your card creation workflow'
      });
    } catch (error) {
      console.error('❌ Frame generation error:', error);
      toast.error('Failed to generate CRD Frame');
    } finally {
      setIsGenerating(false);
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

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray flex items-center justify-center">
        <Card className="bg-gradient-to-br from-crd-darkGray via-crd-darker to-crd-darkGray border border-crd-green/20 shadow-2xl max-w-md w-full mx-4">
          <CardContent className="p-12 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-crd-green/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-crd-green border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-crd-white mb-4">Processing PSD File</h3>
            <p className="text-crd-lightGray text-lg mb-6">
              Extracting layers and generating professional preview...
            </p>
            <div className="text-sm text-crd-green font-medium">
              {psdFile.name} • {(psdFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!processingResult) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkGray">
      {/* Professional Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/10 via-crd-blue/10 to-crd-green/10"></div>
        <div className="relative bg-gradient-to-br from-crd-darkGray/90 via-crd-darker/90 to-crd-darkGray/90 backdrop-blur-sm border-b border-crd-green/20">
          <div className="max-w-7xl mx-auto p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-crd-green via-crd-blue to-crd-green bg-clip-text text-transparent">
                  Professional PSD Studio
                </h2>
                <p className="text-crd-lightGray text-xl">
                  Craft your professional card frame from <span className="text-crd-green font-semibold">{psdFile.name}</span>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                    {processingResult.dimensions.width} × {processingResult.dimensions.height}px
                  </Badge>
                  <Badge className="bg-crd-blue/20 text-crd-blue border-crd-blue/30">
                    {processingResult.layers.length} Layers
                  </Badge>
                  <Badge className="bg-crd-orange/20 text-crd-orange border-crd-orange/30">
                    Professional Quality
                  </Badge>
                </div>
              </div>
              <div className="flex gap-4">
                <CRDButton 
                  onClick={onCancel} 
                  variant="outline" 
                  className="border-crd-mediumGray/40 text-crd-lightGray hover:text-crd-white hover:border-crd-mediumGray/60"
                >
                  Cancel
                </CRDButton>
                <CRDButton 
                  onClick={generateCRDFrame}
                  disabled={visibleLayers.size === 0 || isGenerating}
                  className="bg-gradient-to-r from-crd-green to-crd-blue hover:from-crd-green/90 hover:to-crd-blue/90 text-black font-bold px-8 shadow-xl"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Generate Professional Frame
                    </>
                  )}
                </CRDButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Professional Preview Panel */}
          <Card className="bg-gradient-to-br from-crd-darkGray/50 via-crd-darker/50 to-crd-darkGray/50 backdrop-blur-sm border border-crd-green/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-crd-green to-crd-blue p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-crd-white">Live Preview Studio</h3>
              </div>
              
              <div className="relative aspect-[5/7] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-crd-green/20 shadow-inner">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Professional layer composite"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-crd-green border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-crd-lightGray">Generating preview...</p>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Status Indicators */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
                    <span className="text-crd-white text-sm font-medium">Live Preview</span>
                  </div>
                  {selectedPhotoLayer && (
                    <div className="bg-crd-blue/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Photo Layer Ready</span>
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                    <span className="text-crd-lightGray text-sm">
                      {visibleLayers.size} / {processingResult.layers.length} layers active
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Layer Manager */}
          <Card className="bg-gradient-to-br from-crd-darkGray/50 via-crd-darker/50 to-crd-darkGray/50 backdrop-blur-sm border border-crd-blue/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-crd-blue to-crd-green p-3 rounded-xl">
                  <Layers className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-crd-white">Layer Control Studio</h3>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {processingResult.layers.map((layer) => {
                  const IconComponent = getLayerIcon(layer.type);
                  const isVisible = visibleLayers.has(layer.id);
                  const isPhotoSelected = selectedPhotoLayer === layer.id;
                  const isHovered = hoveredLayer === layer.id;
                  
                  return (
                    <div
                      key={layer.id}
                      className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer transform ${
                        isPhotoSelected 
                          ? 'border-crd-green bg-gradient-to-r from-crd-green/20 via-crd-green/10 to-transparent shadow-xl scale-[1.02]' 
                          : isHovered
                          ? 'border-crd-blue/60 bg-gradient-to-r from-crd-blue/10 via-crd-blue/5 to-transparent shadow-lg scale-[1.01]'
                          : 'border-crd-mediumGray/20 hover:border-crd-mediumGray/40 bg-gradient-to-r from-crd-mediumGray/5 to-transparent'
                      }`}
                      onMouseEnter={() => setHoveredLayer(layer.id)}
                      onMouseLeave={() => setHoveredLayer(null)}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLayerVisibility(layer.id)}
                          className={`p-3 rounded-xl transition-all duration-200 ${
                            isVisible 
                              ? 'text-crd-green bg-crd-green/20 hover:bg-crd-green/30 shadow-lg' 
                              : 'text-crd-mediumGray bg-crd-mediumGray/10 hover:bg-crd-mediumGray/20 hover:text-crd-lightGray'
                          }`}
                        >
                          {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        
                        <div className={`p-3 rounded-xl ${
                          layer.isPhotoLayer ? 'bg-crd-blue/20' : 'bg-crd-mediumGray/20'
                        }`}>
                          <IconComponent className="w-5 h-5 text-crd-lightGray" />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-crd-white font-bold text-lg mb-2">{layer.name}</h4>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-crd-mediumGray/10 border-crd-mediumGray/30">
                              {layer.type.toUpperCase()}
                            </Badge>
                            {layer.isPhotoLayer && (
                              <Badge className="bg-crd-blue/20 text-crd-blue text-xs border-crd-blue/30">
                                <Image className="w-3 h-3 mr-1" />
                                Photo Layer
                              </Badge>
                            )}
                            {isPhotoSelected && (
                              <Badge className="bg-crd-green/20 text-crd-green text-xs border-crd-green/40">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {layer.isPhotoLayer && !isPhotoSelected && (
                          <CRDButton
                            size="sm"
                            onClick={() => selectPhotoLayer(layer.id)}
                            className="bg-gradient-to-r from-crd-blue/20 to-crd-green/20 text-crd-blue hover:from-crd-blue/30 hover:to-crd-green/30 border border-crd-blue/30"
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Select
                          </CRDButton>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-crd-mediumGray">
                          {layer.bounds.width} × {layer.bounds.height}px
                        </span>
                        <span className="text-crd-mediumGray">
                          Opacity: {Math.round(layer.opacity * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
