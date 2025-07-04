import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Upload, Image, Palette, Sparkles } from 'lucide-react';
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
  
  const { colorThemes, loading: themesLoading } = useColorThemes();

  // Set default color scheme when themes load
  useEffect(() => {
    if (!selectedColorScheme && colorThemes.length > 0 && !themesLoading) {
      const defaultTheme = convertColorThemeToScheme(colorThemes[0]);
      setSelectedColorScheme(defaultTheme);
    }
  }, [colorThemes, themesLoading, selectedColorScheme]);

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    onFieldUpdate('image_url', url);
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
        <h2 className="text-3xl font-bold text-crd-white mb-2">Create Your Card</h2>
        <p className="text-crd-lightGray">
          Upload your photo, add details, and choose your initial design
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload & Info */}
        <div className="space-y-6">
          {/* Photo Upload */}
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-crd-green bg-crd-green/10' 
                    : cardData.image_url
                      ? 'border-crd-green bg-crd-green/5'
                      : 'border-crd-mediumGray/30 hover:border-crd-lightGray/50'
                }`}
              >
                {cardData.image_url ? (
                  <div className="space-y-4">
                    <img 
                      src={cardData.image_url} 
                      alt="Card preview" 
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                    <div className="text-crd-green text-sm flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Photo ready for card creation!
                    </div>
                  </div>
                ) : (
                  <div>
                    <Image className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
                    <p className="text-crd-white text-lg mb-2">Drop your image here</p>
                    <p className="text-crd-lightGray text-sm mb-4">or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <CRDButton 
                        variant="outline"
                        className="cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        Choose File
                      </CRDButton>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
                    <SelectItem value="epic" className="text-crd-white">Epic</SelectItem>
                    <SelectItem value="legendary" className="text-crd-white">Legendary</SelectItem>
                  </SelectContent>
                </Select>
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
              <TeamColorSelector
                selectedColorScheme={selectedColorScheme}
                onColorSchemeSelect={setSelectedColorScheme}
                className="h-64 overflow-y-auto"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};