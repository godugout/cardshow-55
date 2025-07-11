import React, { useState } from 'react';
import { CRDEntry, getCardRarityFromDNA, generateCardMetadata } from '@/lib/cardshowDNA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, Trophy, Zap } from 'lucide-react';

interface SampleCardGeneratorProps {
  selectedDNA: CRDEntry[];
}

interface GeneratedCard {
  id: string;
  title: string;
  description: string;
  appliedDNA: CRDEntry[];
  powerLevel: number;
  rarity: string;
  collectibilityScore: number;
  attributes: {
    speed: number;
    power: number;
    defense: number;
    special: number;
  };
  imagePreview: string;
}

const SAMPLE_CARD_TEMPLATES = [
  {
    id: 'player',
    name: 'Player Card',
    description: 'Classic player trading card',
    baseImage: '/placeholder.svg'
  },
  {
    id: 'team',
    name: 'Team Card', 
    description: 'Team logo and stats card',
    baseImage: '/placeholder.svg'
  },
  {
    id: 'stadium',
    name: 'Stadium Card',
    description: 'Venue and location card',
    baseImage: '/placeholder.svg'
  },
  {
    id: 'moment',
    name: 'Moment Card',
    description: 'Historic moment capture',
    baseImage: '/placeholder.svg'
  }
];

export const SampleCardGenerator: React.FC<SampleCardGeneratorProps> = ({ selectedDNA }) => {
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_CARD_TEMPLATES[0]);

  const generateSampleCard = () => {
    if (selectedDNA.length === 0) return;

    const metadata = generateCardMetadata(selectedDNA);
    const rarity = getCardRarityFromDNA(selectedDNA);
    
    // Calculate combined power level from selected DNA
    const totalPowerLevel = selectedDNA.reduce((sum, dna) => sum + dna.powerLevel, 0);
    const avgPowerLevel = Math.min(100, totalPowerLevel / selectedDNA.length);
    
    // Calculate collectibility score
    const collectibilityScore = selectedDNA.reduce((sum, dna) => sum + dna.collectibility, 0) / selectedDNA.length;
    
    // Generate attributes based on DNA properties
    const attributes = {
      speed: Math.floor(Math.random() * 20 + avgPowerLevel * 0.8),
      power: Math.floor(Math.random() * 20 + avgPowerLevel * 0.9), 
      defense: Math.floor(Math.random() * 20 + avgPowerLevel * 0.7),
      special: Math.floor(Math.random() * 30 + collectibilityScore * 0.6)
    };

    const newCard: GeneratedCard = {
      id: `card_${Date.now()}`,
      title: cardTitle || `${selectedTemplate.name} - ${selectedDNA[0].displayName}`,
      description: cardDescription || `Generated using ${selectedDNA.length} DNA segments`,
      appliedDNA: [...selectedDNA],
      powerLevel: Math.floor(avgPowerLevel),
      rarity,
      collectibilityScore: Math.floor(collectibilityScore),
      attributes,
      imagePreview: selectedTemplate.baseImage
    };

    setGeneratedCards(prev => [newCard, ...prev]);
    setCardTitle('');
    setCardDescription('');
  };

  const clearGeneratedCards = () => {
    setGeneratedCards([]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-crd-base border-crd-border">
        <CardHeader>
          <CardTitle className="text-crd-bright flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Sample Card Generator
          </CardTitle>
          <CardDescription className="text-crd-light">
            Generate sample cards using selected DNA segments. Cards inherit properties from applied DNA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card Template Selection */}
          <div className="space-y-3">
            <Label className="text-crd-bright">Card Template</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SAMPLE_CARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedTemplate.id === template.id
                      ? 'border-crd-primary bg-crd-primary/10 text-crd-bright'
                      : 'border-crd-border hover:border-crd-mediumGray text-crd-light'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs opacity-70">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-title" className="text-crd-bright">Card Title</Label>
              <Input
                id="card-title"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Enter card title..."
                className="bg-crd-darkest border-crd-border text-crd-bright"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-description" className="text-crd-bright">Description</Label>
              <Input
                id="card-description"
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                placeholder="Enter card description..."
                className="bg-crd-darkest border-crd-border text-crd-bright"
              />
            </div>
          </div>

          {/* Selected DNA Preview */}
          {selectedDNA.length > 0 && (
            <div className="space-y-3">
              <Label className="text-crd-bright">Applied DNA Segments ({selectedDNA.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedDNA.map((dna) => (
                  <Badge key={dna.id} variant="secondary" className="text-xs">
                    {dna.displayName} • {dna.rarity} • ⚡{dna.powerLevel}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateSampleCard}
            disabled={selectedDNA.length === 0}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Sample Card
          </Button>
        </CardContent>
      </Card>

      {/* Generated Cards Display */}
      {generatedCards.length > 0 && (
        <Card className="bg-crd-base border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-crd-bright">Generated Cards ({generatedCards.length})</CardTitle>
              <CardDescription className="text-crd-light">
                Cards created using your DNA selections
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearGeneratedCards}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-crd-darkest border border-crd-border rounded-lg p-4 space-y-4"
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-crd-bright truncate">{card.title}</h3>
                      <Badge className={`text-xs ${
                        card.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                        card.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                        card.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                        card.rarity === 'uncommon' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {card.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-crd-light">{card.description}</p>
                  </div>

                  {/* Power Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-crd-light">Power Level</span>
                      <span className="text-crd-bright font-medium">{card.powerLevel}/100</span>
                    </div>
                    <Progress value={card.powerLevel} className="h-2" />
                  </div>

                  {/* Attributes */}
                  <div className="space-y-2">
                    <div className="text-sm text-crd-light">Attributes</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-400" />
                        <span className="text-crd-light">Speed:</span>
                        <span className="text-crd-bright">{card.attributes.speed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-red-400" />
                        <span className="text-crd-light">Power:</span>
                        <span className="text-crd-bright">{card.attributes.power}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400">🛡️</span>
                        <span className="text-crd-light">Defense:</span>
                        <span className="text-crd-bright">{card.attributes.defense}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        <span className="text-crd-light">Special:</span>
                        <span className="text-crd-bright">{card.attributes.special}</span>
                      </div>
                    </div>
                  </div>

                  {/* Applied DNA */}
                  <div className="space-y-2">
                    <div className="text-sm text-crd-light">Applied DNA ({card.appliedDNA.length})</div>
                    <div className="flex flex-wrap gap-1">
                      {card.appliedDNA.slice(0, 3).map((dna) => (
                        <Badge key={dna.id} variant="outline" className="text-xs">
                          {dna.group}
                        </Badge>
                      ))}
                      {card.appliedDNA.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.appliedDNA.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Collectibility Score */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-crd-light">Collectibility</span>
                    <span className="text-crd-primary font-medium">{card.collectibilityScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};