import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Crop, 
  Sparkles, 
  Check,
  ArrowRight,
  Camera,
  FileImage,
  Zap,
  Palette,
  Layout
} from 'lucide-react';

interface PhotoUploadSectionProps {
  cardEditor: ReturnType<typeof import('@/hooks/useCardEditor').useCardEditor>;
  onNext: () => void;
}

export const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  cardEditor,
  onNext
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);

  const processFile = useCallback(async (file: File) => {
    console.log('📁 Processing file:', file.name);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create object URL for preview  
      const imageUrl = URL.createObjectURL(file);
      cardEditor.updateCardField('image_url', imageUrl);

      // Simulate AI analysis
      setTimeout(() => {
        setImageAnalysis({
          dominantColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          suggestedRarity: 'rare',
          contentType: 'character',
          tags: ['fantasy', 'magical', 'warrior'],
          quality: 95,
          detectedText: file.name.includes('card') ? 'Trading Card Detected' : null,
          suggestedTemplate: 'classic-gold'
        });
        setUploadProgress(100);
        setShowAITools(true);
        clearInterval(progressInterval);
        toast.success('Image uploaded and analyzed!');
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  }, [cardEditor]);

  const handleBrowseClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        console.log('📁 File selected via browse:', files[0].name);
        await processFile(files[0]);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }, [processFile]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    await processFile(file);
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: false
  });

  const handleAIEnhance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Image enhanced with AI!');
    }, 1500);
  };

  const handleCreateFromPSD = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.psd,.ai,.eps';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        toast.info('PSD processing will be available soon!');
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const canProceed = cardEditor.cardData.image_url && !isProcessing;

  return (
    <div className="space-y-6 relative z-10">
      {/* Mobile-First Upload Area */}
      <div className="space-y-4">
        {/* Main Upload Zone */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all min-h-[280px] flex flex-col items-center justify-center ${
            isDragActive
              ? 'border-crd-green bg-crd-green/10'
              : cardEditor.cardData.image_url
              ? 'border-crd-green bg-crd-green/5'
              : 'border-crd-mediumGray/30 hover:border-crd-green/50 bg-crd-darker/50'
          }`}
          onClick={handleBrowseClick}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="space-y-4 w-full max-w-xs">
              <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-crd-green animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-crd-white mb-2">Processing Image</h3>
                <p className="text-crd-lightGray text-sm mb-4">Analyzing with AI...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </div>
          ) : cardEditor.cardData.image_url ? (
            <div className="space-y-4">
              <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden border border-crd-mediumGray/30">
                <img 
                  src={cardEditor.cardData.image_url} 
                  alt="Uploaded" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-crd-green">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Image Ready!</span>
                </div>
                <p className="text-crd-lightGray text-sm">Tap to upload a different image</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-crd-lightGray" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-crd-white mb-2">Upload Your Image</h3>
                <p className="text-crd-lightGray mb-4">
                  Drag & drop or tap to browse files
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-crd-mediumGray mb-6">
                  <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">JPG</Badge>
                  <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">PNG</Badge>
                  <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">WebP</Badge>
                </div>
              </div>
              <CRDButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                className="bg-crd-green hover:bg-crd-green/90 text-black font-medium"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </CRDButton>
            </div>
          )}
        </div>

        {/* AI Tools Section - Mobile Optimized */}
        {showAITools && cardEditor.cardData.image_url && (
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-crd-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-crd-green" />
                  AI Tools
                </h4>
              </div>
              
              {/* Mobile-First Button Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <CRDButton variant="outline" onClick={handleAIEnhance} className="w-full text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Enhance
                </CRDButton>
                <CRDButton variant="outline" onClick={handleCreateFromPSD} className="w-full text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  From PSD
                </CRDButton>
              </div>

              {/* Analysis Results - Compact */}
              {imageAnalysis && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-crd-lightGray">Suggested Rarity:</span>
                    <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                      {imageAnalysis.suggestedRarity}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm text-crd-lightGray mb-2 block">Colors:</span>
                    <div className="flex gap-2">
                      {imageAnalysis.dominantColors.slice(0, 3).map((color: string, index: number) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full border border-crd-mediumGray/30"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {imageAnalysis.detectedText && (
                    <div className="text-xs text-crd-green">
                      ✓ {imageAnalysis.detectedText}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <div className="text-sm text-crd-lightGray">
          Step 1 of 5 - Upload complete
        </div>
        
        <CRDButton 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[120px] bg-crd-green hover:bg-crd-green/90 text-black"
        >
          Next Step
          <ArrowRight className="w-4 h-4 ml-2" />
        </CRDButton>
      </div>
    </div>
  );
};
