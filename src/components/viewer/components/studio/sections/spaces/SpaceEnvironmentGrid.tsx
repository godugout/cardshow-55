
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SpaceEnvironment } from '../../../../spaces/types';
import { SPACE_ENVIRONMENTS } from './constants';

interface SpaceEnvironmentGridProps {
  selectedSpace: SpaceEnvironment;
  onSpaceChange: (space: SpaceEnvironment) => void;
  isActive: boolean;
}

export const SpaceEnvironmentGrid: React.FC<SpaceEnvironmentGridProps> = ({
  selectedSpace,
  onSpaceChange,
  isActive
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('photorealistic');
  
  const categories = [
    { id: 'photorealistic', name: '360° Photos', emoji: '📸' },
    { id: 'basic', name: 'Basic', emoji: '⭐' },
    { id: 'sports', name: 'Sports', emoji: '🏟️' },
    { id: 'cultural', name: 'Cultural', emoji: '🏛️' },
    { id: 'retail', name: 'Retail', emoji: '🏪' },
    { id: 'natural', name: 'Natural', emoji: '🌍' },
    { id: 'professional', name: 'Professional', emoji: '🏢' },
    { id: 'themed', name: 'Themed', emoji: '🎭' }
  ];

  const filteredSpaces = SPACE_ENVIRONMENTS.filter(space => space.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">3D Spaces</h4>
        {isActive && (
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>
      
      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-black/20 rounded-lg p-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "text-xs py-2 px-1 rounded transition-all",
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <div className="flex flex-col items-center space-y-1">
              <span>{category.emoji}</span>
              <span className="text-[10px]">{category.name}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Spaces Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filteredSpaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onSpaceChange(space)}
            className={cn(
              "relative group rounded-lg overflow-hidden transition-all",
              "border-2 hover:scale-105",
              selectedSpace?.id === space.id && isActive
                ? "border-blue-400 shadow-lg shadow-blue-400/20"
                : "border-white/20 hover:border-white/40"
            )}
          >
            <img
              src={space.previewUrl}
              alt={space.name}
              className="w-full h-16 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-base mb-1">{space.emoji}</div>
                <div className="text-xs text-white font-medium px-1">
                  {space.name}
                </div>
              </div>
            </div>
            {selectedSpace?.id === space.id && isActive && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
            )}
            {space.type === 'panoramic' && (
              <div className="absolute bottom-1 left-1">
                <span className="text-xs text-blue-300 bg-blue-500/30 px-1 rounded">360°</span>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Category Description */}
      <div className="text-xs text-gray-400 bg-black/20 rounded p-2">
        <strong>{categories.find(c => c.id === selectedCategory)?.name}:</strong> {
          selectedCategory === 'photorealistic' ? 'Real 360° photography for immersive environments' :
          selectedCategory === 'basic' ? 'Essential 3D environments for card viewing' :
          selectedCategory === 'sports' ? 'Professional sports venues and arenas' :
          selectedCategory === 'cultural' ? 'Museums, galleries, and performance spaces' :
          selectedCategory === 'retail' ? 'Card shops, gaming lounges, and conventions' :
          selectedCategory === 'natural' ? 'Outdoor environments with realistic lighting' :
          selectedCategory === 'professional' ? 'Corporate and creative workspaces' :
          'Stylized and fantastical environments'
        }
      </div>
    </div>
  );
};
