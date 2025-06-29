
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Layers, Palette, Sparkles, ArrowRight, FileImage, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Import the new refactored components
import { PhotoDropzone } from '@/components/editor/unified/sections/components/PhotoDropzone';
import { PhotoPreview } from '@/components/editor/unified/sections/components/PhotoPreview';
import { UploadProgress } from '@/components/editor/unified/sections/components/UploadProgress';
import { AIToolsPanel } from '@/components/editor/unified/sections/components/AIToolsPanel';

export const CRDMKRLayout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAITools, setShowAITools] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);

  const steps = [
    { id: 'upload', label: 'Upload PSD/Image', icon: Upload },
    { id: 'layers', label: 'Extract Layers', icon: Layers },
    { id: 'analyze', label: 'AI Analysis', icon: Sparkles },
    { id: 'customize', label: 'Customize', icon: Palette },
    { id: 'export', label: 'Generate Template', icon: Download }
  ];

  const handleFileSelect = async (file: File) => {
    console.log('📁 Processing file in CRDMKR:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);
    setActiveStep(1);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // Create object URL for preview  
      const imageUrl = URL.createObjectURL(file);
      setUploadedFile(imageUrl);

      // Simulate AI analysis for CRDMKR
      setTimeout(() => {
        setImageAnalysis({
          layers: ['Background', 'Border', 'Text Layer', 'Logo Placeholder'],
          regions: ['Photo Area', 'Title Zone', 'Stats Box', 'Team Logo'],
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
          suggestedTemplate: 'sports-card-pro',
          confidence: 92,
          detectedText: 'Trading Card Template Detected',
          templateType: 'PSD Layer Structure'
        });
        setUploadProgress(100);
        setShowAITools(true);
        setActiveStep(2);
        clearInterval(progressInterval);
        toast.success('PSD file processed and analyzed!');
      }, 2500);

    } catch (error) {
      console.error('CRDMKR processing error:', error);
      toast.error('Failed to process file');
      setActiveStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceFile = () => {
    setUploadedFile(null);
    setShowAITools(false);
    setImageAnalysis(null);
    setActiveStep(0);
    setUploadProgress(0);
  };

  const handleAIEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Template enhanced with AI optimizations!');
    }, 1500);
  };

  const handleCreateTemplate = () => {
    setActiveStep(3);
    toast.info('Template generation started!');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">
              CRDMKR Template Generator
            </h1>
            <p className="text-crd-lightGray">
              Transform PSD files into customizable card templates with AI-powered analysis
            </p>
          </div>
          <Link to="/create">
            <CRDButton variant="outline" className="flex items-center gap-2">
              Back to Creator
              <ArrowRight className="w-4 h-4" />
            </CRDButton>
          </Link>
        </div>

        {/* Process Steps */}
        <div className="flex items-center justify-between bg-crd-darker p-4 rounded-lg overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-crd-green/20 text-crd-green' :
                  isCompleted ? 'bg-green-500/20 text-green-400' :
                  'text-crd-lightGray'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium whitespace-nowrap">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-crd-mediumGray mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <Card className="bg-crd-darker border-crd-mediumGray/20 min-h-[600px]">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {uploadedFile ? 'Design File Processing' : 'Upload Design File'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {isProcessing ? (
                <div className="flex items-center justify-center h-full">
                  <UploadProgress progress={uploadProgress} />
                </div>
              ) : uploadedFile ? (
                <div className="space-y-6">
                  <PhotoPreview 
                    imageUrl={uploadedFile}
                    onReplace={handleReplaceFile}
                  />
                  
                  {showAITools && imageAnalysis && (
                    <div className="space-y-4">
                      <AIToolsPanel
                        analysisData={imageAnalysis}
                        onEnhance={handleAIEnhance}
                        onCreateFromPSD={handleCreateTemplate}
                      />
                      
                      {/* CRDMKR Specific Analysis */}
                      <Card className="bg-crd-mediumGray/10 border-crd-mediumGray/20">
                        <CardContent className="p-4">
                          <h4 className="text-crd-white font-medium mb-3">Layer Analysis</h4>
                          <div className="space-y-2">
                            {imageAnalysis.layers?.map((layer: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Layers className="w-4 h-4 text-crd-green" />
                                <span className="text-crd-lightGray">{layer}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <PhotoDropzone 
                  onFileSelect={handleFileSelect}
                  disabled={isProcessing}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Processing Status & Preview */}
        <div className="space-y-6">
          {/* Processing Status */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Sparkles className="w-6 h-6 text-crd-green" />
                  </div>
                  <p className="text-crd-lightGray">Processing your design file...</p>
                </div>
              ) : uploadedFile && imageAnalysis ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-crd-green">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Complete</span>
                  </div>
                  <div className="text-xs text-crd-lightGray">
                    Confidence: {imageAnalysis.confidence}%
                  </div>
                  <div className="text-xs text-crd-lightGray">
                    {imageAnalysis.layers?.length || 0} layers detected
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-crd-mediumGray" />
                  </div>
                  <p className="text-crd-lightGray">Ready to process your design file</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[5/7] bg-crd-mediumGray/10 rounded-lg flex items-center justify-center">
                {uploadedFile ? (
                  <img 
                    src={uploadedFile} 
                    alt="Template preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Palette className="w-8 h-8 text-crd-mediumGray mx-auto mb-2" />
                    <p className="text-crd-mediumGray text-sm">Preview will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CRDButton 
                variant="outline" 
                className="w-full justify-start" 
                disabled={!imageAnalysis}
                onClick={() => toast.info('Layer viewer coming soon!')}
              >
                <Layers className="w-4 h-4 mr-2" />
                View Layers
              </CRDButton>
              <CRDButton 
                variant="outline" 
                className="w-full justify-start" 
                disabled={!imageAnalysis}
                onClick={handleAIEnhance}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis
              </CRDButton>
              <CRDButton 
                variant="outline" 
                className="w-full justify-start" 
                disabled={!showAITools}
                onClick={handleCreateTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </CRDButton>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-crd-white mb-6">How CRDMKR Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Upload className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Smart Upload</h3>
              <p className="text-sm text-crd-lightGray">
                Upload PSD files or images and we'll automatically extract all layers and elements
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 text-crd-blue mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">AI Analysis</h3>
              <p className="text-sm text-crd-lightGray">
                Our AI identifies card regions, text zones, and design elements automatically
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Palette className="w-8 h-8 text-crd-orange mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Team Customization</h3>
              <p className="text-sm text-crd-lightGray">
                Generate variations with different team colors, logos, and branding
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="font-semibold text-crd-white mb-2">Export Ready</h3>
              <p className="text-sm text-crd-lightGray">
                Get clean SVG templates that integrate seamlessly with your card creator
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
