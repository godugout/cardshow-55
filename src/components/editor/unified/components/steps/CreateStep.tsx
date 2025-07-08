import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Palette, Sparkles, Zap, Chrome, Stars } from 'lucide-react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import { TeamColorSelector } from '@/components/editor/templates/TeamColorSelector';
import { useColorThemes } from '@/hooks/useColorThemes';
import { convertColorThemeToScheme, type TeamColorScheme } from '@/components/editor/templates/TeamColors';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface CreateStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const CreateStep = ({ mode, cardData, onFieldUpdate }: CreateStepProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<DesignTemplate>(BASEBALL_CARD_TEMPLATES[0]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<TeamColorScheme | null>(null);
  const [playerName, setPlayerName] = useState(cardData?.title || 'PLAYER NAME');
  const [teamName, setTeamName] = useState('TEAM');
  
  // Effect states
  const [chromeEffect, setChromeEffect] = useState(false);
  const [holographicEffect, setHolographicEffect] = useState(false);
  const [foilEffect, setFoilEffect] = useState(false);
  const [chromeIntensity, setChromeIntensity] = useState([50]);
  const [holographicIntensity, setHolographicIntensity] = useState([50]);
  const [foilIntensity, setFoilIntensity] = useState([50]);
  
  const { colorThemes, loading: themesLoading } = useColorThemes();

  // Set default color scheme when themes load
  useEffect(() => {
    if (!selectedColorScheme && colorThemes.length > 0 && !themesLoading) {
      const defaultTheme = convertColorThemeToScheme(colorThemes[0]);
      setSelectedColorScheme(defaultTheme);
    }
  }, [colorThemes, themesLoading, selectedColorScheme]);

  const handleFileUpload = (file: File) => {
    console.log('📁 CreateStep: File selected:', file.name, file.type, file.size);
    const url = URL.createObjectURL(file);
    console.log('🔗 CreateStep: Generated URL:', url);
    console.log('🔄 CreateStep: Calling onFieldUpdate with:', 'image_url', url);
    onFieldUpdate('image_url', url);
    console.log('✅ CreateStep: File upload completed');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const quickFrames = BASEBALL_CARD_TEMPLATES.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-themed-primary mb-2">Create Your Card</h2>
        <p className="text-themed-secondary">
          Upload your photo, add details, and choose your initial design
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload & Info */}
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="card-themed">
            <div className="p-6 border-b border-themed-light">
              <h3 className="text-themed-primary flex items-center gap-2 text-lg font-semibold">
                <Upload className="w-5 h-5" />
                Upload Photo
              </h3>
            </div>
            <div className="p-6">
              <UniversalUploadComponent
                onFilesSelected={(files) => {
                  if (files.length > 0) {
                    handleFileUpload(files[0]);
                  }
                }}
                onError={(error) => {
                  console.error('Upload error:', error);
                  // You could add toast notification here if needed
                }}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                maxSize={10 * 1024 * 1024} // 10MB
                maxFiles={1}
                multiple={false}
              />
            </div>
          </div>

          {/* Card Details */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white">Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-crd-white">Card Title *</Label>
                <Input
                  id="title"
                  value={cardData.title || ''}
                  onChange={(e) => onFieldUpdate('title', e.target.value)}
                  placeholder="Enter player name or card title"
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-crd-white">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description || ''}
                  onChange={(e) => onFieldUpdate('description', e.target.value)}
                  placeholder="Describe your card..."
                  rows={3}
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-crd-white">Card Rarity</Label>
                <Select value={cardData.rarity || 'common'} onValueChange={(value) => onFieldUpdate('rarity', value)}>
                  <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-darker border-crd-mediumGray/30">
                    <SelectItem value="common" className="text-crd-white">Common</SelectItem>
                    <SelectItem value="uncommon" className="text-crd-white">Uncommon</SelectItem>
                    <SelectItem value="rare" className="text-crd-white">Rare</SelectItem>
                    <SelectItem value="legendary" className="text-crd-white">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Character Count */}
              <div className="grid grid-cols-2 gap-4 text-xs text-crd-lightGray">
                <div>Title: {cardData.title?.length || 0}/50</div>
                <div>Description: {cardData.description?.length || 0}/200</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Frame & Team Colors */}
        <div className="space-y-6">
          {/* Quick Frame Selection */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Image className="w-5 h-5" />
                Choose Frame
              </CardTitle>
              <p className="text-crd-lightGray text-sm">Select your starting template</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {quickFrames.map((frame) => (
                  <div
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedFrame.id === frame.id
                        ? 'ring-2 ring-crd-green scale-105'
                        : 'hover:scale-102 hover:ring-1 hover:ring-crd-lightGray/50'
                    }`}
                  >
                    <SVGTemplateRenderer
                      template={frame}
                      playerName={playerName}
                      teamName={teamName}
                      imageUrl={cardData.image_url}
                      customColors={selectedColorScheme}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                      <p className="text-white text-xs text-center truncate">{frame.name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-crd-lightGray text-sm">
                  More templates available in the next step
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card Effects */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Card Effects
              </CardTitle>
              <p className="text-crd-lightGray text-sm">Add special effects to your card</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chrome Effect */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white">Chrome Effect</Label>
                  </div>
                  <Switch
                    checked={chromeEffect}
                    onCheckedChange={setChromeEffect}
                  />
                </div>
                {chromeEffect && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-crd-lightGray text-sm">Intensity</Label>
                    <Slider
                      value={chromeIntensity}
                      onValueChange={setChromeIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray">{chromeIntensity[0]}%</div>
                  </div>
                )}
              </div>

              {/* Holographic Effect */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white">Holographic</Label>
                  </div>
                  <Switch
                    checked={holographicEffect}
                    onCheckedChange={setHolographicEffect}
                  />
                </div>
                {holographicEffect && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-crd-lightGray text-sm">Intensity</Label>
                    <Slider
                      value={holographicIntensity}
                      onValueChange={setHolographicIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray">{holographicIntensity[0]}%</div>
                  </div>
                )}
              </div>

              {/* Foil Effect */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white">Foil Effect</Label>
                  </div>
                  <Switch
                    checked={foilEffect}
                    onCheckedChange={setFoilEffect}
                  />
                </div>
                {foilEffect && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-crd-lightGray text-sm">Intensity</Label>
                    <Slider
                      value={foilIntensity}
                      onValueChange={setFoilIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray">{foilIntensity[0]}%</div>
                  </div>
                )}
              </div>

              {/* Live Preview Badge */}
              {(chromeEffect || holographicEffect || foilEffect) && (
                <div className="flex items-center justify-center pt-4 border-t border-crd-mediumGray/20">
                  <Badge className="bg-crd-green/20 text-crd-green border-crd-green/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Effects will show in live preview
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Colors */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Team Colors
              </CardTitle>
              <p className="text-crd-lightGray text-sm">Personalize with team colors</p>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px]">
                <TeamColorSelector
                  selectedColorScheme={selectedColorScheme}
                  onColorSchemeSelect={(scheme) => {
                    setSelectedColorScheme(scheme);
                    console.log('Team colors updated:', scheme);
                  }}
                  className=""
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};