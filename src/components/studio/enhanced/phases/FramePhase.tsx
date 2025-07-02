import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Check } from 'lucide-react';

interface FramePhaseProps {
  selectedFrame: string | null;
  uploadedImages: File[];
  onFrameSelected: (frameId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface FrameOption {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

const frameOptions: FrameOption[] = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    category: 'Traditional',
    preview: '/api/placeholder/300/400',
    description: 'Elegant gold border with ornate details',
    rarity: 'rare',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'Contemporary',
    preview: '/api/placeholder/300/400',
    description: 'Clean lines with subtle gradients',
    rarity: 'common',
  },
  {
    id: 'holographic-premium',
    name: 'Holographic Premium',
    category: 'Special',
    preview: '/api/placeholder/300/400',
    description: 'Shimmering holographic effects',
    rarity: 'legendary',
  },
  {
    id: 'vintage-worn',
    name: 'Vintage Worn',
    category: 'Retro',
    preview: '/api/placeholder/300/400',
    description: 'Weathered look with character',
    rarity: 'uncommon',
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    category: 'Futuristic',
    preview: '/api/placeholder/300/400',
    description: 'Glowing neon accents and digital patterns',
    rarity: 'epic',
  },
  {
    id: 'nature-organic',
    name: 'Nature Organic',
    category: 'Natural',
    preview: '/api/placeholder/300/400',
    description: 'Leaf and wood textures',
    rarity: 'uncommon',
  },
];

const rarityColors = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500',
};

export const FramePhase: React.FC<FramePhaseProps> = ({
  selectedFrame,
  uploadedImages,
  onFrameSelected,
  onNext,
  onPrevious,
}) => {
  const [selected, setSelected] = useState<string | null>(selectedFrame);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(frameOptions.map(f => f.category))];
  const filteredFrames = filter === 'all' 
    ? frameOptions 
    : frameOptions.filter(f => f.category === filter);

  const handleFrameSelect = (frameId: string) => {
    setSelected(frameId);
    onFrameSelected(frameId);
  };

  const canProceed = selected !== null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Choose Your Frame</h2>
        <p className="text-gray-400">
          Select a frame style that complements your images
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category)}
            className={filter === category ? 'bg-crd-green text-black' : ''}
          >
            {category === 'all' ? 'All Frames' : category}
          </Button>
        ))}
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFrames.map(frame => (
          <Card
            key={frame.id}
            className={`relative cursor-pointer transition-all hover:scale-105 ${
              selected === frame.id
                ? 'ring-2 ring-crd-green shadow-lg shadow-crd-green/25'
                : 'hover:ring-1 hover:ring-crd-green/50'
            }`}
            onClick={() => handleFrameSelect(frame.id)}
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-crd-dark to-crd-darker rounded-lg overflow-hidden">
              {/* Frame Preview with Sample Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-crd-border rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs text-center">Frame<br/>Preview</span>
                </div>
                
                {/* Selection Indicator */}
                {selected === frame.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green text-black rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{frame.name}</h3>
                <Badge 
                  className={`text-xs ${rarityColors[frame.rarity]} text-white`}
                >
                  {frame.rarity}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-2">{frame.description}</p>
              <p className="text-xs text-gray-500">{frame.category}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-crd-green text-black hover:bg-crd-green/90"
        >
          Continue to Effects
        </Button>
      </div>
    </div>
  );
};