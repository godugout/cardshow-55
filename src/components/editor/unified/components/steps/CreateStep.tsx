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
import { Upload, Image, Palette, Sparkles, Zap, Chrome, Stars, Eye, Frame } from 'lucide-react';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Team Colors */}
        <div className="space-y-4">

          {/* Card Details */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white text-base">Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-crd-white text-sm">Card Title *</Label>
                <Input
                  id="title"
                  value={cardData.title || ''}
                  onChange={(e) => onFieldUpdate('title', e.target.value)}
                  placeholder="Enter player name"
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white h-9"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-crd-white text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description || ''}
                  onChange={(e) => onFieldUpdate('description', e.target.value)}
                  placeholder="Describe your card..."
                  rows={2}
                  className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-crd-white text-sm">Card Rarity</Label>
                <Select value={cardData.rarity || 'common'} onValueChange={(value) => onFieldUpdate('rarity', value)}>
                  <SelectTrigger className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white h-9">
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
            </CardContent>
          </Card>

          {/* Team Colors */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Palette className="w-4 h-4" />
                Team Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 overflow-hidden">
                <TeamColorSelector
                  selectedColorScheme={selectedColorScheme}
                  onColorSchemeSelect={(scheme) => {
                    setSelectedColorScheme(scheme);
                  }}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Preview Canvas */}
        <div className="space-y-4">
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Eye className="w-4 h-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Grid Background */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Preview Canvas */}
                <div className="aspect-[5/7] bg-crd-mediumGray/10 rounded-lg border border-crd-mediumGray/30 overflow-hidden relative">
                  {cardData.image_url ? (
                    <div className="w-full h-full relative">
                      <SVGTemplateRenderer
                        template={selectedFrame}
                        imageUrl={cardData.image_url}
                        playerName={playerName}
                        teamName={teamName}
                        customColors={selectedColorScheme}
                        className="w-full h-full"
                      />
                      {/* Effect Overlays */}
                      {chromeEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-600/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: chromeIntensity[0] / 100 }}
                        />
                      )}
                      {holographicEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-green-400/20 mix-blend-screen pointer-events-none animate-pulse"
                          style={{ opacity: holographicIntensity[0] / 100 }}
                        />
                      )}
                      {foilEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: foilIntensity[0] / 100 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <UniversalUploadComponent
                        onFilesSelected={(files) => {
                          if (files.length > 0) {
                            handleFileUpload(files[0]);
                          }
                        }}
                        onError={(error) => {
                          console.error('Upload error:', error);
                        }}
                        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                        maxSize={10 * 1024 * 1024} // 10MB
                        maxFiles={1}
                        multiple={false}
                      />
                    </div>
                  )}
                </div>
                
                {/* Frame Info */}
                <div className="mt-3 text-center">
                  <h4 className="text-crd-white font-medium text-sm">{selectedFrame.name}</h4>
                  <p className="text-crd-lightGray text-xs">{selectedFrame.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Frame Selection & Effects */}
        <div className="space-y-4">
          {/* Quick Frame Selection */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Frame className="w-4 h-4" />
                Choose Frame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickFrames.map((frame) => (
                  <div
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all ${
                      selectedFrame.id === frame.id
                        ? 'ring-2 ring-crd-green scale-105'
                        : 'hover:scale-102 hover:ring-1 hover:ring-crd-lightGray/50'
                    }`}
                  >
                    <SVGTemplateRenderer
                      template={frame}
                      playerName="PLAYER"
                      teamName="TEAM"
                      customColors={selectedColorScheme}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                      <p className="text-white text-xs text-center truncate">{frame.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card Effects */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4" />
                Card Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chrome Effect */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-3 h-3 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm">Chrome</Label>
                  </div>
                  <Switch
                    checked={chromeEffect}
                    onCheckedChange={setChromeEffect}
                  />
                </div>
                {chromeEffect && (
                  <div className="ml-5 space-y-1">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm">Holographic</Label>
                  </div>
                  <Switch
                    checked={holographicEffect}
                    onCheckedChange={setHolographicEffect}
                  />
                </div>
                {holographicEffect && (
                  <div className="ml-5 space-y-1">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars className="w-3 h-3 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm">Foil</Label>
                  </div>
                  <Switch
                    checked={foilEffect}
                    onCheckedChange={setFoilEffect}
                  />
                </div>
                {foilEffect && (
                  <div className="ml-5 space-y-1">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};