
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Trash2, 
  Download,
  Eye,
  Star
} from 'lucide-react';
import { useTeamCustomization } from '@/hooks/useTeamCustomization';
import { colorMapper } from '@/lib/crdmkr/colorMapper';
import { toast } from 'sonner';

interface TeamAssetManagerProps {
  selectedTeamId?: string;
  onTeamSelect?: (teamId: string) => void;
}

export const TeamAssetManager = ({ selectedTeamId, onTeamSelect }: TeamAssetManagerProps) => {
  const {
    teams,
    teamBranding,
    uploadProgress,
    uploadTeamAsset,
    updateTeamColors,
    updateTeamTypography,
    searchTeams
  } = useTeamCustomization();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('assets');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const filteredTeams = searchTeams(searchQuery);
  const currentTeam = selectedTeamId ? teamBranding[selectedTeamId] : null;

  const handleFileUpload = async (teamId: string, assetType: 'logo' | 'wordmark' | 'icon', file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload SVG, PNG, JPEG, or WebP files only');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const result = await uploadTeamAsset(teamId, file, assetType);
    if (result) {
      toast.success(`${assetType} uploaded successfully!`);
    } else {
      toast.error(`Failed to upload ${assetType}`);
    }
  };

  const handleColorChange = (teamId: string, colorType: string, value: string) => {
    updateTeamColors(teamId, { [colorType]: value });
  };

  const generateSmartPalette = async (teamId: string) => {
    const branding = teamBranding[teamId];
    if (!branding) return;

    // If team has a logo, extract colors from it
    const logoAsset = branding.assets.find(asset => asset.assetType === 'logo' && asset.isDefault);
    
    if (logoAsset) {
      try {
        const dominantColors = await colorMapper.extractDominantColors(logoAsset.assetUrl);
        if (dominantColors.length > 0) {
          const palette = colorMapper.generateAccessiblePalette(dominantColors[0]);
          updateTeamColors(teamId, palette);
          toast.success('Smart color palette generated from logo!');
        }
      } catch (error) {
        console.error('Failed to extract colors:', error);
        toast.error('Failed to generate palette from logo');
      }
    } else {
      // Generate palette from current primary color
      const palette = colorMapper.generateAccessiblePalette(branding.colors.primary);
      updateTeamColors(teamId, palette);
      toast.success('Smart color palette generated!');
    }
  };

  const renderTeamSelector = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-crd-white">Search Teams</Label>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or abbreviation..."
          className="bg-crd-darker border-crd-mediumGray/30 text-crd-white"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
        {filteredTeams.map((team) => (
          <Card
            key={team.id}
            className={`cursor-pointer transition-colors ${
              selectedTeamId === team.id
                ? 'bg-crd-green/20 border-crd-green'
                : 'bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50'
            }`}
            onClick={() => onTeamSelect?.(team.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.primaryColor || '#1a365d' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-crd-white font-medium truncate">{team.name}</p>
                  <p className="text-crd-lightGray text-sm">{team.abbreviation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAssetManager = () => {
    if (!currentTeam) {
      return (
        <div className="text-center py-8">
          <ImageIcon className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
          <p className="text-crd-lightGray">Select a team to manage assets</p>
        </div>
      );
    }

    const assetTypes: Array<{ type: 'logo' | 'wordmark' | 'icon'; label: string; description: string }> = [
      { type: 'logo', label: 'Primary Logo', description: 'Main team logo for cards' },
      { type: 'wordmark', label: 'Wordmark', description: 'Text-based team logo' },
      { type: 'icon', label: 'Icon', description: 'Simplified team symbol' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-crd-white">{currentTeam.teamName}</h3>
          <Badge variant="outline" className="text-crd-green border-crd-green">
            {currentTeam.assets.length} Assets
          </Badge>
        </div>

        {assetTypes.map((assetConfig) => {
          const assets = currentTeam.assets.filter(asset => asset.assetType === assetConfig.type);
          const inputKey = `${currentTeam.teamId}-${assetConfig.type}`;
          const uploadKey = `${currentTeam.teamId}/${assetConfig.type}`;
          const progress = uploadProgress[uploadKey];

          return (
            <Card key={assetConfig.type} className="bg-crd-darker border-crd-mediumGray/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-crd-white text-base">{assetConfig.label}</CardTitle>
                    <p className="text-sm text-crd-lightGray">{assetConfig.description}</p>
                  </div>
                  <CRDButton
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRefs.current[inputKey]?.click()}
                    disabled={progress !== undefined}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </CRDButton>
                </div>
              </CardHeader>
              <CardContent>
                {progress !== undefined && (
                  <div className="mb-4">
                    <div className="w-full bg-crd-mediumGray/20 rounded-full h-2">
                      <div 
                        className="bg-crd-green h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-crd-lightGray mt-1">{Math.round(progress)}% uploaded</p>
                  </div>
                )}

                {assets.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {assets.map((asset) => (
                      <div key={asset.id} className="relative group">
                        <div className="aspect-square bg-crd-darkest rounded-lg overflow-hidden border border-crd-mediumGray/30">
                          <img
                            src={asset.assetUrl}
                            alt={`${assetConfig.label} for ${currentTeam.teamName}`}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <CRDButton size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </CRDButton>
                          {asset.isDefault && (
                            <Badge className="bg-crd-green text-black">
                              <Star className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-crd-mediumGray/30 rounded-lg">
                    <ImageIcon className="w-8 h-8 text-crd-mediumGray mx-auto mb-2" />
                    <p className="text-crd-lightGray text-sm">No {assetConfig.label.toLowerCase()} uploaded</p>
                  </div>
                )}

                <input
                  ref={(el) => fileInputRefs.current[inputKey] = el}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(currentTeam.teamId, assetConfig.type, file);
                    }
                  }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderColorManager = () => {
    if (!currentTeam) {
      return (
        <div className="text-center py-8">
          <Palette className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
          <p className="text-crd-lightGray">Select a team to manage colors</p>
        </div>
      );
    }

    const colorFields = [
      { key: 'primary', label: 'Primary Color', description: 'Main team color' },
      { key: 'secondary', label: 'Secondary Color', description: 'Supporting color' },
      { key: 'accent', label: 'Accent Color', description: 'Highlight color' },
      { key: 'text', label: 'Text Color', description: 'Default text color' },
      { key: 'background', label: 'Background Color', description: 'Background color' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-crd-white">{currentTeam.teamName} Colors</h3>
          <CRDButton
            size="sm"
            variant="outline"
            onClick={() => generateSmartPalette(currentTeam.teamId)}
          >
            <Palette className="w-4 h-4 mr-2" />
            Smart Palette
          </CRDButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-crd-white">{field.label}</Label>
              <p className="text-sm text-crd-lightGray">{field.description}</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={currentTeam.colors[field.key as keyof typeof currentTeam.colors] || '#000000'}
                  onChange={(e) => handleColorChange(currentTeam.teamId, field.key, e.target.value)}
                  className="w-12 h-10 rounded border-none cursor-pointer"
                />
                <Input
                  value={currentTeam.colors[field.key as keyof typeof currentTeam.colors] || '#000000'}
                  onChange={(e) => handleColorChange(currentTeam.teamId, field.key, e.target.value)}
                  className="flex-1 bg-crd-darker border-crd-mediumGray/30 text-crd-white font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Color Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-base">Color Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {colorFields.map((field) => (
                <div key={field.key} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2"
                    style={{ 
                      backgroundColor: currentTeam.colors[field.key as keyof typeof currentTeam.colors] 
                    }}
                  />
                  <p className="text-xs text-crd-lightGray">{field.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTypographyManager = () => {
    if (!currentTeam) {
      return (
        <div className="text-center py-8">
          <Type className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
          <p className="text-crd-lightGray">Select a team to manage typography</p>
        </div>
      );
    }

    const fontOptions = [
      'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
      'Poppins', 'Source Sans Pro', 'Oswald', 'Raleway', 'Nunito'
    ];

    const weightOptions = [
      { value: '300', label: 'Light' },
      { value: '400', label: 'Regular' },
      { value: '500', label: 'Medium' },
      { value: '600', label: 'Semi Bold' },
      { value: '700', label: 'Bold' },
      { value: '800', label: 'Extra Bold' }
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-crd-white">{currentTeam.teamName} Typography</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-crd-white">Primary Font</Label>
              <select
                value={currentTeam.typography.primaryFont}
                onChange={(e) => updateTeamTypography(currentTeam.teamId, { primaryFont: e.target.value })}
                className="w-full mt-1 bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md p-2"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-crd-white">Secondary Font</Label>
              <select
                value={currentTeam.typography.secondaryFont}
                onChange={(e) => updateTeamTypography(currentTeam.teamId, { secondaryFont: e.target.value })}
                className="w-full mt-1 bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md p-2"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-crd-white">Heading Weight</Label>
              <select
                value={currentTeam.typography.headingWeight}
                onChange={(e) => updateTeamTypography(currentTeam.teamId, { headingWeight: e.target.value })}
                className="w-full mt-1 bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md p-2"
              >
                {weightOptions.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-crd-white">Body Weight</Label>
              <select
                value={currentTeam.typography.bodyWeight}
                onChange={(e) => updateTeamTypography(currentTeam.teamId, { bodyWeight: e.target.value })}
                className="w-full mt-1 bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md p-2"
              >
                {weightOptions.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-base">Typography Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 
                  className="text-2xl text-crd-white"
                  style={{ 
                    fontFamily: currentTeam.typography.primaryFont,
                    fontWeight: currentTeam.typography.headingWeight
                  }}
                >
                  {currentTeam.teamName}
                </h2>
              </div>
              <div>
                <p 
                  className="text-crd-lightGray"
                  style={{ 
                    fontFamily: currentTeam.typography.secondaryFont,
                    fontWeight: currentTeam.typography.bodyWeight
                  }}
                >
                  This is how body text will appear on cards using the selected typography settings. 
                  The secondary font is typically used for player names, stats, and other detailed information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Team Selection</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTeamSelector()}
        </CardContent>
      </Card>

      {/* Asset Management Tabs */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="p-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 bg-crd-darkest">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="assets">
                {renderAssetManager()}
              </TabsContent>

              <TabsContent value="colors">
                {renderColorManager()}
              </TabsContent>

              <TabsContent value="typography">
                {renderTypographyManager()}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
