
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Layers, Palette, Sparkles, ArrowRight, FileImage, Download, Brain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnalysisDashboard } from './analysis/AnalysisDashboard';
import { AdvancedRegionMapper } from './regions/AdvancedRegionMapper';
import { LiveTemplateEditor } from './templates/LiveTemplateEditor';
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
    { id: 'upload', label: 'Upload & Analyze', icon: Upload },
    { id: 'regions', label: 'Map Regions', icon: Layers },
    { id: 'customize', label: 'Live Editor', icon: Palette },
    { id: 'teams', label: 'Team Assets', icon: Users },
    { id: 'batch', label: 'Batch Generate', icon: Sparkles },
    { id: 'export', label: 'Export', icon: Download }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File uploaded:', file.name);
    setUploadedFile(file);
    
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    toast.success('File uploaded successfully! Starting AI analysis...');
    
    // Auto-start analysis
    try {
      const result = await analyzeImage(url);
      if (result) {
        setAnalysisResult(result);
        setDetectedRegions(result.regions);
        setActiveStep(1); // Move to regions step
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
    setActiveStep(3); // Move to team assets step
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Upload & Analyze
        return (
          <div className="space-y-6">
            {!imageUrl ? (
              <div className="border-2 border-dashed border-crd-mediumGray/30 rounded-lg h-96 flex flex-col items-center justify-center p-8 hover:border-crd-green/50 transition-colors cursor-pointer">
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
            ) : (
              <AnalysisDashboard
                result={analysisResult}
                isAnalyzing={isAnalyzing}
                progress={progress}
              />
            )}
          </div>
        );

      case 1: // Regions
        return (
          <AdvancedRegionMapper
            imageUrl={imageUrl}
            detectedRegions={detectedRegions}
            onRegionsUpdate={handleRegionsUpdate}
          />
        );

      case 2: // Customize
        return (
          <LiveTemplateEditor
            imageUrl={imageUrl}
            detectedRegions={detectedRegions}
            onTemplateGenerated={handleTemplateGenerated}
          />
        );

      case 3: // Team Assets
        return (
          <TeamAssetManager
            selectedTeamId={selectedTeamId}
            onTeamSelect={setSelectedTeamId}
          />
        );

      case 4: // Batch Generate
        return (
          <BatchCustomizer
            templateData={generatedTemplate}
          />
        );

      case 5: // Export
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">
              CRDMKR 2.0
            </h1>
            <p className="text-crd-lightGray">
              Professional AI-powered template generation with advanced region mapping and real-time customization
            </p>
          </div>
          <Link to="/create">
            <CRDButton variant="outline" className="flex items-center gap-2">
              Back to Creator
              <ArrowRight className="w-4 h-4" />
            </CRDButton>
          </Link>
        </div>

        {/* Modern Step Navigation */}
        <div className="relative">
          <div className="flex items-center justify-between bg-gradient-to-r from-crd-darker to-crd-mediumGray/20 p-1 rounded-xl border border-crd-mediumGray/20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (isCompleted || index <= activeStep) {
                      setActiveStep(index);
                    }
                  }}
                  className={`flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-crd-green text-black shadow-lg scale-105' 
                      : isCompleted 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'text-crd-lightGray hover:text-crd-white hover:bg-crd-mediumGray/10'
                  }`}
                  disabled={index > activeStep && !isCompleted}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{step.label}</span>
                  {isCompleted && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[600px] bg-crd-darker rounded-xl border border-crd-mediumGray/20 p-6">
        {renderStepContent()}
      </div>

      {/* Enhanced Status Bar */}
      {uploadedFile && (
        <div className="mt-6 bg-gradient-to-r from-crd-darker to-crd-mediumGray/20 border border-crd-mediumGray/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse" />
                <span className="text-sm text-crd-lightGray">
                  <span className="text-crd-white font-medium">{uploadedFile.name}</span>
                  <span className="ml-2">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </span>
              </div>
              
              {analysisResult && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-crd-lightGray">
                    Regions: <span className="text-crd-white font-medium">{detectedRegions.length}</span>
                  </div>
                  <div className="text-crd-lightGray">
                    Confidence: <span className="text-crd-green font-medium">{analysisResult.confidence}%</span>
                  </div>
                  <div className="text-crd-lightGray">
                    Type: <span className="text-crd-white font-medium">{analysisResult.contentType}</span>
                  </div>
                  <div className="text-crd-lightGray">
                    Quality: <span className="text-crd-white font-medium">{analysisResult.quality}/100</span>
                  </div>
                </div>
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
