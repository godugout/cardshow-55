
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, Upload, Layers, Download, Eye, Settings, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PSDLayerManager } from '@/components/editor/unified/sections/components/PSDLayerManager';
import { AdvancedRegionMapper } from '@/components/crdmkr/regions/AdvancedRegionMapper';
import { TeamAssetManager } from '@/components/crdmkr/TeamAssetManager';
import type { DetectedRegion } from '@/types/crdmkr';

type WorkflowStep = 'upload' | 'layers' | 'regions' | 'template' | 'teams' | 'export';

export const PSDProfessionalWorkflow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedLayers, setExtractedLayers] = useState<any[]>([]);
  const [detectedRegions, setDetectedRegions] = useState<DetectedRegion[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 'upload', label: 'Upload PSD', icon: Upload, description: 'Upload your Photoshop file' },
    { id: 'layers', label: 'Extract Layers', icon: Layers, description: 'Extract and manage PSD layers' },
    { id: 'regions', label: 'Map Regions', icon: Eye, description: 'Define card regions and zones' },
    { id: 'template', label: 'Generate Template', icon: Settings, description: 'Create customizable template' },
    { id: 'teams', label: 'Team Assets', icon: Users, description: 'Apply team branding' },
    { id: 'export', label: 'Export', icon: Download, description: 'Download templates' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[getCurrentStepIndex()];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please upload a PSD file');
      return;
    }

    setUploadedFile(file);
    setProgress(20);
    toast.success('PSD file uploaded successfully!');
    setCurrentStep('layers');
  };

  const handleLayersExtracted = (layers: any[]) => {
    setExtractedLayers(layers);
    setProgress(40);
    toast.success(`Extracted ${layers.length} layers from PSD`);
    setCurrentStep('regions');
  };

  const handleRegionsDetected = (regions: DetectedRegion[]) => {
    setDetectedRegions(regions);
    setProgress(60);
    toast.success(`Mapped ${regions.length} card regions`);
    setCurrentStep('template');
  };

  const handleTemplateGenerated = (template: any) => {
    setGeneratedTemplate(template);
    setProgress(80);
    toast.success('Custom template generated successfully!');
    setCurrentStep('teams');
  };

  const handleTeamAssetsApplied = () => {
    setProgress(100);
    toast.success('Team assets applied successfully!');
    setCurrentStep('export');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="text-center space-y-6">
            <div className="border-2 border-dashed border-crd-green/30 rounded-xl h-96 flex flex-col items-center justify-center p-8 hover:border-crd-green/50 transition-colors">
              <Upload className="w-16 h-16 text-crd-green mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Upload Your PSD File</h3>
              <p className="text-crd-lightGray mb-6 max-w-md">
                Upload a Photoshop PSD file to extract layers and create professional card templates. 
                Supports files up to 200MB with full layer preservation.
              </p>
              <input
                type="file"
                accept=".psd"
                onChange={handleFileUpload}
                className="hidden"
                id="psd-upload"
              />
              <label htmlFor="psd-upload">
                <CRDButton className="bg-gradient-to-r from-crd-green to-crd-blue text-black font-bold cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose PSD File
                </CRDButton>
              </label>
              <p className="text-sm text-crd-mediumGray mt-4">
                Professional layer extraction • Custom regions • Team variations
              </p>
            </div>
          </div>
        );

      case 'layers':
        return uploadedFile ? (
          <PSDLayerManager
            psdFile={uploadedFile}
            onFrameGenerated={handleLayersExtracted}
            onCancel={() => setCurrentStep('upload')}
          />
        ) : null;

      case 'regions':
        return (
          <AdvancedRegionMapper
            imageUrl={uploadedFile ? URL.createObjectURL(uploadedFile) : ''}
            detectedRegions={detectedRegions}
            onRegionsUpdate={handleRegionsDetected}
          />
        );

      case 'template':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-crd-green/10 to-crd-blue/10 border border-crd-green/30 rounded-xl p-8">
              <Settings className="w-16 h-16 text-crd-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Generating Template</h3>
              <p className="text-crd-lightGray mb-6">
                Creating a customizable template from your PSD layers and region mappings...
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={75} className="mb-4" />
                <p className="text-sm text-crd-mediumGray">Processing layers and generating template structure</p>
              </div>
              <CRDButton 
                onClick={() => handleTemplateGenerated({ id: 'generated-template' })}
                className="mt-6 bg-crd-green text-black"
              >
                Continue to Team Assets
              </CRDButton>
            </div>
          </div>
        );

      case 'teams':
        return (
          <div className="space-y-6">
            <TeamAssetManager
              selectedTeamId={selectedTeamId}
              onTeamSelect={setSelectedTeamId}
            />
            <div className="text-center">
              <CRDButton 
                onClick={handleTeamAssetsApplied}
                className="bg-crd-green text-black"
                disabled={!selectedTeamId}
              >
                Apply Team Assets & Continue
              </CRDButton>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 to-crd-green/10 border border-green-500/30 rounded-xl p-8">
              <Download className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Templates Ready!</h3>
              <p className="text-crd-lightGray mb-6">
                Your professional PSD-based templates have been generated and are ready for use.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Layers Extracted</h4>
                  <p className="text-2xl font-bold text-crd-green">{extractedLayers.length}</p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Regions Mapped</h4>
                  <p className="text-2xl font-bold text-crd-blue">{detectedRegions.length}</p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Templates Created</h4>
                  <p className="text-2xl font-bold text-crd-orange">1</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <CRDButton className="bg-crd-green text-black">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Templates
                </CRDButton>
                <CRDButton 
                  variant="outline" 
                  onClick={() => navigate('/gallery')}
                  className="border-crd-green/30 text-crd-green"
                >
                  View in Gallery
                </CRDButton>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CRDButton
                variant="outline"
                onClick={() => navigate('/crdmkr')}
                className="border-crd-mediumGray/30 text-crd-lightGray hover:text-crd-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to CRDMKR
              </CRDButton>
              <div>
                <h1 className="text-2xl font-bold text-crd-white">PSD Professional Workflow</h1>
                <p className="text-crd-lightGray">Extract layers, map regions, generate templates</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
              Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              const isCurrent = getCurrentStepIndex() === index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-crd-green/20 text-crd-green' :
                    isCompleted ? 'bg-green-500/20 text-green-400' :
                    'text-crd-mediumGray'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium text-sm">{step.label}</p>
                      {isCurrent && (
                        <p className="text-xs opacity-70">{step.description}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-400' : 'bg-crd-mediumGray/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-crd-lightGray mt-2">
              {currentStepData.description} • {progress}% Complete
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
