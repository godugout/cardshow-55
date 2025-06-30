import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageCropper } from '@/components/editor/ImageCropper';
import { StreamlinedAdvancedCropper } from '@/components/editor/StreamlinedAdvancedCropper';
import { BaseballCardCropper } from '@/components/editor/cropping/BaseballCardCropper';
import { DemoAdvancedCropper } from '@/components/demo/croppers/DemoAdvancedCropper';
import { TemplateAwareMultiCropper } from '@/components/editor/cropping/TemplateAwareMultiCropper';
import { ArrowLeft, Image, Scissors, Grid, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample images for testing
const SAMPLE_IMAGES = [
  '/lovable-uploads/069c8fac-95c2-4bdf-8e53-f3a732cd5b41.png',
  '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
  '/lovable-uploads/2406a214-0403-4ff0-af81-3aae1a790c62.png',
  '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png'
];

// Mock template for baseball cropper demo
const MOCK_BASEBALL_TEMPLATE = {
  id: 'demo-baseball',
  name: 'Demo Baseball Template',
  category: 'sports',
  is_premium: false,
  template_data: {
    component: 'ClassicBaseballTemplate',
    photoRegion: {
      x: 15,
      y: 50,
      width: 220,
      height: 180,
      shape: 'rectangle' as const
    },
    colors: {
      primary: '#1a472a',
      secondary: '#2d5a3d',
      accent: '#4ade80',
      text: '#ffffff'
    }
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

interface CropperInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  bestFor: string;
  complexity: 'Simple' | 'Medium' | 'Advanced';
  icon: React.ReactNode;
}

const CROPPER_INFO: CropperInfo[] = [
  {
    id: 'simple',
    name: 'Simple ImageCropper',
    description: 'Clean, reliable single-crop interface with essential features',
    features: ['Single crop area', 'Aspect ratio enforcement', 'Auto-fit functionality', 'Drag handles', 'Real-time preview'],
    bestFor: 'Basic card cropping and general image editing',
    complexity: 'Simple',
    icon: <Image className="w-5 h-5" />
  },
  {
    id: 'streamlined',
    name: 'Streamlined Advanced',
    description: 'Balanced multi-crop interface with essential professional features',
    features: ['Multiple crop areas', 'Grid snapping', 'Zoom controls', 'Clean UI', 'Export options'],
    bestFor: 'Multiple card extraction with user-friendly interface',
    complexity: 'Medium',
    icon: <Scissors className="w-5 h-5" />
  },
  {
    id: 'advanced',
    name: 'Advanced Multi-Crop',
    description: 'Professional-grade cropper with full feature set',
    features: ['Complex multi-crop', 'Rotation handles', 'Layer management', 'Undo/Redo', 'Professional toolbar'],
    bestFor: 'Complex professional workflows and batch processing',
    complexity: 'Advanced',
    icon: <Grid className="w-5 h-5" />
  },
  {
    id: 'template-aware',
    name: 'Template-Aware Multi-Crop',
    description: 'Intelligent cropper with template integration and smart presets',
    features: ['Template integration', 'Smart presets', 'Visual guidance', 'Multi-crop', 'Template-aware extraction'],
    bestFor: 'Card creation with template guidance and intelligent cropping',
    complexity: 'Advanced',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'baseball',
    name: 'Template-Aware Baseball',
    description: 'Sports card optimized cropper with preset positions',
    features: ['Baseball card presets', 'Portrait/Action modes', 'Template integration', 'Sports-focused', 'Quick positioning'],
    bestFor: 'Sports card creation and template-based workflows',
    complexity: 'Medium',
    icon: <Zap className="w-5 h-5" />
  }
];

export const CropperDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES[0]);
  const [cropResults, setCropResults] = useState<Record<string, string[]>>({});

  const handleCropComplete = (cropperId: string, croppedImageUrl: string | string[]) => {
    setCropResults(prev => {
      const newResults = { ...prev };
      
      if (Array.isArray(croppedImageUrl)) {
        // Handle multiple results (from advanced croppers)
        newResults[cropperId] = [...(prev[cropperId] || []), ...croppedImageUrl];
      } else {
        // Handle single result
        newResults[cropperId] = [...(prev[cropperId] || []), croppedImageUrl];
      }
      
      return newResults;
    });
  };

  const handleAdvancedCropComplete = (results: any[]) => {
    const urls = results.map(result => result.croppedImageUrl);
    handleCropComplete('advanced', urls);
  };

  const handleStreamlinedCropComplete = (crops: { main?: string; frame?: string; elements?: string[]; }) => {
    const urls: string[] = [];
    
    if (crops.main) urls.push(crops.main);
    if (crops.frame) urls.push(crops.frame);
    if (crops.elements) urls.push(...crops.elements);
    
    handleCropComplete('streamlined', urls);
  };

  const handleTemplateAwareCropComplete = useCallback((crops: { main?: string; frame?: string; elements?: string[]; }) => {
    const urls: string[] = [];
    
    if (crops.main) urls.push(crops.main);
    if (crops.frame) urls.push(crops.frame);
    if (crops.elements) urls.push(...crops.elements);
    
    handleCropComplete('template-aware', urls);
  }, []);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="border-b border-crd-mediumGray/30 bg-crd-darker">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/create')}
                className="bg-crd-darkGray border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Create
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-crd-white">Cropper Demo Gallery</h1>
                <p className="text-crd-lightGray">Compare different cropping implementations</p>
              </div>
            </div>
            <Badge className="bg-crd-blue text-white">5 Implementations</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Sample Image Selector */}
        <Card className="bg-crd-darker border-crd-mediumGray/30 mb-8">
          <CardHeader>
            <CardTitle className="text-crd-white">Sample Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {SAMPLE_IMAGES.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image 
                      ? 'border-crd-green shadow-lg scale-105' 
                      : 'border-crd-mediumGray/30 hover:border-crd-green/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cropper Comparison */}
        <Tabs defaultValue="template-aware" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-crd-darker border border-crd-mediumGray/30">
            {CROPPER_INFO.map((cropper) => (
              <TabsTrigger 
                key={cropper.id} 
                value={cropper.id}
                className="data-[state=active]:bg-crd-green data-[state=active]:text-black text-crd-lightGray"
              >
                <div className="flex items-center gap-2">
                  {cropper.icon}
                  <span className="hidden sm:inline">{cropper.name.split(' ')[0]}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Simple Cropper */}
          <TabsContent value="simple" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardContent className="p-6">
                    <ImageCropper
                      imageUrl={selectedImage}
                      onCropComplete={(url) => handleCropComplete('simple', url)}
                      aspectRatio={5/7}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        Simple ImageCropper
                      </CardTitle>
                      <Badge className={getComplexityColor('Simple')}>Simple</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">
                      Clean, reliable single-crop interface with essential features
                    </p>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Features:</h4>
                      <ul className="text-crd-lightGray text-sm space-y-1">
                        {CROPPER_INFO[0].features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Best For:</h4>
                      <p className="text-crd-lightGray text-sm">{CROPPER_INFO[0].bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Streamlined Advanced */}
          <TabsContent value="streamlined" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardContent className="p-0">
                    <StreamlinedAdvancedCropper
                      imageUrl={selectedImage}
                      onCropComplete={handleStreamlinedCropComplete}
                      onCancel={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        <Scissors className="w-5 h-5" />
                        Streamlined Advanced
                      </CardTitle>
                      <Badge className={getComplexityColor('Medium')}>Medium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">
                      Balanced multi-crop interface with essential professional features
                    </p>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Features:</h4>
                      <ul className="text-crd-lightGray text-sm space-y-1">
                        {CROPPER_INFO[1].features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Best For:</h4>
                      <p className="text-crd-lightGray text-sm">{CROPPER_INFO[1].bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Multi-Crop */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardContent className="p-0">
                    <DemoAdvancedCropper
                      imageUrl={selectedImage}
                      onCropComplete={handleAdvancedCropComplete}
                      onCancel={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Advanced Multi-Crop
                      </CardTitle>
                      <Badge className={getComplexityColor('Advanced')}>Advanced</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">
                      Professional-grade cropper with full feature set
                    </p>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Features:</h4>
                      <ul className="text-crd-lightGray text-sm space-y-1">
                        {CROPPER_INFO[2].features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Best For:</h4>
                      <p className="text-crd-lightGray text-sm">{CROPPER_INFO[2].bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Template-Aware Multi-Crop */}
          <TabsContent value="template-aware" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardContent className="p-0">
                    <TemplateAwareMultiCropper
                      imageUrl={selectedImage}
                      template={MOCK_BASEBALL_TEMPLATE}
                      onCropComplete={handleTemplateAwareCropComplete}
                      onCancel={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Template-Aware Multi-Crop
                      </CardTitle>
                      <Badge className={getComplexityColor('Advanced')}>Advanced</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">
                      Intelligent cropper with template integration and smart presets
                    </p>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Features:</h4>
                      <ul className="text-crd-lightGray text-sm space-y-1">
                        {CROPPER_INFO[3].features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Best For:</h4>
                      <p className="text-crd-lightGray text-sm">{CROPPER_INFO[3].bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Baseball Template-Aware */}
          <TabsContent value="baseball" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardContent className="p-6">
                    <BaseballCardCropper
                      imageUrl={selectedImage}
                      template={MOCK_BASEBALL_TEMPLATE}
                      onCropComplete={(url) => handleCropComplete('baseball', url)}
                      onCancel={() => {}}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card className="bg-crd-darker border-crd-mediumGray/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Template-Aware Baseball
                      </CardTitle>
                      <Badge className={getComplexityColor('Medium')}>Medium</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">
                      Sports card optimized cropper with preset positions
                    </p>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Features:</h4>
                      <ul className="text-crd-lightGray text-sm space-y-1">
                        {CROPPER_INFO[4].features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-crd-white font-medium mb-2">Best For:</h4>
                      <p className="text-crd-lightGray text-sm">{CROPPER_INFO[4].bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Comparison Table */}
        <Card className="bg-crd-darker border-crd-mediumGray/30 mt-8">
          <CardHeader>
            <CardTitle className="text-crd-white">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-crd-mediumGray/30">
                    <th className="text-left text-crd-white font-medium py-3">Feature</th>
                    <th className="text-center text-crd-white font-medium py-3">Simple</th>
                    <th className="text-center text-crd-white font-medium py-3">Streamlined</th>
                    <th className="text-center text-crd-white font-medium py-3">Advanced</th>
                    <th className="text-center text-crd-white font-medium py-3">Template-Aware</th>
                    <th className="text-center text-crd-white font-medium py-3">Baseball</th>
                  </tr>
                </thead>
                <tbody className="text-crd-lightGray">
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Single Crop</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Multiple Crops</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">❌</td>
                  </tr>
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Template Integration</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Smart Presets</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Visual Guidance</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">❌</td>
                  </tr>
                  <tr className="border-b border-crd-mediumGray/10">
                    <td className="py-3">Rotation</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="py-3">Ease of Use</td>
                    <td className="text-center">⭐⭐⭐⭐⭐</td>
                    <td className="text-center">⭐⭐⭐⭐</td>
                    <td className="text-center">⭐⭐⭐</td>
                    <td className="text-center">⭐⭐⭐⭐⭐</td>
                    <td className="text-center">⭐⭐⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropperDemo;
