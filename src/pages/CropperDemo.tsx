import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, Image, Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<Array<{timestamp: string, type: string, message: string}>>([]);

  // Use the same card images from the home page - fixed paths without leading slash
  const sampleImages = [
    'lovable-uploads/22ce728b-dbf0-4534-8ee2-2c79bbe6c0de.png', // Cardshow Retro
    'lovable-uploads/356f5580-958c-4da6-9c36-b9931367a794.png', // Cardshow Block Letters
    'lovable-uploads/68c31062-5697-489f-a2f1-8ff47d5f5c1e.png', // Cardshow Vintage
    'lovable-uploads/ffcc3926-a637-4938-a3d6-6b0b366e95d4.png', // Cardshow Green
    'lovable-uploads/5e4b9905-1b9a-481e-b51d-9cf0bda7ff0f.png', // Cardshow Orange
    'lovable-uploads/c01b5d86-d51b-4123-98b4-cb77936462cb.png'  // Cardshow Blue
  ];

  const sampleImageLabels = [
    'Retro Sports Card',
    'Block Letter Design',
    'Vintage Style Card',
    'Green Theme Card',
    'Orange Theme Card',
    'Blue Theme Card'
  ];

  const addDebugLog = (type: string, message: string) => {
    const log = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setDebugLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addDebugLog('INFO', `File selected: ${file.name} (${file.size} bytes, ${file.type})`);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addDebugLog('ERROR', 'Invalid file type - must be an image');
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        addDebugLog('ERROR', 'File too large - must be under 10MB');
        toast.error('File must be under 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setShowCropper(true);
        addDebugLog('SUCCESS', 'Image loaded successfully');
        toast.success('Image loaded successfully');
      };
      reader.onerror = () => {
        addDebugLog('ERROR', 'Failed to read file');
        toast.error('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleImageSelect = (imageUrl: string) => {
    addDebugLog('INFO', `Sample image selected: ${imageUrl}`);
    setSelectedImage(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (crops: { main?: string; frame?: string; elements?: string[] }) => {
    console.log('Crop results:', crops);
    const cropCount = Object.keys(crops).length;
    addDebugLog('SUCCESS', `Crop extraction completed: ${cropCount} areas extracted`);
    toast.success(`Successfully extracted ${cropCount} crop areas!`);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    addDebugLog('INFO', 'Crop operation cancelled');
    setShowCropper(false);
  };

  // Feature verification
  const featureTests = [
    { name: 'Template Guides', status: 'implemented', description: '2.5×3.5 card template overlay' },
    { name: 'Background Dimming', status: 'implemented', description: 'Dims areas outside crop regions' },
    { name: 'Big Action Buttons', status: 'implemented', description: 'Frame and Element creation buttons' },
    { name: 'Layer Management', status: 'implemented', description: 'Stacked layer sidebar with controls' },
    { name: 'Card Preview', status: 'implemented', description: 'Real-time card preview panel' },
    { name: 'Multi-Selection', status: 'implemented', description: 'Select multiple crop areas' },
    { name: 'Copy/Paste', status: 'implemented', description: 'Clipboard operations for crops' },
    { name: 'Undo/Redo', status: 'implemented', description: 'History management' },
    { name: 'Grid Snapping', status: 'implemented', description: 'Snap to grid alignment' },
    { name: 'Keyboard Shortcuts', status: 'implemented', description: 'Ctrl+Z, Ctrl+C, etc.' },
    { name: 'File Upload', status: 'fixed', description: 'Choose image button functionality' },
    { name: 'Sample Images', status: 'fixed', description: 'Working sample image paths' }
  ];

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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Advanced Cropper Demo</h1>
          <p className="text-crd-lightGray">
            Test the enhanced template-aware cropper with sample images or upload your own
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => setDebugMode(!debugMode)}
              variant="outline"
              className="bg-crd-darkGray border-crd-mediumGray text-white hover:bg-crd-mediumGray"
            >
              <Bug className="w-4 h-4 mr-2" />
              {debugMode ? 'Hide Debug' : 'Show Debug'}
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-crd-darker">
            <TabsTrigger value="streamlined" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Template-Aware Cropper
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-white data-[state=active]:bg-crd-orange data-[state=active]:text-black">
              Advanced Cropper
            </TabsTrigger>
            {debugMode && (
              <TabsTrigger value="debug" className="text-white data-[state=active]:bg-crd-blue data-[state=active]:text-black">
                Debug & Monitor
              </TabsTrigger>
            )}
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

          {debugMode && (
            <TabsContent value="debug" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Feature Status */}
                <Card className="bg-crd-darker border-crd-mediumGray">
                  <CardContent className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">Feature Status</h3>
                    <div className="space-y-3">
                      {featureTests.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-crd-darkGray rounded-lg">
                          <div>
                            <p className="text-white font-medium">{feature.name}</p>
                            <p className="text-crd-lightGray text-sm">{feature.description}</p>
                          </div>
                          <div className="flex items-center">
                            {feature.status === 'implemented' && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {feature.status === 'fixed' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                            {feature.status === 'missing' && <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Debug Logs */}
                <Card className="bg-crd-darker border-crd-mediumGray">
                  <CardContent className="p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">Debug Logs</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {debugLogs.map((log, index) => (
                        <div key={index} className={`p-2 rounded text-sm ${
                          log.type === 'ERROR' ? 'bg-red-900/30 text-red-300' :
                          log.type === 'SUCCESS' ? 'bg-green-900/30 text-green-300' :
                          'bg-crd-darkGray text-crd-lightGray'
                        }`}>
                          <span className="font-mono text-xs opacity-70">[{log.timestamp}]</span>
                          <span className="ml-2">{log.message}</span>
                        </div>
                      ))}
                      {debugLogs.length === 0 && (
                        <p className="text-crd-lightGray text-center py-4">No logs yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
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
                Supports JPG, PNG, and other common formats (max 10MB)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sample Images */}
        <Card className="bg-crd-darker border-crd-mediumGray">
          <CardContent className="p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Try Sample Card Designs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border border-crd-mediumGray hover:border-crd-green transition-colors"
                  onClick={() => handleSampleImageSelect(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={sampleImageLabels[index]}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      addDebugLog('ERROR', `Failed to load sample image: ${imageUrl}`);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      addDebugLog('INFO', `Sample image loaded: ${imageUrl}`);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button className="bg-crd-green hover:bg-crd-green/90 text-black font-medium">
                      <Image className="w-4 h-4 mr-2" />
                      Test Cropper
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {sampleImageLabels[index]}
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
