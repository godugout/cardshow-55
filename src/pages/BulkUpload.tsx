
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadHeader } from '@/components/bulk-upload/BulkUploadHeader';
import { BulkUploadDropZone } from '@/components/bulk-upload/BulkUploadDropZone';
import { BulkUploadControls } from '@/components/bulk-upload/BulkUploadControls';
import { BulkUploadProgress } from '@/components/bulk-upload/BulkUploadProgress';
import { BulkUploadGrid } from '@/components/bulk-upload/BulkUploadGrid';
import { BulkRecropSelector } from '@/components/bulk-upload/BulkRecropSelector';
import { EnhancedBulkRecropInterface } from '@/components/bulk-upload/EnhancedBulkRecropInterface';
import { FloatingCropOverlay } from '@/components/bulk-upload/floating-editor/FloatingCropOverlay';
import { useBulkUploadLogic } from '@/hooks/useBulkUploadLogic';
import { useUser } from '@/hooks/use-user';
import { CardRepository } from '@/repositories/cardRepository';
import { toast } from 'sonner';
import { Crop } from 'lucide-react';
import type { Card as CardType } from '@/types/card';
import type { UploadedFile } from '@/types/bulk-upload';

type Mode = 'upload' | 'recrop-select' | 'recrop-interface';

const BulkUpload = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('upload');
  const [selectedCardsForRecrop, setSelectedCardsForRecrop] = useState<CardType[]>([]);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  
  const {
    uploadedFiles,
    isProcessing,
    progress,
    addFiles,
    removeFile,
    processAllFiles,
    updateFile
  } = useBulkUploadLogic(user);

  const completedCount = uploadedFiles.filter(f => f.status === 'complete').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length;

  const viewInGallery = () => {
    navigate('/gallery');
  };

  const handleEditFile = (fileId: string) => {
    // Update file status to editing
    updateFile(fileId, { status: 'editing' });
    setEditingFileId(fileId);
  };

  const handleApplyEdit = (fileId: string, editData: UploadedFile['editData']) => {
    // Update file with edit data and reset status
    updateFile(fileId, { 
      editData, 
      status: 'pending',
      preview: editData?.croppedImageUrl || uploadedFiles.find(f => f.id === fileId)?.preview || ''
    });
    setEditingFileId(null);
    toast.success('Crop applied successfully!');
  };

  const handleCancelEdit = () => {
    if (editingFileId) {
      // Reset status from editing back to previous state
      updateFile(editingFileId, { status: 'pending' });
    }
    setEditingFileId(null);
  };

  const handleRecropComplete = async (croppedCards: { card: CardType; croppedImageUrl: string }[]) => {
    if (!user) {
      toast.error('You must be logged in to update cards');
      return;
    }

    try {
      for (const { card, croppedImageUrl } of croppedCards) {
        await CardRepository.updateCard(card.id, {
          image_url: croppedImageUrl,
          thumbnail_url: croppedImageUrl,
          updated_at: new Date().toISOString()
        });
      }

      toast.success(`Successfully re-cropped ${croppedCards.length} cards!`);
      setMode('upload');
      setSelectedCardsForRecrop([]);
    } catch (error) {
      console.error('Failed to update cards:', error);
      toast.error('Failed to update some cards. Please try again.');
    }
  };

  const editingFile = editingFileId ? uploadedFiles.find(f => f.id === editingFileId) : null;

  return (
    <div className="min-h-screen bg-crd-darkest">
      <BulkUploadHeader onViewGallery={() => navigate('/gallery')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === 'upload' && (
          <div className="space-y-8">
            {/* Main Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Bulk Card Upload</h1>
              <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
                Upload multiple card images at once with AI-powered analysis and metadata extraction
              </p>
              
              {/* Re-crop Option */}
              <div className="mt-6">
                <Button
                  onClick={() => setMode('recrop-select')}
                  variant="outline"
                  className="bg-transparent border-crd-blue text-crd-blue hover:bg-crd-blue hover:text-white transition-colors"
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Re-crop Existing Cards
                </Button>
              </div>
            </div>

            {/* Main Upload Interface */}
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
                  onEditFile={handleEditFile}
                />
              </div>
            )}
          </div>
        )}

        {mode === 'recrop-select' && (
          <BulkRecropSelector
            onCardsSelected={(cards) => {
              setSelectedCardsForRecrop(cards);
              setMode('recrop-interface');
            }}
            onBack={() => setMode('upload')}
          />
        )}

        {mode === 'recrop-interface' && (
          <EnhancedBulkRecropInterface
            cards={selectedCardsForRecrop}
            onComplete={handleRecropComplete}
            onBack={() => setMode('recrop-select')}
          />
        )}
      </div>

      {/* Floating Crop Overlay */}
      {editingFile && (
        <FloatingCropOverlay
          file={editingFile}
          onApply={(editData) => handleApplyEdit(editingFile.id, editData)}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default BulkUpload;
