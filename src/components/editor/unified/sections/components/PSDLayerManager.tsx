
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Image, Type, Square, Layers, Upload, Download, Trash2, Info } from 'lucide-react';
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

  // Process PSD file on mount
  useEffect(() => {
    const processPSD = async () => {
      try {
        console.log('🎨 Starting PSD processing...');
        setIsProcessing(true);
        setError(null);
        
        const result = await PSDProcessor.processPSDFile(psdFile);
        setProcessingResult(result);
        
        // Initialize all layers as visible except photo layers
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
        
        console.log('✅ PSD processing complete:', result);
        toast.success('PSD layers extracted successfully!');
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
          visibleLayers
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
    // Hide the original photo layer
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      newSet.delete(layerId);
      return newSet;
    });
    toast.success('Photo layer will be replaced with your uploaded image');
  }, []);

  const generateCRDFrame = useCallback(async () => {
    if (!processingResult) return;

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
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <Trash2 className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Processing Failed</h3>
            </div>
            <p className="text-red-300 mb-4">{error}</p>
            <div className="text-sm text-red-200 mb-4">
              <p>Note: This is a preview version of PSD processing.</p>
              <p>For best results, export your PSD as PNG and upload that instead.</p>
            </div>
            <CRDButton onClick={onCancel} variant="outline">
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
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-crd-green border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-crd-white mb-2">Processing PSD File</h3>
            <p className="text-crd-lightGray">Extracting layers and generating previews...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!processingResult) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-crd-white">PSD Layer Manager</h2>
          <p className="text-crd-lightGray">
            Toggle layers to create your custom CRD Frame from {psdFile.name}
          </p>
        </div>
        <div className="flex gap-3">
          <CRDButton onClick={onCancel} variant="outline">
            Cancel
          </CRDButton>
          <CRDButton 
            onClick={generateCRDFrame}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
            disabled={visibleLayers.size === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate CRD Frame
          </CRDButton>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="text-blue-300 font-medium mb-1">PSD Preview Mode</h4>
              <p className="text-blue-200">
                This is a preview implementation that generates mock layers based on common card patterns. 
                For production use, we'll implement full PSD parsing to extract actual layer data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Panel */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[5/7] bg-white rounded-lg overflow-hidden relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Layer composite preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-crd-mediumGray">Preview loading...</p>
                </div>
              )}
              
              {/* User image overlay if photo layer is replaced */}
              {userImage && selectedPhotoLayer && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-crd-green/20 border-2 border-crd-green border-dashed rounded p-2">
                    <p className="text-crd-green text-sm font-medium">Your photo will appear here</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-crd-lightGray">
              <p>Dimensions: {processingResult.dimensions.width} × {processingResult.dimensions.height}px</p>
              <p>Visible Layers: {visibleLayers.size} / {processingResult.layers.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Layer Management Panel */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Layer Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {processingResult.layers.map((layer) => {
                const IconComponent = getLayerIcon(layer.type);
                const isVisible = visibleLayers.has(layer.id);
                const isPhotoReplacement = selectedPhotoLayer === layer.id;
                
                return (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isPhotoReplacement 
                        ? 'border-crd-green bg-crd-green/10' 
                        : 'border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className={`p-1 rounded transition-colors ${
                          isVisible 
                            ? 'text-crd-green hover:text-crd-green/80' 
                            : 'text-crd-mediumGray hover:text-crd-lightGray'
                        }`}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <IconComponent className="w-4 h-4 text-crd-lightGray" />
                      
                      <div className="flex-1">
                        <h4 className="text-crd-white font-medium text-sm">{layer.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {layer.type}
                          </Badge>
                          {layer.isPhotoLayer && (
                            <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                              Photo Layer
                            </Badge>
                          )}
                          {isPhotoReplacement && (
                            <Badge className="bg-crd-green/20 text-crd-green text-xs">
                              Replaced
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {layer.isPhotoLayer && !isPhotoReplacement && (
                        <CRDButton
                          size="sm"
                          onClick={() => handleReplacePhotoLayer(layer.id)}
                          className="bg-crd-green/20 text-crd-green hover:bg-crd-green/30"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Replace
                        </CRDButton>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-crd-mediumGray">
                      {layer.bounds.width} × {layer.bounds.height}px at ({layer.bounds.x}, {layer.bounds.y})
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
