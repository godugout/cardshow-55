
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
  Zap
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
  const [showCropper, setShowCropper] = useState(false);
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
          quality: 95
        });
        setUploadProgress(100);
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
    noClick: true, // Disable default click to handle manually
    noKeyboard: false
  });

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

  const handleAdvancedCrop = () => {
    setShowCropper(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    cardEditor.updateCardField('image_url', croppedImageUrl);
    setShowCropper(false);
    toast.success('Image cropped successfully!');
  };

  const handleAIEnhance = () => {
    setIsProcessing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Image enhanced with AI!');
    }, 1500);
  };

  const canProceed = cardEditor.cardData.image_url && !isProcessing;

  return (
    <div className="space-y-8 relative z-10">
      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Upload Interface */}
        <div className="space-y-6">
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-[400px] flex flex-col items-center justify-center z-20 ${
              isDragActive
                ? 'border-crd-green bg-crd-green/10'
                : 'border-crd-mediumGray/30 hover:border-crd-green/50 bg-crd-darker/50'
            }`}
            onClick={handleBrowseClick}
          >
            <input {...getInputProps()} />
            
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-crd-green animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-crd-white mb-2">Processing Image</h3>
                  <p className="text-crd-lightGray text-sm mb-4">Analyzing with AI...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : cardEditor.cardData.image_url ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-crd-green/20 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-crd-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-crd-white">Image Ready!</h3>
                  <p className="text-crd-lightGray text-sm">Click to upload a different image</p>
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
                    Drag & drop or click to browse files
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-crd-mediumGray mb-6">
                    <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">JPG</Badge>
                    <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">PNG</Badge>
                    <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">WebP</Badge>
                    <Badge variant="outline" className="border-crd-mediumGray/30 text-crd-lightGray">GIF</Badge>
                  </div>
                </div>
                <CRDButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                  className="bg-crd-green hover:bg-crd-green/90 text-black font-medium z-30 relative"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </CRDButton>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {cardEditor.cardData.image_url && (
            <div className="grid grid-cols-2 gap-4">
              <CRDButton variant="outline" onClick={handleAdvancedCrop} className="w-full">
                <Crop className="w-4 h-4 mr-2" />
                Advanced Crop
              </CRDButton>
              <CRDButton variant="outline" onClick={handleAIEnhance} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                AI Enhance
              </CRDButton>
            </div>
          )}
        </div>

        {/* Right Side - Preview & Analysis */}
        <div className="space-y-6">
          {/* Image Preview */}
          <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-crd-white mb-4">Preview</h4>
              
              {cardEditor.cardData.image_url ? (
                <div className="aspect-[5/7] rounded-lg overflow-hidden bg-crd-darkGray border border-crd-mediumGray/30">
                  <img 
                    src={cardEditor.cardData.image_url} 
                    alt="Card preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[5/7] rounded-lg bg-crd-darkGray border-2 border-dashed border-crd-mediumGray/30 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-crd-mediumGray mx-auto mb-2" />
                    <p className="text-crd-mediumGray text-sm">No image uploaded</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {imageAnalysis && (
            <Card className="bg-crd-mediumGray/20 border-crd-mediumGray/30">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-crd-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-crd-green" />
                  AI Analysis
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-crd-lightGray mb-2">Suggested Rarity:</p>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      {imageAnalysis.suggestedRarity}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-crd-lightGray mb-2">Dominant Colors:</p>
                    <div className="flex space-x-2">
                      {imageAnalysis.dominantColors.map((color: string, index: number) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full border border-crd-mediumGray/30"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-crd-lightGray mb-2">Suggested Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {imageAnalysis.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-crd-mediumGray/20">
        <div className="text-sm text-crd-lightGray">
          Step 1 of 5 - Upload your image to get started
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

      {/* Simple cropper fallback */}
      {showCropper && cardEditor.cardData.image_url && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-crd-darkGray p-6 rounded-lg max-w-2xl w-full mx-4">
            <h3 className="text-crd-white text-lg font-semibold mb-4">Crop Image</h3>
            <div className="aspect-video bg-crd-mediumGray/20 rounded-lg flex items-center justify-center mb-4">
              <p className="text-crd-lightGray">Cropping interface will be implemented</p>
            </div>
            <div className="flex justify-end space-x-3">
              <CRDButton variant="outline" onClick={() => setShowCropper(false)}>
                Cancel
              </CRDButton>
              <CRDButton onClick={() => handleCropComplete(cardEditor.cardData.image_url!)}>
                Apply Crop
              </CRDButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
