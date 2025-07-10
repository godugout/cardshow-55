import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, X, Check, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PSDLayer } from '@/types/psd';
import { usePSDCache } from '@/hooks/usePSDCache';
import { toast } from 'sonner';

interface PSDUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPSDProcessed: (layers: PSDLayer[], thumbnail: string) => void;
}

export const PSDUploadModal: React.FC<PSDUploadModalProps> = ({
  isOpen,
  onClose,
  onPSDProcessed
}) => {
  const { 
    processPSD, 
    isProcessing, 
    processingProgress, 
    processingStep, 
    cachedJobs, 
    loadPSDFromCache,
    loadCachedJobs 
  } = usePSDCache();
  
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCachedJobs, setShowCachedJobs] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.name.toLowerCase().endsWith('.psd')) {
      toast.error('Please select a valid PSD file');
      return;
    }

    setError(null);
    setThumbnail(null);

    try {
      const result = await processPSD(file);
      setThumbnail(result.thumbnail);
      
      toast.success('PSD processed successfully!');
      
      // Wait a moment to show completion
      setTimeout(() => {
        onPSDProcessed(result.layers, result.thumbnail);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error processing PSD:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process PSD file';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [processPSD, onPSDProcessed, onClose]);

  const handleLoadCachedPSD = useCallback(async (jobId: string) => {
    try {
      const layers = await loadPSDFromCache(jobId);
      const job = cachedJobs.find(j => j.id === jobId);
      
      if (job) {
        toast.success('Loaded cached PSD');
        onPSDProcessed(layers, job.thumbnailUrl);
        onClose();
      }
    } catch (error) {
      console.error('Error loading cached PSD:', error);
      toast.error('Failed to load cached PSD');
    }
  }, [loadPSDFromCache, cachedJobs, onPSDProcessed, onClose]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setThumbnail(null);
      setError(null);
      setShowCachedJobs(false);
    }
  };

  // Load cached jobs when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      loadCachedJobs();
    }
  }, [isOpen, loadCachedJobs]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-crd-darker border-crd-mediumGray/20">
        <DialogHeader>
          <DialogTitle className="text-crd-white flex items-center gap-2">
            <FileImage className="w-5 h-5 text-crd-blue" />
            Import PSD File
          </DialogTitle>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-4 top-4 text-crd-lightGray hover:text-crd-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          {!isProcessing && (
            <div className="flex bg-crd-darkest/50 rounded-lg p-1">
              <button
                onClick={() => setShowCachedJobs(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  !showCachedJobs
                    ? 'bg-crd-blue text-white'
                    : 'text-crd-lightGray hover:text-white'
                }`}
              >
                Upload New
              </button>
              <button
                onClick={() => setShowCachedJobs(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  showCachedJobs
                    ? 'bg-crd-blue text-white'
                    : 'text-crd-lightGray hover:text-white'
                }`}
              >
                Recent PSDs ({cachedJobs.length})
              </button>
            </div>
          )}

          {!isProcessing ? (
            <>
              {showCachedJobs ? (
                /* Cached Jobs List */
                <div className="space-y-3">
                  {cachedJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <FileImage className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                      <p className="text-crd-lightGray">No cached PSDs found</p>
                      <button
                        onClick={() => setShowCachedJobs(false)}
                        className="text-crd-blue hover:underline text-sm mt-2"
                      >
                        Upload your first PSD
                      </button>
                    </div>
                  ) : (
                    cachedJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleLoadCachedPSD(job.id)}
                        className="bg-crd-darkest/50 p-4 rounded-lg cursor-pointer hover:bg-crd-darkest/70 transition border border-crd-mediumGray/20 hover:border-crd-blue/40"
                      >
                        <div className="flex items-center gap-4">
                          {job.thumbnailUrl ? (
                            <img
                              src={job.thumbnailUrl}
                              alt={job.fileName}
                              className="w-16 h-20 object-cover rounded border border-crd-mediumGray/20"
                            />
                          ) : (
                            <div className="w-16 h-20 bg-crd-mediumGray/20 rounded flex items-center justify-center">
                              <FileImage className="w-6 h-6 text-crd-lightGray" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-crd-white truncate">{job.fileName}</h3>
                            <p className="text-sm text-crd-lightGray">
                              {job.layersCount} layers • {job.metadata.width}×{job.metadata.height}
                            </p>
                            <p className="text-xs text-crd-lightGray/70">
                              Last accessed: {job.lastAccessed.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* Upload Area */}
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${isDragActive 
                        ? 'border-crd-blue bg-crd-blue/5' 
                        : 'border-crd-mediumGray/40 hover:border-crd-blue/60 bg-crd-darkest/50'
                      }
                    `}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-crd-white mb-2">
                      {isDragActive ? 'Drop your PSD file here' : 'Upload PSD File'}
                    </h3>
                    <p className="text-crd-lightGray text-sm mb-4">
                      Drag and drop your Photoshop file or click to browse
                    </p>
                    <p className="text-xs text-crd-lightGray">
                      Supports .psd files up to 100MB
                    </p>
                  </div>

                  {/* File Info */}
                  {acceptedFiles.length > 0 && (
                    <div className="bg-crd-darkest/50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileImage className="w-8 h-8 text-crd-blue" />
                        <div>
                          <p className="font-medium text-crd-white">{acceptedFiles[0].name}</p>
                          <p className="text-sm text-crd-lightGray">
                            {(acceptedFiles[0].size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* What happens next */}
                  <div className="bg-crd-blue/10 p-4 rounded-lg">
                    <h4 className="font-medium text-crd-white mb-2">Enhanced Processing:</h4>
                    <ul className="text-sm text-crd-lightGray space-y-1">
                      <li>• Individual layer images are cached for offline editing</li>
                      <li>• Auto-save keeps your work persistent between sessions</li>
                      <li>• Smart frame suggestions based on layer analysis</li>
                      <li>• Full PSD structure preserved with hierarchy</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium">Processing Error</p>
                      <p className="text-red-300 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Processing */
            <div className="text-center">
              {thumbnail && (
                <div className="mb-6">
                  <img 
                    src={thumbnail} 
                    alt="PSD Preview" 
                    className="w-32 h-44 mx-auto rounded-lg border border-crd-mediumGray/20"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <Progress value={processingProgress} className="w-full" />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                {processingProgress >= 100 ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <div className="w-5 h-5 border-2 border-crd-blue border-t-transparent rounded-full animate-spin" />
                )}
                <span className="text-crd-white font-medium">{processingStep}</span>
              </div>
              
              <p className="text-sm text-crd-lightGray">
                {processingProgress < 100 
                  ? 'Processing layers and caching images for offline editing...' 
                  : 'Complete! Opening layer editor...'
                }
              </p>
              
              <div className="text-xs text-crd-lightGray/60 mt-2">
                Progress: {Math.round(processingProgress)}%
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};