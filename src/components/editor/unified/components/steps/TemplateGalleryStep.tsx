import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Search, Grid, Filter, Star, Zap } from 'lucide-react';
import { SVGTemplateRenderer } from '@/components/editor/templates/SVGTemplateRenderer';
import { BASEBALL_CARD_TEMPLATES } from '@/components/editor/templates/BaseballCardTemplates';
import type { CreationMode } from '../../types';
import type { CardData } from '@/hooks/useCardEditor';
import type { DesignTemplate } from '@/types/card';

interface TemplateGalleryStepProps {
  mode: CreationMode;
  cardData: CardData;
  onFieldUpdate: (field: keyof CardData, value: any) => void;
}

export const TemplateGalleryStep = ({ mode, cardData, onFieldUpdate }: TemplateGalleryStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Grid },
    { id: 'popular', name: 'Popular', icon: Star },
    { id: 'premium', name: 'Premium', icon: Zap },
    { id: 'modern', name: 'Modern', icon: Grid },
    { id: 'classic', name: 'Classic', icon: Grid },
  ];

  const filteredTemplates = BASEBALL_CARD_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'popular' && template.id !== 'no-frame') ||
                           (selectedCategory === 'premium' && template.name.includes('Premium')) ||
                           (selectedCategory === 'modern' && template.name.includes('Modern')) ||
                           (selectedCategory === 'classic' && !template.name.includes('Modern'));
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    // Store template selection in a way that matches CardData structure
    onFieldUpdate('rarity', template.name.includes('Premium') ? 'epic' : 'common');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-crd-white mb-2">Browse Templates</h2>
        <p className="text-crd-lightGray">
          Explore our template gallery and find the perfect design for your card
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card className="bg-crd-darker border-crd-mediumGray/20 sticky top-4">
            <CardHeader>
              <CardTitle className="text-crd-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-crd-white text-sm">Search Templates</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="pl-10 bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-crd-white text-sm">Categories</label>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                          selectedCategory === category.id
                            ? 'bg-crd-green text-black'
                            : 'text-crd-lightGray hover:bg-crd-mediumGray/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Selection */}
              {selectedTemplate && (
                <div className="border-t border-crd-mediumGray/20 pt-4">
                  <label className="text-crd-white text-sm mb-2 block">Selected Template</label>
                  <div className="bg-crd-darkest rounded-lg p-3">
                    <p className="text-crd-white font-medium">{selectedTemplate.name}</p>
                    <p className="text-crd-lightGray text-xs mt-1">
                      {selectedTemplate.description || 'No description available'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Area - Template Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-crd-green scale-105'
                    : 'hover:scale-102 hover:ring-1 hover:ring-crd-lightGray/50'
                }`}
              >
                <SVGTemplateRenderer
                  template={template}
                  playerName={cardData.title || 'PLAYER NAME'}
                  teamName="TEAM"
                  imageUrl={cardData.image_url}
                  className="w-full h-full"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Template Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-white text-sm font-medium mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray text-xs">
                      {template.name.includes('Premium') ? 'Premium' : 'Free'}
                    </span>
                    {selectedTemplate?.id === template.id && (
                      <div className="w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Premium Badge */}
                {template.name.includes('Premium') && (
                  <div className="absolute top-2 right-2 bg-crd-green text-black text-xs px-2 py-1 rounded-full font-semibold">
                    PRO
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Grid className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
              <h3 className="text-crd-white text-lg font-medium mb-2">No templates found</h3>
              <p className="text-crd-lightGray">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};