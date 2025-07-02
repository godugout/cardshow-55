import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, Layers, Wand2, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface CRDElementsInterfaceProps {
  onComplete?: (processedData: any) => void;
  onCancel?: () => void;
}

type ProcessingStep = 'upload' | 'analyzing' | 'extracting' | 'complete';

interface ProcessingState {
  step: ProcessingStep;
  progress: number;
  uploadedFile: File | null;
  extractedLayers: any[];
  processedElements: any[];
}

export const CRDElementsInterface: React.FC<CRDElementsInterfaceProps> = ({
  onComplete,
  onCancel,
}) => {
  const [state, setState] = useState<ProcessingState>({
    step: 'upload',
    progress: 0,
    uploadedFile: null,
    extractedLayers: [],
    processedElements: [],
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if it's a PSD file
    if (!file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please upload a PSD file');
      return;
    }

    setState(prev => ({
      ...prev,
      uploadedFile: file,
      step: 'analyzing',
      progress: 10,
    }));

    toast.success('PSD file uploaded successfully!');
    
    // Simulate processing steps
    await simulateProcessing();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.psd'],
      'image/vnd.adobe.photoshop': ['.psd'],
    },
    multiple: false,
  });

  const simulateProcessing = async () => {
    // Simulate analyzing phase
    setState(prev => ({ ...prev, step: 'analyzing', progress: 25 }));
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate extraction phase
    setState(prev => ({ ...prev, step: 'extracting', progress: 50 }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock extracted layers
    const mockLayers = [
      { id: 'bg', name: 'Background', type: 'background', visible: true },
      { id: 'border', name: 'Card Border', type: 'decoration', visible: true },
      { id: 'frame', name: 'Inner Frame', type: 'frame', visible: true },
      { id: 'text1', name: 'Title Text', type: 'text', visible: true },
      { id: 'text2', name: 'Description', type: 'text', visible: true },
      { id: 'logo', name: 'Team Logo', type: 'image', visible: true },
      { id: 'pattern', name: 'Pattern Overlay', type: 'decoration', visible: false },
    ];

    setState(prev => ({ 
      ...prev, 
      extractedLayers: mockLayers,
      progress: 75 
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Complete processing
    setState(prev => ({ 
      ...prev, 
      step: 'complete',
      progress: 100,
      processedElements: mockLayers.filter(layer => layer.visible)
    }));

    toast.success('PSD processing complete!');
  };

  const handleComplete = () => {
    onComplete?.({
      originalFile: state.uploadedFile,
      extractedLayers: state.extractedLayers,
      processedElements: state.processedElements,
    });
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Upload PSD File</h2>
        <p className="text-gray-400">
          Upload your Photoshop (.psd) file to extract design elements automatically
        </p>
      </div>

      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-crd-green bg-crd-green/10'
            : 'border-crd-border hover:border-crd-green/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <FileImage className="w-16 h-16 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-white">
              {isDragActive ? 'Drop PSD file here' : 'Drag & drop PSD file here'}
            </p>
            <p className="text-gray-400 mt-1">or click to browse</p>
          </div>
          <div className="text-sm text-gray-500">
            Supported: .psd files up to 100MB
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-crd-dark border-crd-border">
        <h3 className="text-white font-medium mb-2">What happens next?</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-crd-green" />
            <span>Extract all layers from your PSD file</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-crd-green" />
            <span>Identify design elements automatically</span>
          </div>
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-crd-green" />
            <span>Generate reusable card templates</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          {state.step === 'analyzing' && 'Analyzing PSD Structure'}
          {state.step === 'extracting' && 'Extracting Design Elements'}
        </h2>
        <p className="text-gray-400">
          {state.step === 'analyzing' && 'Reading layers and analyzing document structure...'}
          {state.step === 'extracting' && 'Converting layers to web-compatible formats...'}
        </p>
      </div>

      <Card className="p-6 bg-crd-dark border-crd-border">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-crd-green rounded-lg flex items-center justify-center">
            <FileImage className="w-6 h-6 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">{state.uploadedFile?.name}</h3>
            <p className="text-gray-400 text-sm">
              {(state.uploadedFile?.size || 0 / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Processing Progress</span>
            <span className="text-white">{state.progress}%</span>
          </div>
          <Progress value={state.progress} className="h-2" />
        </div>
      </Card>

      {state.step === 'extracting' && state.extractedLayers.length > 0 && (
        <Card className="p-4 bg-crd-dark border-crd-border">
          <h3 className="text-white font-medium mb-3">Detected Layers</h3>
          <div className="space-y-2">
            {state.extractedLayers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-crd-green" />
                  <span className="text-white">{layer.name}</span>
                  <span className="text-gray-400">({layer.type})</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  layer.visible ? 'bg-crd-green' : 'bg-gray-500'
                }`} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Processing Complete!</h2>
        <p className="text-gray-400">
          Successfully extracted {state.processedElements.length} design elements
        </p>
      </div>

      <Card className="p-4 bg-crd-dark border-crd-border">
        <h3 className="text-white font-medium mb-3">Extracted Elements</h3>
        <div className="grid grid-cols-2 gap-3">
          {state.processedElements.map(element => (
            <div key={element.id} className="p-3 bg-crd-darker rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Layers className="w-4 h-4 text-crd-green" />
                <span className="text-white text-sm font-medium">{element.name}</span>
              </div>
              <span className="text-xs text-gray-400 capitalize">{element.type}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-crd-dark border-crd-border">
        <h3 className="text-white font-medium mb-2">Next Steps</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Elements are ready for template creation</p>
          <p>• You can customize colors and properties</p>
          <p>• Generate team-specific variations</p>
        </div>
      </Card>

      <div className="flex space-x-3">
        <Button
          onClick={handleComplete}
          className="flex-1 bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Template Creation
        </Button>
        <Button
          variant="outline"
          onClick={() => setState(prev => ({ ...prev, step: 'upload', progress: 0, uploadedFile: null }))}
        >
          Process Another File
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <Card className="max-w-4xl mx-auto bg-crd-darker border-crd-border">
        <div className="p-6 border-b border-crd-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">CRD Elements Processor</h1>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} className="text-gray-400">
                Cancel
              </Button>
            )}
          </div>
          <p className="text-gray-400 mt-1">
            Convert PSD files into reusable card templates
          </p>
        </div>

        <div className="p-6">
          {state.step === 'upload' && renderUploadStep()}
          {(state.step === 'analyzing' || state.step === 'extracting') && renderProcessingStep()}
          {state.step === 'complete' && renderCompleteStep()}
        </div>
      </Card>
    </div>
  );
};