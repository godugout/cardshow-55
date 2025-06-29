
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Layers, Palette, Sparkles, ArrowRight, FileImage, Download, Brain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegionMapper } from './RegionMapper';
import { HybridTemplateEditor } from './HybridTemplateEditor';
import { TeamAssetManager } from './TeamAssetManager';
import { BatchCustomizer } from './BatchCustomizer';
import { useFreeAIAnalysis } from '@/hooks/useFreeAIAnalysis';
import { toast } from 'sonner';
import type { DetectedRegion } from '@/types/crdmkr';

export const CRDMKRLayout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [detectedRegions, setDetectedRegions] = useState<DetectedRegion[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { analyzeImage, isAnalyzing, progress } = useFreeAIAnalysis();

  const steps = [
    { id: 'upload', label: 'Upload PSD/Image', icon: Upload },
    { id: 'analyze', label: 'AI Analysis', icon: Brain },
    { id: 'regions', label: 'Map Regions', icon: Layers },
    { id: 'customize', label: 'Customize', icon: Palette },
    { id: 'teams', label: 'Team Assets', icon: Users },
    { id: 'batch', label: 'Batch Generate', icon: Sparkles },
    { id: 'export', label: 'Export', icon: Download }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File uploaded:', file.name);
    setUploadedFile(file);
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    // Move to analysis step
    setActiveStep(1);
    
    toast.success('File uploaded successfully!');
  };

  const handleStartAnalysis = async () => {
    if (!imageUrl) return;
    
    try {
      const result = await analyzeImage(imageUrl);
      
      if (result) {
        setAnalysisResult(result);
        setDetectedRegions(result.regions);
        setActiveStep(2); // Move to regions step
        
        console.log('🎯 Real analysis results:', result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    }
  };

  const handleRegionsUpdate = (regions: DetectedRegion[]) => {
    setDetectedRegions(regions);
  };

  const handleTemplateGenerated = (templateData: any) => {
    setGeneratedTemplate(templateData);
    setActiveStep(4); // Move to team assets step
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Upload
        return (
          <div className="border-2 border-dashed border-crd-mediumGray/30 rounded-lg h-full flex flex-col items-center justify-center p-8 hover:border-crd-green/50 transition-colors cursor-pointer">
            <div className="text-center">
              <FileImage className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-crd-white mb-2">
                Drop your PSD or image file here
              </h3>
              <p className="text-crd-lightGray mb-6 max-w-md">
                Upload a Photoshop PSD file or high-resolution image to start creating your template. 
                We support files up to 100MB.
              </p>
              <CRDButton variant="primary" className="mb-4">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </CRDButton>
              <p className="text-sm text-crd-mediumGray">
                Supported: .psd, .png, .jpg, .jpeg
              </p>
            </div>
            <input
              type="file"
              accept=".psd,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        );

      case 1: // Analysis
        return (
          <div className="h-full flex flex-col items-center justify-center p-8">
            {!isAnalyzing ? (
              <div className="text-center">
                <Brain className="w-16 h-16 text-crd-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-crd-white mb-2">
                  Ready for AI Analysis
                </h3>
                <p className="text-crd-lightGray mb-6 max-w-md">
                  Our AI will analyze your image to identify card regions, text areas, and design elements automatically.
                </p>
                <CRDButton variant="primary" onClick={handleStartAnalysis}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Analysis
                </CRDButton>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-crd-green animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-crd-white mb-2">
                  Analyzing Image...
                </h3>
                <p className="text-crd-lightGray mb-4">
                  AI is detecting regions and design elements
                </p>
                <div className="w-64 bg-crd-mediumGray/20 rounded-full h-2 mx-auto">
                  <div 
                    className="bg-crd-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-crd-mediumGray text-sm mt-2">{progress}% complete</p>
              </div>
            )}
          </div>
        );

      case 2: // Regions
        return (
          <RegionMapper
            imageUrl={imageUrl}
            detectedRegions={detectedRegions}
            onRegionsUpdate={handleRegionsUpdate}
          />
        );

      case 3: // Customize
        return (
          <HybridTemplateEditor
            imageUrl={imageUrl}
            detectedRegions={detectedRegions}
            onTemplateGenerated={handleTemplateGenerated}
          />
        );

      case 4: // Team Assets
        return (
          <TeamAssetManager
            selectedTeamId={selectedTeamId}
            onTeamSelect={setSelectedTeamId}
          />
        );

      case 5: // Batch Generate
        return (
          <BatchCustomizer
            templateData={generatedTemplate}
          />
        );

      case 6: // Export
        return (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-md">
              <Download className="w-16 h-16 text-crd-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-crd-white mb-2">
                Templates Ready!
              </h3>
              <p className="text-crd-lightGray mb-6">
                Your team-specific card templates have been generated and are ready for use. You can now integrate them with your card creation workflow.
              </p>
              <div className="flex gap-3 justify-center">
                <CRDButton variant="primary">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </CRDButton>
                <CRDButton variant="outline">
                  View in Gallery
                </CRDButton>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-crd-lightGray">Step {activeStep + 1} coming soon...</p>
          </div>
        );
    }
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
              Transform PSD files into customizable card templates with AI-powered analysis and team customization
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
              <div key={step.id} className="flex items-center whitespace-nowrap">
                <div 
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'bg-crd-green/20 text-crd-green' :
                    isCompleted ? 'bg-green-500/20 text-green-400' :
                    'text-crd-lightGray hover:text-crd-white'
                  }`}
                  onClick={() => {
                    if (isCompleted || index <= activeStep) {
                      setActiveStep(index);
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-crd-mediumGray mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderStepContent()}
      </div>

      {/* Status Bar with Real Analysis Results */}
      {uploadedFile && (
        <div className="mt-8 bg-crd-darker p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-crd-lightGray">
                File: <span className="text-crd-white">{uploadedFile.name}</span>
              </div>
              <div className="text-sm text-crd-lightGray">
                Size: <span className="text-crd-white">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="text-sm text-crd-lightGray">
                Regions: <span className="text-crd-white">{detectedRegions.length}</span>
              </div>
              {analysisResult && (
                <>
                  <div className="text-sm text-crd-lightGray">
                    Confidence: <span className="text-crd-white">{analysisResult.confidence}%</span>
                  </div>
                  <div className="text-sm text-crd-lightGray">
                    Type: <span className="text-crd-white">{analysisResult.contentType}</span>
                  </div>
                  <div className="text-sm text-crd-lightGray">
                    Rarity: <span className="text-crd-white">{analysisResult.suggestedRarity}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <CRDButton
                size="sm"
                variant="outline"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
              >
                Previous
              </CRDButton>
              <CRDButton
                size="sm"
                variant="primary"
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
              >
                Next
              </CRDButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
