
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowLeft, Upload, Grid, Palette, Download, Zap, CheckCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BatchCustomizer } from '@/components/crdmkr/BatchCustomizer';

type WorkflowStep = 'upload' | 'queue' | 'styling' | 'processing' | 'export';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export const BatchProcessingWorkflow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [batchSettings, setBatchSettings] = useState<any>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [completedFiles, setCompletedFiles] = useState<any[]>([]);

  const steps = [
    { id: 'upload', label: 'Multi-Upload', icon: Upload, description: 'Upload multiple files' },
    { id: 'queue', label: 'Review Queue', icon: Grid, description: 'Review uploaded files' },
    { id: 'styling', label: 'Batch Styling', icon: Palette, description: 'Apply consistent styling' },
    { id: 'processing', label: 'Process Batch', icon: Zap, description: 'Process all files' },
    { id: 'export', label: 'Batch Export', icon: Download, description: 'Download results' }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[getCurrentStepIndex()];

  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    if (files.length > 20) {
      toast.error('Maximum 20 files allowed per batch');
      return;
    }

    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0
    }));

    setUploadedFiles(newFiles);
    toast.success(`${files.length} files uploaded successfully!`);
    setCurrentStep('queue');
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.success('File removed from batch');
  };

  const handleApplyBatchStyling = () => {
    if (uploadedFiles.length === 0) {
      toast.error('No files to process');
      return;
    }
    setCurrentStep('styling');
  };

  const handleStartBatchProcessing = (settings: any) => {
    setBatchSettings(settings);
    setCurrentStep('processing');
    
    // Simulate batch processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setCompletedFiles(uploadedFiles.map(f => ({ ...f, status: 'completed' })));
        setCurrentStep('export');
        toast.success('Batch processing completed!');
      }
      setProcessingProgress(progress);
    }, 500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="text-center space-y-6">
            <div className="border-2 border-dashed border-crd-orange/30 rounded-xl h-96 flex flex-col items-center justify-center p-8 hover:border-crd-orange/50 transition-colors">
              <Grid className="w-16 h-16 text-crd-orange mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Batch File Upload</h3>
              <p className="text-crd-lightGray mb-6 max-w-md">
                Upload multiple images at once for batch processing. Apply consistent styling, 
                effects, and export all files together.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleFileUpload}
                className="hidden"
                id="batch-upload"
              />
              <label htmlFor="batch-upload">
                <CRDButton className="bg-gradient-to-r from-crd-orange to-crd-yellow text-black font-bold cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Multiple Files
                </CRDButton>
              </label>
              <p className="text-sm text-crd-mediumGray mt-4">
                Up to 20 files • Consistent styling • Batch export
              </p>
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Grid className="w-16 h-16 text-crd-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Review Upload Queue</h3>
              <p className="text-crd-lightGray">
                Review your uploaded files before applying batch styling
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedFiles.map((uploadedFile) => (
                <Card key={uploadedFile.id} className="bg-crd-darker border-crd-mediumGray/30 relative">
                  <CardContent className="p-2">
                    <button
                      onClick={() => handleRemoveFile(uploadedFile.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    <img
                      src={uploadedFile.preview}
                      alt="Upload preview"
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs text-crd-lightGray mt-1 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-crd-mediumGray">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-crd-darkGray rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-crd-white font-medium">{uploadedFiles.length} files ready</p>
                <p className="text-crd-lightGray text-sm">
                  Total size: {(uploadedFiles.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <CRDButton 
                onClick={handleApplyBatchStyling}
                className="bg-crd-orange text-black"
                disabled={uploadedFiles.length === 0}
              >
                Continue to Styling
              </CRDButton>
            </div>
          </div>
        );

      case 'styling':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Palette className="w-16 h-16 text-crd-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Batch Styling</h3>
              <p className="text-crd-lightGray">
                Apply consistent styling and effects to all {uploadedFiles.length} files
              </p>
            </div>

            <BatchCustomizer
              templateData={{ files: uploadedFiles }}
              onSettingsApplied={handleStartBatchProcessing}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-crd-orange/10 to-crd-yellow/10 border border-crd-orange/30 rounded-xl p-8">
              <Zap className="w-16 h-16 text-crd-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Processing Batch</h3>
              <p className="text-crd-lightGray mb-6">
                Processing {uploadedFiles.length} files with your selected styling...
              </p>
              
              <div className="max-w-md mx-auto mb-6">
                <Progress value={processingProgress} className="mb-4" />
                <p className="text-sm text-crd-mediumGray">
                  {Math.round(processingProgress)}% Complete • Processing {uploadedFiles.length} files
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Files Queued</h4>
                  <p className="text-2xl font-bold text-crd-orange">{uploadedFiles.length}</p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Completed</h4>
                  <p className="text-2xl font-bold text-crd-green">
                    {Math.floor((processingProgress / 100) * uploadedFiles.length)}
                  </p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Remaining</h4>
                  <p className="text-2xl font-bold text-crd-blue">
                    {uploadedFiles.length - Math.floor((processingProgress / 100) * uploadedFiles.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'export':
        return (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 to-crd-green/10 border border-green-500/30 rounded-xl p-8">
              <Download className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-crd-white mb-2">Batch Processing Complete!</h3>
              <p className="text-crd-lightGray mb-6">
                All {completedFiles.length} files have been processed and are ready for download
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Files Processed</h4>
                  <p className="text-2xl font-bold text-crd-green">{completedFiles.length}</p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Success Rate</h4>
                  <p className="text-2xl font-bold text-crd-blue">100%</p>
                </div>
                <div className="bg-crd-darker p-4 rounded-lg">
                  <h4 className="text-white font-medium">Total Size</h4>
                  <p className="text-2xl font-bold text-crd-orange">
                    {(completedFiles.reduce((sum, f) => sum + f.file.size, 0) / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <CRDButton className="bg-crd-green text-black">
                  <Download className="w-4 h-4 mr-2" />
                  Download All ({completedFiles.length} files)
                </CRDButton>
                <CRDButton 
                  variant="outline" 
                  onClick={() => navigate('/gallery')}
                  className="border-crd-orange/30 text-crd-orange"
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
                <h1 className="text-2xl font-bold text-crd-white">Batch Processing Workflow</h1>
                <p className="text-crd-lightGray">Process multiple files with consistent styling</p>
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
                    isActive ? 'bg-crd-orange/20 text-crd-orange' :
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
