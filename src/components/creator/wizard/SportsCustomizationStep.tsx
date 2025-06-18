
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, User, Award, Hash, Tag, X } from 'lucide-react';
import { useCardEditor, type DesignTemplate } from '@/hooks/useCardEditor';
import { toast } from 'sonner';

interface SportsCustomizationStepProps {
  cardEditor: ReturnType<typeof useCardEditor>;
  selectedTemplate: DesignTemplate | null;
}

export const SportsCustomizationStep = ({ cardEditor, selectedTemplate }: SportsCustomizationStepProps) => {
  const { cardData, updateCardField, addTag, removeTag, tags, hasMaxTags } = cardEditor;
  const [newTag, setNewTag] = React.useState('');

  const isSportsTemplate = selectedTemplate?.category === 'sports';
  const isEntertainmentTemplate = selectedTemplate?.category === 'entertainment';

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const rarityOptions = [
    { value: 'common', label: 'Common', color: 'bg-gray-500', description: 'Standard card' },
    { value: 'uncommon', label: 'Uncommon', color: 'bg-green-500', description: 'Above average' },
    { value: 'rare', label: 'Rare', color: 'bg-blue-500', description: 'Limited availability' },
    { value: 'ultra-rare', label: 'Ultra Rare', color: 'bg-purple-500', description: 'Very scarce' },
    { value: 'legendary', label: 'Legendary', color: 'bg-yellow-500', description: 'Extremely rare' }
  ];

  const sportsPositions = {
    baseball: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'],
    basketball: ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
    football: ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker'],
    soccer: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker']
  };

  const entertainmentRoles = {
    music: ['Vocalist', 'Guitarist', 'Drummer', 'Bassist', 'Keyboardist', 'Producer', 'DJ', 'Songwriter'],
    film: ['Actor', 'Director', 'Producer', 'Screenwriter', 'Cinematographer', 'Editor']
  };

  const getCurrentPositions = () => {
    if (!selectedTemplate) return [];
    
    const templateId = selectedTemplate.id;
    if (templateId.includes('baseball')) return sportsPositions.baseball;
    if (templateId.includes('basketball')) return sportsPositions.basketball;
    if (templateId.includes('football')) return sportsPositions.football;
    if (templateId.includes('soccer')) return sportsPositions.soccer;
    
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Customize Your Card</h2>
        <p className="text-crd-lightGray">
          Add details and information to make your card unique and professional
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="bg-crd-mediumGray w-full">
          <TabsTrigger 
            value="basic" 
            className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <User className="w-4 h-4 mr-2" />
            Basic Info
          </TabsTrigger>
          {isSportsTemplate && (
            <TabsTrigger 
              value="sports" 
              className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Sports Details
            </TabsTrigger>
          )}
          {isEntertainmentTemplate && (
            <TabsTrigger 
              value="entertainment" 
              className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <Award className="w-4 h-4 mr-2" />
              Entertainment
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="settings" 
            className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <Hash className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-medium">Card Title *</Label>
              <Input
                value={cardData.title}
                onChange={(e) => updateCardField('title', e.target.value)}
                placeholder="Enter the main title for your card"
                className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
              />
              <p className="text-xs text-crd-lightGray">
                This will be the main heading on your card
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Rarity</Label>
              <Select value={cardData.rarity} onValueChange={(value: any) => updateCardField('rarity', value)}>
                <SelectTrigger className="bg-crd-mediumGray border-crd-mediumGray text-white">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  {rarityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${option.color}`} />
                        <div>
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500 ml-2">{option.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-medium">Description</Label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => updateCardField('description', e.target.value)}
              placeholder="Add a description or background story for your card"
              className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray min-h-[100px]"
            />
            <p className="text-xs text-crd-lightGray">
              Describe what makes this card special or add background information
            </p>
          </div>
        </TabsContent>

        {isSportsTemplate && (
          <TabsContent value="sports" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-medium">Player/Athlete Name</Label>
                <Input
                  value={cardData.design_metadata?.playerName || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ playerName: e.target.value })}
                  placeholder="Enter player name"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Team/Club</Label>
                <Input
                  value={cardData.design_metadata?.team || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ team: e.target.value })}
                  placeholder="Enter team name"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Position</Label>
                <Select
                  value={cardData.design_metadata?.position || ''}
                  onValueChange={(value) => cardEditor.updateDesignMetadata({ position: value })}
                >
                  <SelectTrigger className="bg-crd-mediumGray border-crd-mediumGray text-white">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentPositions().map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Jersey Number</Label>
                <Input
                  type="number"
                  value={cardData.design_metadata?.jerseyNumber || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ jerseyNumber: e.target.value })}
                  placeholder="Enter jersey number"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Stats & Achievements</Label>
              <Textarea
                value={cardData.design_metadata?.stats || ''}
                onChange={(e) => cardEditor.updateDesignMetadata({ stats: e.target.value })}
                placeholder="Enter key statistics, achievements, or career highlights"
                className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray min-h-[80px]"
              />
            </div>
          </TabsContent>
        )}

        {isEntertainmentTemplate && (
          <TabsContent value="entertainment" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-medium">Artist/Performer Name</Label>
                <Input
                  value={cardData.design_metadata?.artistName || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ artistName: e.target.value })}
                  placeholder="Enter artist name"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Genre/Category</Label>
                <Input
                  value={cardData.design_metadata?.genre || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ genre: e.target.value })}
                  placeholder="e.g., Pop, Rock, Action, Drama"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Label/Studio</Label>
                <Input
                  value={cardData.design_metadata?.label || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ label: e.target.value })}
                  placeholder="Record label or movie studio"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Year</Label>
                <Input
                  value={cardData.design_metadata?.year || ''}
                  onChange={(e) => cardEditor.updateDesignMetadata({ year: e.target.value })}
                  placeholder="Career start or breakthrough year"
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Notable Works & Achievements</Label>
              <Textarea
                value={cardData.design_metadata?.achievements || ''}
                onChange={(e) => cardEditor.updateDesignMetadata({ achievements: e.target.value })}
                placeholder="List major albums, movies, awards, or career highlights"
                className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray min-h-[80px]"
              />
            </div>
          </TabsContent>
        )}

        <TabsContent value="settings" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white font-medium mb-3 block">
                <Tag className="w-4 h-4 inline mr-2" />
                Tags ({tags.length}/10)
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-crd-mediumGray text-white">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag"
                  disabled={hasMaxTags}
                  className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                />
                <Button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || hasMaxTags}
                  className="bg-crd-green hover:bg-crd-green/90 text-black"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-crd-lightGray mt-2">
                Tags help others discover your card. You can add up to 10 tags.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Creator Attribution</Label>
              <Input
                value={cardData.creator_attribution?.creator_name || ''}
                onChange={(e) => updateCardField('creator_attribution', {
                  ...cardData.creator_attribution,
                  creator_name: e.target.value
                })}
                placeholder="Your name or username"
                className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
              />
              <p className="text-xs text-crd-lightGray">
                This will appear as the creator credit on your card
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
