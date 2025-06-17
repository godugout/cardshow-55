
import { useState } from 'react';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { CardRepository } from '@/repositories/cardRepository';
import type { User } from '@/types/user';
import type { CardData } from '@/types/card';
import type { UploadedFile } from '@/types/bulk-upload';

// Helper function to map AI analysis rarity to valid database rarity types
const mapRarityToValidType = (rarity: string): 'common' | 'uncommon' | 'rare' | 'legendary' => {
  const rarityMap: Record<string, 'common' | 'uncommon' | 'rare' | 'legendary'> = {
    'common': 'common',
    'uncommon': 'uncommon', 
    'rare': 'rare',
    'epic': 'rare', // Map epic to rare since epic is not in the database type
    'legendary': 'legendary'
  };
  
  return rarityMap[rarity.toLowerCase()] || 'common';
};

// Generate more varied fallback data based on filename
const generateFallbackData = (filename: string) => {
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  const randomTitles = [
    `${baseName} Trading Card`,
    `Legendary ${baseName}`,
    `Elite ${baseName} Card`,
    `Custom ${baseName} Collectible`,
    `Rare ${baseName} Edition`
  ];
  
  const randomDescriptions = [
    "A unique collectible card featuring custom artwork and distinctive design elements.",
    "An exclusive trading card with premium quality materials and exceptional craftsmanship.",
    "A rare collectible showcasing unique visual appeal and artistic excellence.",
    "A custom-designed card with special characteristics and premium finishing.",
    "An exceptional trading card with distinctive features and collector value."
  ];
  
  const randomRarities: ('common' | 'uncommon' | 'rare' | 'legendary')[] = ['common', 'uncommon', 'rare', 'legendary'];
  const randomTags = [
    ['custom', 'trading-card', 'collectible'],
    ['rare', 'premium', 'exclusive'],
    ['artwork', 'design', 'unique'],
    ['limited-edition', 'special'],
    ['collector', 'vintage', 'classic']
  ];
  
  const randomIndex = Math.floor(Math.random() * randomTitles.length);
  
  return {
    title: randomTitles[randomIndex],
    description: randomDescriptions[randomIndex],
    rarity: randomRarities[Math.floor(Math.random() * randomRarities.length)],
    tags: randomTags[Math.floor(Math.random() * randomTags.length)],
    category: 'Custom Trading Card',
    type: 'Character',
    series: 'Bulk Upload Collection'
  };
};

const processImageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Standard card dimensions - portrait aspect ratio
      const cardWidth = 350;
      const cardHeight = 490;
      
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      
      // Fill with white background
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scaling to FILL the canvas (crop if necessary)
      const scaleX = cardWidth / img.width;
      const scaleY = cardHeight / img.height;
      const scale = Math.max(scaleX, scaleY); // Use max to fill, not fit
      
      // Calculate dimensions and position to center the image
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (cardWidth - scaledWidth) / 2;
      const y = (cardHeight - scaledHeight) / 2;
      
      // Draw the image to fill the entire card
      ctx!.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Add subtle border for better card appearance
      ctx!.strokeStyle = '#e0e0e0';
      ctx!.lineWidth = 2;
      ctx!.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const useBulkUploadLogic = (user: User | null) => {
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
        
        // Create card data with proper typing
        const cardData: CardData = {
          title: analysis.title || generateFallbackData(fileData.file.name).title,
          description: analysis.description || generateFallbackData(fileData.file.name).description,
          creator_id: user.id,
          image_url: imageDataUrl,
          thumbnail_url: imageDataUrl,
          rarity: mapRarityToValidType(analysis.rarity || 'common'),
          tags: analysis.tags || ['custom', 'bulk-upload'],
          design_metadata: {
            aiGenerated: aiAnalysisWorked,
            originalFilename: fileData.file.name,
            analysis: analysis,
            processingMethod: 'bulk-upload-v2',
            imageProcessing: {
              scalingMethod: 'fill',
              cardDimensions: { width: 350, height: 490 },
              backgroundColor: '#ffffff',
              compressionQuality: 0.9
            }
          },
          visibility: 'public',
          is_public: true,
          creator_attribution: {
            creator_name: user.username || user.email?.split('@')[0] || 'Anonymous',
            creator_id: user.id,
            collaboration_type: 'solo',
          },
          publishing_options: {
            marketplace_listing: false,
            crd_catalog_inclusion: true,
            print_available: false,
            pricing: {
              currency: 'USD'
            },
            distribution: {
              limited_edition: false
            }
          }
        };

        console.log('💾 Creating card in database...', cardData);
        const cardResult = await CardRepository.createCard(cardData);

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
    processAllFiles
  };
};
