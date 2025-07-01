
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Layers, 
  Eye, 
  Settings, 
  Download,
  FileImage,
  Zap,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { BatchCustomizer } from '@/components/crdmkr/BatchCustomizer';

interface CRDElementsInterfaceProps {
  onProcessComplete: () => void;
}

type ProcessingStep = 'upload' | 'extract' | 'analyze' | 'generate' | 'customize' | 'complete';

export const CRDElementsInterface = ({ onProcessComplete }: CRDElementsInterfaceProps) => {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [extractedLayers, setExtractedLayers] = useState<any[]>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState<any>(null);

  const steps = [
    { id: 'upload' as const, label: 'Upload PSD', icon: Upload, description: 'Upload Photoshop file' },
    { id: 'extract' as const, label: 'Extract Layers', icon: Layers, description: 'Process PSD layers' },
    { id: 'analyze' as const, label: 'AI Analysis', icon: Eye, description: 'Analyze design elements' },
    { id: 'generate' as const, label: 'Generate Template', icon: Settings, description: 'Create template' },
    { id: 'customize' as const, label: 'Team Customization', icon: Zap, description: 'Apply team branding' },
    { id: 'complete' as const, label: 'Complete', icon: Check, description: 'Finalize template' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please upload a PSD file');
      return;
    }

    setUploadedFile(file);
    setProgress(15);
    toast.success('PSD file uploaded successfully!');
    setTimeout(() => {
      setCurrentStep('extract');
      simulateProcessing();
    }, 1000);
  };

  const simulateProcessing = () => {
    // Simulate layer extraction
    setTimeout(() => {
      setProgress(35);
      setExtractedLayers([
        { id: 1, name: 'Background', type: 'raster' },
        { id: 2, name: 'Player Photo', type: 'image' },
        { id: 3, name: 'Team Logo', type: 'vector' },
        { id: 4, name: 'Name Text', type: 'text' },
        { id: 5, name: 'Stats Box', type: 'shape' }
      ]);
      setCurrentStep('analyze');
      toast.success('Layers extracted successfully!');
    }, 2000);

    // Simulate AI analysis
    setTimeout(() => {
      setProgress(60);
      setCurrentStep('generate');
      toast.success('AI analysis completed!');
    }, 4000);

    // Simulate template generation
    setTimeout(() => {
      setProgress(80);
      setGeneratedTemplate({
        id: 'generated-template',
        name: 'Custom PSD Template',
        layers: extractedLayers,
        parameters: ['team_logo', 'player_name', 'team_colors']
      });
      setCurrentStep('customize');
      toast.success('Template generated successfully!');
    }, 6000);
  };

  const handleCustomizationComplete = () => {
    setProgress(100);
    setCurrentStep('complete');
    toast.success('PSD processing workflow completed!');
    setTimeout(() => {
      onProcessComplete();
    }, 1500);
  };

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crd-white mb-4">PSD Processing Workflow</h2>
        <p className="text-crd-lightGray">
          Advanced Photoshop file processing with layer extraction and template generation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = getCurrentStepIndex() > index;
          
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
                  {isActive && (
                    <p className="text-xs opacity-70">{step.description}</p>
                  )}
                </div>
                {isCompleted && (
                  <Check className="w-4 h-4" />
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

      <Progress value={progress} className="h-2" />

      {/* Step Content */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-8">
          {currentStep === 'upload' && (
            <div className="text-center space-y-6">
              <div className="border-2 border-dashed border-crd-green/30 rounded-xl h-64 flex flex-col items-center justify-center">
                <Upload className="w-16 h-16 text-crd-green mb-4" />
                <h3 className="text-xl font-bold text-crd-white mb-2">Upload PSD File</h3>
                <p className="text-crd-lightGray mb-6">
                  Upload your Photoshop PSD file for professional processing
                </p>
                <input
                  type="file"
                  accept=".psd"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="psd-upload"
                />
                <label htmlFor="psd-upload">
                  <CRDButton className="bg-crd-green text-black cursor-pointer">
                    <FileImage className="w-4 h-4 mr-2" />
                    Choose PSD File
                  </CRDButton>
                </label>
              </div>
            </div>
          )}

          {currentStep === 'extract' && (
            <div className="text-center space-y-6">
              <Layers className="w-16 h-16 text-crd-blue mx-auto" />
              <h3 className="text-xl font-bold text-crd-white">Extracting Layers</h3>
              <p className="text-crd-lightGray">
                Processing your PSD file and extracting individual layers...
              </p>
              <div className="animate-pulse">
                <Progress value={35} className="mb-2" />
                <p className="text-sm text-crd-lightGray">Analyzing layer structure...</p>
              </div>
            </div>
          )}

          {currentStep === 'analyze' && (
            <div className="text-center space-y-6">
              <Eye className="w-16 h-16 text-crd-orange mx-auto" />
              <h3 className="text-xl font-bold text-crd-white">AI Design Analysis</h3>
              <p className="text-crd-lightGray">
                Our AI is analyzing your design elements and identifying card regions...
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {extractedLayers.map((layer) => (
                  <div key={layer.id} className="bg-crd-darkest p-3 rounded-lg">
                    <Badge variant="outline" className="text-xs mb-2">{layer.type}</Badge>
                    <p className="text-crd-white text-sm">{layer.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'generate' && (
            <div className="text-center space-y-6">
              <Settings className="w-16 h-16 text-crd-green mx-auto animate-spin" />
              <h3 className="text-xl font-bold text-crd-white">Generating Template</h3>
              <p className="text-crd-lightGray">
                Creating a customizable template from your PSD layers...
              </p>
              <Progress value={80} className="mb-2" />
              <p className="text-sm text-crd-lightGray">Building template structure...</p>
            </div>
          )}

          {currentStep === 'customize' && generatedTemplate && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-crd-white mb-2">Team Customization</h3>
                <p className="text-crd-lightGray">
                  Apply team branding and colors to your generated template
                </p>
              </div>
              
              <BatchCustomizer
                templateData={generatedTemplate}
                onSettingsApplied={handleCustomizationComplete}
              />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-crd-white">Processing Complete!</h3>
              <p className="text-crd-lightGray">
                Your PSD has been successfully processed and converted into a customizable template.
              </p>
              <div className="flex gap-4 justify-center">
                <CRDButton className="bg-crd-green text-black">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </CRDButton>
                <CRDButton variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Template
                </CRDButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
