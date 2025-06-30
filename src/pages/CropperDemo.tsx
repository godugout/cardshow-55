import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';
import { StreamlinedAdvancedCropper } from '@/components/editor/StreamlinedAdvancedCropper';
import { AdvancedCropper } from '@/components/editor/AdvancedCropper';
import { toast } from 'sonner';

// Mock template data
const mockTemplate = {
  id: 'template-1',
  name: 'Standard Trading Card',
  category: 'sports' as const,
  template_data: {
    colors: {
      primary: '#1a472a',
      secondary: '#10b981'
    }
  }
};

const CropperDemo = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('streamlined');
  const [showCropper, setShowCropper] = useState(false);

  // Sample images for testing
  const sampleImages = [
    '/lovable-uploads/jordan_rookie.jpeg',
    '/lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png',
    '/lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    console.log('Crop results:', crops);
    toast.success(`Successfully extracted ${Object.keys(crops).length} crop areas!`);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
  };

  if (showCropper && selectedImage) {
    return (
      <div className="h-screen bg-crd-darkest">
        {selectedTab === 'streamlined' ? (
          <StreamlinedAdvancedCropper
            imageUrl={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={2.5 / 3.5}
            template={mockTemplate}
            showCardPreview={true}
          />
        ) : (
          <AdvancedCropper
            imageUrl={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={2.5 / 3.5}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Advanced Cropper Demo</h1>
          <p className="text-crd-lightGray">
            Test the enhanced template-aware cropper with sample images or upload your own
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-crd-darker">
            <TabsTrigger value="streamlined" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Template-Aware Cropper
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-crd-orange data-[state=active]:text-black">
              Advanced Cropper
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streamlined" className="space-y-6">
            <Card className="bg-crd-darker border-crd-mediumGray">
              <CardContent className="p-6">
                <h3 className="text-white text-xl font-semibold mb-4">Template-Aware Multi-Cropper</h3>
                <p className="text-crd-lightGray mb-4">
                  Enhanced cropper with template guides, background dimming, and real-time card preview.
                </p>
                <ul className="text-crd-lightGray text-sm space-y-1">
                  <li>• Template constraint guides (2.5" × 3.5" card outline)</li>
                  <li>• Background dimming outside crop areas</li>
                  <li>• Stacked layer management sidebar</li>
                  <li>• Real-time card preview panel</li>
                  <li>• Big Frame/Element creation buttons</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-crd-darker border-crd-mediumGray">
              <CardContent className="p-6">
                <h3 className="text-white text-xl font-semibold mb-4">Advanced Cropper</h3>
                <p className="text-crd-lightGray mb-4">
                  Full-featured cropper with advanced tools and precise controls.
                </p>
                <ul className="text-crd-lightGray text-sm space-y-1">
                  <li>• Multi-selection support</li>
                  <li>• Copy/paste/duplicate operations</li>
                  <li>• History with undo/redo</li>
                  <li>• Grid snapping and alignment</li>
                  <li>• Keyboard shortcuts</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload Section */}
        <Card className="bg-crd-darker border-crd-mediumGray mb-6">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Upload Your Image</h3>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-medium cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </label>
              <span className="text-crd-lightGray text-sm">
                Supports JPG, PNG, and other common formats
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sample Images */}
        <Card className="bg-crd-darker border-crd-mediumGray">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Or Try Sample Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border border-crd-mediumGray hover:border-crd-green transition-colors"
                  onClick={() => handleSampleImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-medium">
                      <Image className="w-4 h-4 mr-2" />
                      Test Cropper
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CropperDemo;
