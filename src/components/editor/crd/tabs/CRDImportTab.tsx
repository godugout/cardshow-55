import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Layers, Eye, Loader2, AlertCircle, Sparkles, ArrowUp } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDPSDProcessor } from '../import/CRDPSDProcessor';
import { PSDIntegratedPreview } from '../psd/PSDIntegratedPreview';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface CRDImportTabProps {
  onFrameGenerated?: (frameData: any) => void;
  onCardGenerated?: (cardData: any) => void;
  onApplyToCanvas?: (layers: any[], visibleLayers: Set<string>) => void;
}

interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

export const CRDImportTab: React.FC<CRDImportTabProps> = ({
  onFrameGenerated,
  onCardGenerated,
  onApplyToCanvas
}) => {
  const [processingJob, setProcessingJob] = useState<ProcessingJob | null>(null);
  const [extractedLayers, setExtractedLayers] = useState<any[]>([]);
  const [generatedFrames, setGeneratedFrames] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please upload a .psd file');
      return;
    }

    // Create processing job
    const job: ProcessingJob = {
      id: `job_${Date.now()}`,
      fileName: file.name,
      status: 'uploading',
      progress: 0
    };

    setProcessingJob(job);
    toast.info(`Processing ${file.name}...`);

    try {
      // Start PSD processing
      job.status = 'processing';
      job.progress = 25;
      setProcessingJob({ ...job });

      // This will be handled by CRDPSDProcessor
      const processor = new CRDPSDProcessor();
      const result = await processor.processPSD(file, (progress) => {
        job.progress = Math.max(25, Math.min(95, progress));
        setProcessingJob({ ...job });
      });

      // Update job status
      job.status = 'completed';
      job.progress = 100;
      job.result = result;
      setProcessingJob({ ...job });

      // Update extracted data
      setExtractedLayers(result.layers || []);
      setGeneratedFrames(result.generatedFrames || []);

      toast.success(`Successfully processed ${file.name}`);
    } catch (error) {
      console.error('PSD processing failed:', error);
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      setProcessingJob({ ...job });
      
      toast.error(`Failed to process ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.psd'],
      'image/vnd.adobe.photoshop': ['.psd']
    },
    maxFiles: 1,
    disabled: !!processingJob && processingJob.status !== 'completed' && processingJob.status !== 'failed'
  });

  const handleGenerateCard = useCallback((frameData: any) => {
    console.log('Generating card from frame:', frameData);
    onCardGenerated?.(frameData);
    toast.success('Card generated successfully!');
  }, [onCardGenerated]);

  const handleUseFrame = useCallback((frameData: any) => {
    console.log('Using generated frame:', frameData);
    onFrameGenerated?.(frameData);
    toast.success('Frame applied to editor!');
  }, [onFrameGenerated]);

  const handleApplyToCanvas = useCallback((layers: any[], visibleLayers: Set<string>) => {
    console.log('Applying PSD layers to canvas:', { layers, visibleLayers });
    onApplyToCanvas?.(layers, visibleLayers);
    toast.success('PSD layers applied to canvas!');
  }, [onApplyToCanvas]);

  const resetImport = useCallback(() => {
    setProcessingJob(null);
    setExtractedLayers([]);
    setGeneratedFrames([]);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import PSD Files
            <div className="ml-auto flex items-center gap-1 text-crd-blue">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs">Enhanced</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!processingJob && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-crd-blue bg-crd-blue/10' 
                  : 'border-crd-mediumGray/50 hover:border-crd-blue/50 hover:bg-crd-mediumGray/10'
              }`}
            >
              <input {...getInputProps()} />
              <FileImage className="w-8 h-8 mx-auto mb-3 text-crd-lightGray" />
              {isDragActive ? (
                <p className="text-crd-blue">Drop your PSD file here...</p>
              ) : (
                <div>
                  <p className="text-crd-white mb-1">Drag & drop a PSD file here</p>
                  <p className="text-crd-lightGray text-xs">or click to browse</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-crd-blue">
                    <ArrowUp className="w-3 h-3" />
                    <span>Layers will replace canvas content</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {processingJob && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {processingJob.status === 'processing' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-crd-blue" />
                ) : processingJob.status === 'failed' ? (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <Layers className="w-4 h-4 text-green-400" />
                )}
                
                <div className="flex-1">
                  <p className="text-crd-white text-sm">{processingJob.fileName}</p>
                  <p className="text-crd-lightGray text-xs capitalize">
                    {processingJob.status === 'processing' ? 'Processing...' : processingJob.status}
                  </p>
                </div>
              </div>

              {processingJob.status === 'processing' && (
                <div className="w-full bg-crd-mediumGray/30 rounded-full h-2">
                  <div 
                    className="bg-crd-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingJob.progress}%` }}
                  />
                </div>
              )}

              {processingJob.status === 'failed' && (
                <div className="space-y-2">
                  <p className="text-red-400 text-xs">{processingJob.error}</p>
                  <CRDButton 
                    variant="outline" 
                    size="sm" 
                    onClick={resetImport}
                    className="w-full"
                  >
                    Try Again
                  </CRDButton>
                </div>
              )}

              {processingJob.status === 'completed' && (
                <div className="space-y-2">
                  <p className="text-green-400 text-xs">
                    Extracted {extractedLayers.length} layers, generated {generatedFrames.length} frames
                  </p>
                  <CRDButton 
                    variant="outline" 
                    size="sm" 
                    onClick={resetImport}
                    className="w-full"
                  >
                    Import Another File
                  </CRDButton>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {processingJob?.status === 'completed' && extractedLayers.length > 0 && (
        <PSDIntegratedPreview
          layers={extractedLayers}
          generatedFrames={generatedFrames}
          onGenerateCard={handleGenerateCard}
          onUseFrame={handleUseFrame}
          onApplyToCanvas={handleApplyToCanvas}
        />
      )}
    </div>
  );
};