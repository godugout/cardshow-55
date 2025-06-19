
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Palette, Sparkles, Filter } from 'lucide-react';
import { ModularTemplatePreview } from '../components/ModularTemplatePreview';
import { MODULAR_TEMPLATES, convertToDesignTemplate } from '@/data/modularTemplates';
import type { ModularTemplate } from '@/types/modularTemplate';
import type { DesignTemplate } from '@/hooks/useCardEditor';

interface ModularTemplateSelectionStepProps {
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
  selectedPhoto?: string;
}

export const ModularTemplateSelectionStep = ({ 
  selectedTemplate, 
  onTemplateSelect,
  selectedPhoto 
}: ModularTemplateSelectionStepProps) => {
  const [aestheticFilter, setAestheticFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const aesthetics = [...new Set(MODULAR_TEMPLATES.map(t => t.aesthetic))];
  const categories = [...new Set(MODULAR_TEMPLATES.map(t => t.category))];

  const filteredTemplates = MODULAR_TEMPLATES.filter(template => {
    const matchesAesthetic = aestheticFilter === 'all' || template.aesthetic === aestheticFilter;
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesAesthetic && matchesCategory;
  });

  const handleTemplateSelect = (modularTemplate: ModularTemplate) => {
    const convertedTemplate = convertToDesignTemplate(modularTemplate);
    onTemplateSelect(convertedTemplate);
  };

  const getAestheticDisplayName = (aesthetic: string) => {
    return aesthetic.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Frame Style</h2>
        <p className="text-crd-lightGray">
          Select from our collection of unique, customizable templates with modular elements
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-crd-mediumGray/30 border-crd-mediumGray/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-crd-lightGray" />
              <span className="text-white font-medium">Aesthetic Style</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={aestheticFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAestheticFilter('all')}
                  className={aestheticFilter === 'all' 
                    ? 'bg-crd-green text-black' 
                    : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                  }
                >
                  All Styles
                </Button>
                {aesthetics.map((aesthetic) => (
                  <Button
                    key={aesthetic}
                    variant={aestheticFilter === aesthetic ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAestheticFilter(aesthetic)}
                    className={aestheticFilter === aesthetic 
                      ? 'bg-crd-green text-black' 
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                    }
                  >
                    {getAestheticDisplayName(aesthetic)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-crd-lightGray" />
              <span className="text-white font-medium">Category</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                  className={categoryFilter === 'all' 
                    ? 'bg-crd-blue text-white' 
                    : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                  }
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                    className={categoryFilter === category 
                      ? 'bg-crd-blue text-white' 
                      : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray'
                    }
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`cursor-pointer transition-all border group ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-crd-green bg-crd-green/10 border-crd-green'
                : 'bg-crd-mediumGray/30 hover:bg-crd-mediumGray/50 border-crd-mediumGray/50 hover:border-crd-green/50'
            }`}
          >
            <CardContent className="p-4">
              <ModularTemplatePreview 
                template={template} 
                selectedPhoto={selectedPhoto}
                className="mb-4"
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">{template.name}</h3>
                  <div className="flex items-center gap-2">
                    {template.is_premium && (
                      <Badge className="bg-yellow-500 text-black text-xs px-1 py-0">
                        <Star className="w-2 h-2 mr-1" />
                        Pro
                      </Badge>
                    )}
                    {selectedTemplate?.id === template.id && (
                      <div className="w-4 h-4 bg-crd-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-crd-lightGray text-xs leading-relaxed">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-crd-lightGray">{template.usage_count} uses</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-crd-green" />
                    <span className="text-crd-green">
                      {template.elements.filter(e => e.isCustomizable).length} customizable elements
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-crd-mediumGray/50 text-crd-lightGray rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-crd-green" />
              <div>
                <p className="text-white font-medium">Perfect Choice!</p>
                <p className="text-crd-lightGray text-sm">
                  You've selected the "{selectedTemplate.name}" template with modular, customizable elements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-crd-lightGray">No templates match your current filters</p>
          <Button
            onClick={() => {
              setAestheticFilter('all');
              setCategoryFilter('all');
            }}
            className="mt-4 bg-crd-green hover:bg-crd-green/90 text-black"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
