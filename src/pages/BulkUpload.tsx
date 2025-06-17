
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
import { useBulkUploadLogic } from '@/hooks/useBulkUploadLogic';
import { useUser } from '@/hooks/use-user';
import { CardRepository } from '@/repositories/cardRepository';
import { toast } from 'sonner';
import { Crop } from 'lucide-react';
import type { Card as CardType } from '@/types/card';

type Mode = 'upload' | 'recrop-select' | 'recrop-interface';

const BulkUpload = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('upload');
  const [selectedCardsForRecrop, setSelectedCardsForRecrop] = useState<CardType[]>([]);
  
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
    </div>
  );
};

export default BulkUpload;
