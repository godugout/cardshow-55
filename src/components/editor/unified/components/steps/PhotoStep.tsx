
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Frame, AlertCircle, Crop, Palette, Maximize, Camera, X } from 'lucide-react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { EnhancedImageCropper } from '../../sections/components/EnhancedImageCropper';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import { TeamColorSelector } from '@/components/editor/templates/TeamColorSelector';
import { useColorThemes } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from '@/components/editor/templates/TeamColors';
import { toast } from 'sonner';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface PhotoStepProps {
  mode: CreationMode;
  selectedPhoto?: string;
  onPhotoSelect: (photo: string) => void;
  cardData?: CardData;
  selectedFrame?: DesignTemplate;
  onFrameSelect?: (frame: DesignTemplate) => void;
  onMoveToEffects?: () => void;
}

export const PhotoStep = ({ 
  mode, 
  selectedPhoto, 
  onPhotoSelect, 
  cardData,
  selectedFrame,
  onFrameSelect,
  onMoveToEffects
}: PhotoStepProps) => {
  console.log('📸 PhotoStep: Rendering with photo:', !!selectedPhoto, 'frame:', selectedFrame?.name);
  
  const [currentFrame, setCurrentFrame] = useState<DesignTemplate>(
    selectedFrame || BASEBALL_CARD_TEMPLATES[0] // No Frame is now first
  );
  const [showCropper, setShowCropper] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState(cardData?.title || 'PLAYER NAME');
  const [teamName, setTeamName] = useState('TEAM');
  const [selectedColorScheme, setSelectedColorScheme] = useState<TeamColorScheme | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const { colorThemes, loading: themesLoading } = useColorThemes();

  // Set default color scheme when themes load
  useEffect(() => {
    if (!selectedColorScheme && colorThemes.length > 0 && !themesLoading) {
      const defaultTheme = convertColorThemeToScheme(colorThemes[0]);
      setSelectedColorScheme(defaultTheme);
    }
  }, [colorThemes, themesLoading, selectedColorScheme]);

  useEffect(() => {
    return () => {
      imageUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  useEffect(() => {
    if (selectedFrame && selectedFrame.id !== currentFrame.id) {
      console.log('📸 PhotoStep: Updating frame to:', selectedFrame.name);
      setCurrentFrame(selectedFrame);
    }
  }, [selectedFrame?.id, currentFrame.id]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📸 PhotoStep: File selected:', file.name);
    
    try {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
      onPhotoSelect(url);
    } catch (error) {
      console.error('📸 PhotoStep: Error creating object URL:', error);
    }
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
      onPhotoSelect(url);
    }
  }, [onPhotoSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFrameSelection = useCallback((template: DesignTemplate) => {
    console.log('📸 PhotoStep: Frame selected:', template.name);
    setCurrentFrame(template);
    onFrameSelect?.(template);
  }, [onFrameSelect]);

  const handleCropComplete = (croppedImageUrl: string) => {
    console.log('✂️ PhotoStep: Crop completed, proceeding to effects immediately');
    onPhotoSelect(croppedImageUrl);
    setShowCropper(false);
    
    // Show success message
    toast.success('Image cropped! Moving to effects step...');
    
    // Immediately move to effects step
    setTimeout(() => {
      if (onMoveToEffects) {
        console.log('✂️ PhotoStep: Calling onMoveToEffects');
        onMoveToEffects();
      }
    }, 100);
  };

  const handleColorSchemeSelect = useCallback((colorScheme: TeamColorScheme) => {
    setSelectedColorScheme(colorScheme);
  }, []);

  const handleRemovePhoto = () => {
    onPhotoSelect('');
    setShowCropper(false);
  };

  const handleStartCrop = () => {
    if (selectedPhoto) {
      console.log('🔄 PhotoStep: Starting crop mode');
      setShowCropper(true);
    }
  };

  // Show cropper if active
  if (showCropper && selectedPhoto) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-crd-white mb-2">Crop Your Image</h2>
          <p className="text-crd-lightGray">
            Adjust the crop area to focus on the main subject, then extract to continue
          </p>
        </div>
        <EnhancedImageCropper
          imageUrl={selectedPhoto}
          onCropComplete={handleCropComplete}
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-crd-white mb-2">Create Your Baseball Card</h2>
        <p className="text-crd-lightGray">
          Upload your photo and choose from professional baseball card templates
        </p>
      </div>

      {/* Main Card Preview with Integrated Upload */}
      <div className="flex justify-center">
        <div className="relative">
          <div 
            className={`aspect-[5/7] w-80 bg-white rounded-lg border-2 overflow-hidden relative transition-all ${
              isDragActive ? 'border-crd-green border-dashed scale-105' : 
              selectedPhoto ? 'border-crd-mediumGray/30' : 
              'border-dashed border-crd-mediumGray/50 hover:border-crd-green/50 cursor-pointer'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedPhoto && document.getElementById('photo-input')?.click()}
          >
            {selectedPhoto ? (
              <>
                <SVGTemplateRenderer
                  template={currentFrame}
                  imageUrl={selectedPhoto}
                  playerName={playerName}
                  teamName={teamName}
                  customColors={selectedColorScheme || undefined}
                  className="w-full h-full"
                />
                
                {/* Photo Controls Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <CRDButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCrop();
                    }}
                    className="bg-crd-green hover:bg-crd-green/80 text-black p-2"
                  >
                    <Crop className="w-4 h-4" />
                  </CRDButton>
                  <CRDButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2"
                  >
                    <X className="w-4 h-4" />
                  </CRDButton>
                </div>

                {/* Change Photo Button */}
                <div className="absolute bottom-2 left-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <CRDButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('photo-input')?.click();
                    }}
                    variant="outline"
                    className="w-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </CRDButton>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                  isDragActive ? 'bg-crd-green/20' : 'bg-crd-mediumGray/20'
                }`}>
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-crd-green animate-bounce" />
                  ) : (
                    <Image className="w-8 h-8 text-crd-mediumGray" />
                  )}
                </div>
                
                <h3 className="text-white font-medium mb-2">
                  {isDragActive ? 'Drop your photo here!' : 'Upload Photo'}
                </h3>
                <p className="text-crd-lightGray text-sm mb-4 max-w-xs">
                  {isDragActive 
                    ? 'Release to add your photo to the card'
                    : 'Drag & drop a photo here or click to browse'
                  }
                </p>
                
                {!isDragActive && (
                  <CRDButton variant="outline" className="border-crd-mediumGray/20 text-crd-lightGray hover:text-crd-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </CRDButton>
                )}
              </div>
            )}
          </div>

          {/* Template Name */}
          <div className="text-center mt-4">
            <h4 className="text-crd-white font-medium flex items-center justify-center gap-2">
              {currentFrame.name}
              {currentFrame.id === 'no-frame' && <Maximize className="w-4 h-4 text-crd-green" />}
            </h4>
            <p className="text-crd-lightGray text-sm">{currentFrame.description}</p>
          </div>
        </div>
      </div>

      {/* Player Info Section */}
      <Card className="bg-crd-darker border-crd-mediumGray/20 max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-crd-white text-sm font-medium mb-1">
                Player Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                placeholder="Enter player name"
              />
            </div>
            <div>
              <label className="block text-crd-white text-sm font-medium mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-crd-mediumGray/20 border border-crd-mediumGray/30 rounded px-3 py-2 text-crd-white"
                placeholder="Enter team name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Color Selector */}
      <div className="max-w-2xl mx-auto">
        <TeamColorSelector
          selectedColorScheme={selectedColorScheme || undefined}
          onColorSchemeSelect={handleColorSchemeSelect}
        />
      </div>

      {/* Template Selection */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Baseball Card Templates
          </CardTitle>
          <p className="text-crd-lightGray text-sm">
            Choose from professional baseball card designs. No Frame option for complete artwork.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BASEBALL_CARD_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={currentFrame.id === template.id}
                onSelect={handleFrameSelection}
                playerName={playerName}
                teamName={teamName}
                colorScheme={selectedColorScheme}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

// Template selection card component
const TemplateCard = ({ 
  template, 
  isSelected, 
  onSelect,
  playerName,
  teamName,
  colorScheme
}: { 
  template: DesignTemplate; 
  isSelected: boolean; 
  onSelect: (template: DesignTemplate) => void;
  playerName: string;
  teamName: string;
  colorScheme: TeamColorScheme | null;
}) => (
  <div
    onClick={() => onSelect(template)}
    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
      isSelected
        ? 'border-crd-green bg-crd-green/10'
        : 'border-crd-mediumGray/30 hover:border-crd-green/50'
    }`}
  >
    <div className="aspect-[5/7] bg-white rounded mb-2 overflow-hidden">
      <SVGTemplateRenderer
        template={template}
        playerName={playerName}
        teamName={teamName}
        customColors={colorScheme || undefined}
        className="w-full h-full"
      />
    </div>
    
    <div className="text-center">
      <h4 className="text-crd-white font-medium text-xs mb-1 flex items-center justify-center gap-1">
        {template.name}
        {template.id === 'no-frame' && <Maximize className="w-3 h-3 text-crd-green" />}
      </h4>
      <div className="flex items-center justify-between text-xs">
        <span className="text-crd-lightGray">
          {template.category}
        </span>
        {template.is_premium && (
          <span className="text-crd-green font-medium">PRO</span>
        )}
      </div>
    </div>
  </div>
);
