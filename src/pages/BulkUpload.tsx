
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadHeader } from '@/components/bulk-upload/BulkUploadHeader';
import { BulkUploadDropZone } from '@/components/bulk-upload/BulkUploadDropZone';
import { BulkUploadControls } from '@/components/bulk-upload/BulkUploadControls';
import { BulkUploadProgress } from '@/components/bulk-upload/BulkUploadProgress';
import { BulkUploadGrid } from '@/components/bulk-upload/BulkUploadGrid';
import { useBulkUploadLogic } from '@/hooks/useBulkUploadLogic';
import { useAuth } from '@/features/auth/providers/AuthProvider';

const BulkUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    uploadedFiles,
    isProcessing,
    progress,
    addFiles,
    removeFile,
    processAllFiles
  } = useBulkUploadLogic(user);

  const completedCount = uploadedFiles.filter(f => f.status === 'complete').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length;

  const viewInGallery = () => {
    navigate('/gallery');
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <BulkUploadHeader onViewGallery={() => navigate('/gallery')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {uploadedFiles.length === 0 ? (
          <BulkUploadDropZone onFilesAdded={addFiles} />
        ) : (
          <div className="space-y-6">
            <BulkUploadControls
              uploadedFilesCount={uploadedFiles.length}
              completedCount={completedCount}
              pendingCount={pendingCount}
              errorCount={errorCount}
              isProcessing={isProcessing}
              onProcessFiles={processAllFiles}
              onViewGallery={viewInGallery}
            />

            {isProcessing && (
              <BulkUploadProgress progress={progress} />
            )}

            <BulkUploadGrid
              uploadedFiles={uploadedFiles}
              onRemoveFile={removeFile}
              onFilesAdded={addFiles}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
