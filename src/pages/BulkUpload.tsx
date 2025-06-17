
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
        {mode === 'upload' && uploadedFiles.length === 0 && (
          <div className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Bulk Operations</h1>
                <p className="text-crd-lightGray text-lg">
                  Upload new images or re-crop existing cards in bulk
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="bg-crd-darker rounded-xl p-8 border border-crd-mediumGray/20 hover:border-crd-green/50 hover:bg-crd-green/5 transition-all cursor-pointer group"
                  onClick={() => setMode('upload')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-crd-green/30 transition-colors">
                      <svg className="w-8 h-8 text-crd-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-crd-green transition-colors">Upload New Cards</h3>
                    <p className="text-crd-lightGray">
                      Upload multiple images and create cards with AI analysis
                    </p>
                  </div>
                </div>

                <div 
                  className="bg-crd-darker rounded-xl p-8 border border-crd-mediumGray/20 hover:border-crd-blue/50 hover:bg-crd-blue/5 transition-all cursor-pointer group"
                  onClick={() => setMode('recrop-select')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-crd-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-crd-blue/30 transition-colors">
                      <svg className="w-8 h-8 text-crd-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-crd-blue transition-colors">Re-crop Existing Cards</h3>
                    <p className="text-crd-lightGray">
                      Select and re-crop your existing cards in bulk
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <BulkUploadDropZone onFilesAdded={addFiles} />
          </div>
        )}

        {mode === 'upload' && uploadedFiles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setMode('upload')}
                className="bg-crd-blue hover:bg-crd-blue/80 text-white border-0"
              >
                ← Back to Mode Selection
              </Button>
            </div>

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
