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

  const quickFrames = BASEBALL_CARD_TEMPLATES.slice(0, 6);

  return (
    <div className="h-screen flex flex-col bg-crd-darkest">
      {/* Header with Title and Progress */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-crd-mediumGray/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-crd-white mb-1">Create Your Card</h1>
            <p className="text-crd-lightGray text-sm">
              Upload your photo, add details, and choose your initial design
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-crd-lightGray">
            <span className="bg-crd-green text-black px-2 py-1 rounded text-xs font-medium">Step 1</span>
            <span>of 3</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0">
        {/* Left Sidebar - Details & Team Colors */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          {/* Card Details */}
          <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white text-base flex items-center gap-2">
                <Image className="w-4 h-4" />
                Card Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-crd-lightGray text-sm">Card Title *</Label>
                <Input
                  id="title"
                  value={cardData.title || ''}
                  onChange={(e) => onFieldUpdate('title', e.target.value)}
                  placeholder="Enter player name"
                  className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white h-9 focus:border-crd-green/50"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-crd-lightGray text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={cardData.description || ''}
                  onChange={(e) => onFieldUpdate('description', e.target.value)}
                  placeholder="Describe your card..."
                  rows={3}
                  className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white resize-none focus:border-crd-green/50"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-crd-lightGray text-sm">Card Rarity</Label>
                <Select value={cardData.rarity || 'common'} onValueChange={(value) => onFieldUpdate('rarity', value)}>
                  <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white h-9 focus:border-crd-green/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-darker border-crd-mediumGray/40 backdrop-blur-sm">
                    <SelectItem value="common" className="text-crd-white hover:bg-crd-mediumGray/50">Common</SelectItem>
                    <SelectItem value="uncommon" className="text-crd-white hover:bg-crd-mediumGray/50">Uncommon</SelectItem>
                    <SelectItem value="rare" className="text-crd-white hover:bg-crd-mediumGray/50">Rare</SelectItem>
                    <SelectItem value="legendary" className="text-crd-white hover:bg-crd-mediumGray/50">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Team Colors */}
          <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-sm flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Palette className="w-4 h-4" />
                Team Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full min-h-[300px] overflow-hidden">
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
        <div className="col-span-6 flex flex-col">
          <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-sm flex-1 flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Eye className="w-4 h-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Preview Canvas - Top Aligned */}
              <div className="flex justify-center mb-4">
                <div className="aspect-[5/7] w-full max-w-sm bg-crd-mediumGray/10 rounded-xl border border-crd-mediumGray/40 overflow-hidden relative shadow-2xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}>
                  {cardData.image_url ? (
                    <div className="w-full h-full relative">
                      <SVGTemplateRenderer
                        template={selectedFrame}
                        imageUrl={cardData.image_url}
                        playerName={cardData.title || 'PLAYER NAME'}
                        teamName={teamName}
                        customColors={selectedColorScheme}
                        className="w-full h-full"
                      />
                      {/* Effect Overlays */}
                      {chromeEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-lightGray/20 to-crd-mediumGray/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: chromeIntensity[0] / 100 }}
                        />
                      )}
                      {holographicEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-blue/20 via-crd-purple/20 to-crd-green/20 mix-blend-screen pointer-events-none animate-pulse"
                          style={{ opacity: holographicIntensity[0] / 100 }}
                        />
                      )}
                      {foilEffect && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-crd-orange/20 to-crd-green/20 mix-blend-overlay pointer-events-none"
                          style={{ opacity: foilIntensity[0] / 100 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6">
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
              </div>
              
              {/* Frame Info */}
              <div className="text-center">
                <h4 className="text-crd-white font-medium text-sm">{selectedFrame.name}</h4>
                <p className="text-crd-lightGray text-xs">{selectedFrame.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Frame Selection & Effects */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          {/* Quick Frame Selection */}
          <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Frame className="w-4 h-4" />
                Choose Frame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickFrames.map((frame) => (
                  <div
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedFrame.id === frame.id
                        ? 'ring-2 ring-crd-green scale-105 shadow-lg shadow-crd-green/20'
                        : 'hover:scale-102 hover:ring-1 hover:ring-crd-lightGray/50 hover:shadow-md'
                    }`}
                  >
                    <SVGTemplateRenderer
                      template={frame}
                      playerName="PLAYER"
                      teamName="TEAM"
                      customColors={selectedColorScheme}
                      className="w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-crd-white text-xs text-center truncate font-medium">{frame.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card Effects */}
          <Card className="bg-crd-darker/80 border-crd-mediumGray/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4" />
                Card Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chrome Effect */}
              <div className="space-y-3 p-3 rounded-lg bg-crd-darkest/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chrome className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm font-medium">Chrome</Label>
                  </div>
                  <Switch
                    checked={chromeEffect}
                    onCheckedChange={setChromeEffect}
                  />
                </div>
                {chromeEffect && (
                  <div className="space-y-2">
                    <Slider
                      value={chromeIntensity}
                      onValueChange={setChromeIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray text-center">{chromeIntensity[0]}% Intensity</div>
                  </div>
                )}
              </div>

              {/* Holographic Effect */}
              <div className="space-y-3 p-3 rounded-lg bg-crd-darkest/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm font-medium">Holographic</Label>
                  </div>
                  <Switch
                    checked={holographicEffect}
                    onCheckedChange={setHolographicEffect}
                  />
                </div>
                {holographicEffect && (
                  <div className="space-y-2">
                    <Slider
                      value={holographicIntensity}
                      onValueChange={setHolographicIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray text-center">{holographicIntensity[0]}% Intensity</div>
                  </div>
                )}
              </div>

              {/* Foil Effect */}
              <div className="space-y-3 p-3 rounded-lg bg-crd-darkest/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars className="w-4 h-4 text-crd-lightGray" />
                    <Label className="text-crd-white text-sm font-medium">Foil</Label>
                  </div>
                  <Switch
                    checked={foilEffect}
                    onCheckedChange={setFoilEffect}
                  />
                </div>
                {foilEffect && (
                  <div className="space-y-2">
                    <Slider
                      value={foilIntensity}
                      onValueChange={setFoilIntensity}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-crd-lightGray text-center">{foilIntensity[0]}% Intensity</div>
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