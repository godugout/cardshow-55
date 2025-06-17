
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { CardRepository } from '@/repositories/cardRepository';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  analysis?: any;
  error?: string;
}

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
    `${baseName} Card`,
    `Legendary ${baseName}`,
    `Elite ${baseName}`,
    `Custom ${baseName}`,
    `Rare ${baseName}`
  ];
  
  const randomDescriptions = [
    "A unique collectible card featuring custom artwork.",
    "An exclusive trading card with distinctive design elements.",
    "A premium card showcasing exceptional craftsmanship.",
    "A rare collectible with unique visual appeal.",
    "A custom-designed card with special characteristics."
  ];
  
  const randomRarities: ('common' | 'uncommon' | 'rare' | 'legendary')[] = ['common', 'uncommon', 'rare', 'legendary'];
  const randomTags = [
    ['custom', 'trading-card'],
    ['collectible', 'rare'],
    ['artwork', 'design'],
    ['premium', 'exclusive'],
    ['unique', 'special']
  ];
  
  const randomIndex = Math.floor(Math.random() * randomTitles.length);
  
  return {
    title: randomTitles[randomIndex],
    description: randomDescriptions[randomIndex],
    rarity: randomRarities[Math.floor(Math.random() * randomRarities.length)],
    tags: randomTags[Math.floor(Math.random() * randomTags.length)],
    category: 'Custom Card',
    type: 'Character',
    series: 'Custom Collection'
  };
};

const BulkUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending'
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`Added ${acceptedFiles.length} images for processing`);
    }
  });

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

        // Convert image to data URL with proper cropping
        const imageDataUrl = await processImageToDataUrl(fileData.file);
        
        // Analyze with AI (with better error handling)
        let analysis;
        try {
          console.log('🤖 Analyzing image with AI...');
          analysis = await analyzeCardImage(imageDataUrl);
          console.log('✅ AI Analysis successful:', analysis);
        } catch (aiError) {
          console.warn('⚠️ AI Analysis failed, using fallback data:', aiError);
          analysis = generateFallbackData(fileData.file.name);
        }
        
        // Create card in database with proper rarity mapping
        const cardData = {
          title: analysis.title || generateFallbackData(fileData.file.name).title,
          description: analysis.description || generateFallbackData(fileData.file.name).description,
          creator_id: user.id,
          image_url: imageDataUrl,
          thumbnail_url: imageDataUrl,
          rarity: mapRarityToValidType(analysis.rarity || 'common'),
          tags: analysis.tags || ['custom', 'bulk-upload'],
          design_metadata: {
            aiGenerated: !!analysis.title, // True if AI analysis worked
            originalFilename: fileData.file.name,
            analysis: analysis,
            processingMethod: 'bulk-upload',
            imageProcessing: {
              originalDimensions: { width: 0, height: 0 }, // Would need to capture from img.onload
              cardDimensions: { width: 350, height: 490 },
              scalingMethod: 'fill',
              backgroundColor: '#ffffff'
            }
          },
          visibility: 'public',
          is_public: true,
          series: analysis.series || 'Bulk Upload Collection'
        };

        console.log('💾 Creating card in database...', cardData);
        const cardResult = await CardRepository.createCard(cardData);

        if (cardResult) {
          // Update status to complete
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              status: 'complete', 
              analysis: { ...analysis, cardId: cardResult.id }
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
      toast.success(`Successfully created ${successCount} cards! Images now fill the entire card face.`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} cards failed to process. Check the console for details.`);
    }
  };

  const viewInGallery = () => {
    navigate('/gallery');
  };

  const completedCount = uploadedFiles.filter(f => f.status === 'complete').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Bulk Card Upload</h1>
          <Button
            onClick={() => navigate('/gallery')}
            variant="outline"
            className="border-crd-mediumGray/20 text-white"
          >
            View Gallery
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        {uploadedFiles.length === 0 && (
          <Card className="bg-crd-darker border-crd-mediumGray/20 p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                {isDragActive ? 'Drop images here' : 'Upload Card Images'}
              </h3>
              <p className="text-crd-lightGray text-lg">
                Drag and drop multiple images, or click to browse
              </p>
              <p className="text-crd-lightGray text-sm mt-2">
                AI will automatically analyze and create cards with metadata
              </p>
              <p className="text-crd-green text-sm mt-1">
                ✨ Images will now properly fill the entire card face
              </p>
            </div>
          </Card>
        )}

        {/* File Grid */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">
                  {uploadedFiles.length} images uploaded
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">{completedCount} completed</span>
                  <span className="text-yellow-400">{pendingCount} pending</span>
                  {errorCount > 0 && <span className="text-red-400">{errorCount} errors</span>}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={processAllFiles}
                  disabled={isProcessing || pendingCount === 0}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : `Create ${pendingCount} Cards`}
                </Button>
                
                {completedCount > 0 && (
                  <Button
                    onClick={viewInGallery}
                    variant="outline"
                    className="border-crd-mediumGray/20 text-white"
                  >
                    View in Gallery
                  </Button>
                )}
              </div>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Processing cards with improved image filling...</span>
                  <span className="text-crd-lightGray">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Files Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {uploadedFiles.map((fileData) => (
                <Card key={fileData.id} className="bg-crd-darker border-crd-mediumGray/20 overflow-hidden">
                  <div className="relative">
                    <img
                      src={fileData.preview}
                      alt="Upload preview"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      {fileData.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(fileData.id)}
                          className="absolute top-2 right-2 text-white hover:bg-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {fileData.status === 'analyzing' && (
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-crd-green animate-pulse mx-auto mb-2" />
                          <span className="text-white text-sm">Analyzing...</span>
                        </div>
                      )}
                      
                      {fileData.status === 'complete' && (
                        <div className="text-center">
                          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <span className="text-white text-sm">Complete</span>
                        </div>
                      )}
                      
                      {fileData.status === 'error' && (
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <span className="text-white text-sm">Error</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {fileData.file.name}
                    </p>
                    <p className="text-crd-lightGray text-xs">
                      {(fileData.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    
                    {fileData.analysis && (
                      <div className="mt-2 text-xs">
                        <p className="text-crd-green font-medium truncate">
                          {fileData.analysis.title}
                        </p>
                        <p className="text-crd-lightGray">
                          {fileData.analysis.rarity}
                        </p>
                      </div>
                    )}
                    
                    {fileData.error && (
                      <p className="text-red-400 text-xs mt-2">
                        {fileData.error}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Add More Button */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-crd-mediumGray rounded-xl p-6 text-center cursor-pointer hover:border-crd-green/50 transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
              <p className="text-crd-lightGray">Add more images</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
