import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { CardRepository } from '@/repositories/cardRepository';
import type { User } from '@/types/user';
import type { UploadedFile } from '@/types/bulk-upload';
import { processImageToDataUrl } from './imageProcessor';
import { createCardCreateParams, generateFallbackData } from './cardDataUtils';

export const useBulkUploadLogic = (user: any) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const addFiles = (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const updateFile = useCallback((fileId: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, ...updates }
          : file
      )
    );
  }, []);

  const processAllFiles = async () => {
    if (!user) {
      toast.error('You must be logged in to create cards');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    let completed = 0;

    for (const fileData of pendingFiles) {
      try {
        // Update status to analyzing
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'analyzing' } : f
        ));

        console.log(`🔍 Processing file: ${fileData.file.name}`);

        // Convert image to data URL with proper cropping to fill card face
        const imageDataUrl = await processImageToDataUrl(fileData.file);
        
        // Analyze with AI (with better error handling)
        let analysis;
        let aiAnalysisWorked = false;
        try {
          console.log('🤖 Analyzing image with AI...');
          analysis = await analyzeCardImage(imageDataUrl);
          aiAnalysisWorked = true;
          console.log('✅ AI Analysis successful:', analysis);
        } catch (aiError) {
          console.warn('⚠️ AI Analysis failed, using enhanced fallback data:', aiError);
          analysis = generateFallbackData(fileData.file.name);
          aiAnalysisWorked = false;
        }
        
        // Create card data with proper typing for CardCreateParams
        const cardCreateParams = createCardCreateParams(
          analysis,
          fileData.file.name,
          imageDataUrl,
          user,
          aiAnalysisWorked
        );

        console.log('💾 Creating card in database...', cardCreateParams);
        const cardResult = await CardRepository.createCard(cardCreateParams);

        if (cardResult) {
          // Update status to complete
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              status: 'complete', 
              analysis: { ...analysis, cardId: cardResult.id, aiGenerated: aiAnalysisWorked }
            } : f
          ));
          
          console.log(`✅ Created card: ${analysis.title} (${cardResult.id})`);
        } else {
          throw new Error('Failed to create card in database');
        }

      } catch (error) {
        console.error('❌ Error processing file:', fileData.file.name, error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : f
        ));
      }

      completed++;
      setProgress((completed / pendingFiles.length) * 100);
    }

    setIsProcessing(false);
    
    const successCount = uploadedFiles.filter(f => f.status === 'complete').length;
    const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
    
    if (successCount > 0) {
      toast.success(`Successfully created ${successCount} cards with AI analysis and improved image processing!`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} cards failed to process. Check the console for details.`);
    }
  };

  return {
    uploadedFiles,
    isProcessing,
    progress,
    addFiles,
    removeFile,
    processAllFiles,
    updateFile
  };
};
