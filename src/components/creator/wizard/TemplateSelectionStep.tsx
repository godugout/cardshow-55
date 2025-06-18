
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, Palette, Trophy, Music, Sparkles } from 'lucide-react';
import type { DesignTemplate } from '@/hooks/useCardEditor';
import { SPORTS_TEMPLATES, ENTERTAINMENT_TEMPLATES } from '@/data/cardTemplates';

interface TemplateSelectionStepProps {
  templates: DesignTemplate[];
  selectedTemplate: DesignTemplate | null;
  onTemplateSelect: (template: DesignTemplate) => void;
}

export const TemplateSelectionStep = ({ selectedTemplate, onTemplateSelect }: TemplateSelectionStepProps) => {
  const [activeCategory, setActiveCategory] = useState('sports');

  const renderTemplatePreview = (template: DesignTemplate) => {
    const colors = template.template_data.colors;
    const isSelected = selectedTemplate?.id === template.id;
    
    return (
      <div
        key={template.id}
        onClick={() => onTemplateSelect(template)}
        className={`relative p-4 rounded-xl cursor-pointer transition-all border group ${
          isSelected
            ? 'ring-2 ring-crd-green bg-crd-mediumGray/50 border-crd-green'
            : 'bg-crd-mediumGray/30 hover:bg-crd-mediumGray/50 border-crd-mediumGray/50 hover:border-crd-green/50'
        }`}
      >
        {/* Template Preview */}
        <div 
          className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden mb-3"
          style={{ backgroundColor: colors.background }}
        >
          {/* Template-specific preview based on ID */}
          {template.id === 'baseball-classic' && (
            <>
              <div 
                className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.secondary }}
              >
                PLAYER NAME
              </div>
              <div className="absolute top-10 left-2 right-2 bottom-20 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Player Photo</span>
              </div>
              <div className="absolute bottom-12 left-2 right-10 h-4 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.accent, color: 'white' }}>
                TEAM
              </div>
              <div className="absolute bottom-12 right-2 w-8 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
                POS
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-8 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.secondary, color: colors.text }}>
                Stats & Achievements
              </div>
            </>
          )}
          
          {template.id === 'basketball-modern' && (
            <>
              <div 
                className="absolute top-2 left-2 right-2 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.text }}
              >
                PLAYER NAME
              </div>
              <div className="absolute top-11 left-2 right-2 bottom-16 border-2 border-dashed border-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-xs text-orange-400">Action Shot</span>
              </div>
              <div className="absolute bottom-8 left-2 w-16 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: 'black' }}>
                TEAM
              </div>
              <div className="absolute bottom-8 right-2 w-16 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                POSITION
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-4 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.primary, color: colors.text }}>
                Season Stats
              </div>
            </>
          )}
          
          {template.id === 'football-pro' && (
            <>
              <div 
                className="absolute top-3 left-3 right-3 h-6 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.accent, color: 'black' }}
              >
                PLAYER NAME
              </div>
              <div className="absolute top-12 left-3 right-3 bottom-20 border-2 border-dashed border-green-400 rounded-lg flex items-center justify-center">
                <span className="text-xs text-green-400">Game Photo</span>
              </div>
              <div className="absolute bottom-12 left-3 w-20 h-5 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.primary, color: colors.text }}>
                TEAM
              </div>
              <div className="absolute bottom-12 right-3 w-16 h-5 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: 'black' }}>
                POS
              </div>
              <div className="absolute bottom-2 left-3 right-3 h-8 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.secondary, color: colors.text === '#ffffff' ? '#000000' : colors.text }}>
                Career Highlights
              </div>
            </>
          )}
          
          {template.id === 'soccer-international' && (
            <>
              <div 
                className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.text }}
              >
                PLAYER NAME
              </div>
              <div className="absolute top-10 left-2 right-2 bottom-18 border-2 border-dashed border-purple-400 rounded flex items-center justify-center">
                <span className="text-xs text-purple-400">Action Photo</span>
              </div>
              <div className="absolute bottom-10 left-2 w-12 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: 'black' }}>
                CLUB
              </div>
              <div className="absolute bottom-10 left-16 w-12 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                POS
              </div>
              <div className="absolute bottom-10 right-2 w-12 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.primary, color: colors.text }}>
                NAT
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-6 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                International Stats
              </div>
            </>
          )}
          
          {template.id === 'musician-spotlight' && (
            <>
              <div 
                className="absolute top-2 left-2 right-2 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.text }}
              >
                ARTIST NAME
              </div>
              <div className="absolute top-11 left-2 right-2 bottom-16 border-2 border-dashed border-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-xs text-pink-400">Performance Photo</span>
              </div>
              <div className="absolute bottom-8 left-2 w-16 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: 'black' }}>
                GENRE
              </div>
              <div className="absolute bottom-8 right-2 w-16 h-4 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                LABEL
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-4 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.primary, color: colors.text }}>
                Top Albums & Awards
              </div>
            </>
          )}
          
          {template.id === 'actor-premiere' && (
            <>
              <div 
                className="absolute top-3 left-3 right-3 h-6 rounded-xl flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.text }}
              >
                ACTOR NAME
              </div>
              <div className="absolute top-12 left-3 right-3 bottom-20 border-2 border-dashed border-red-400 rounded-lg flex items-center justify-center">
                <span className="text-xs text-red-400">Portrait Photo</span>
              </div>
              <div className="absolute bottom-12 left-3 w-18 h-5 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.accent, color: 'black' }}>
                GENRE
              </div>
              <div className="absolute bottom-12 right-3 w-20 h-5 rounded text-xs flex items-center justify-center" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                STUDIO
              </div>
              <div className="absolute bottom-2 left-3 right-3 h-8 rounded text-xs flex items-center px-2" style={{ backgroundColor: colors.secondary, color: 'black' }}>
                Notable Films & Awards
              </div>
            </>
          )}
          
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Template Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium text-sm">{template.name}</h3>
            {template.is_premium && (
              <Badge className="bg-yellow-500 text-black text-xs">
                <Star className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-crd-lightGray text-xs leading-relaxed">{template.description}</p>
          <div className="flex items-center justify-between text-xs text-crd-lightGray">
            <span>{template.usage_count} uses</span>
            <div className="flex items-center space-x-1">
              {template.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 bg-crd-mediumGray rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
        <p className="text-crd-lightGray">
          Select a professional template designed for your card type
        </p>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-crd-mediumGray w-full">
          <TabsTrigger 
            value="sports" 
            className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Sports ({SPORTS_TEMPLATES.length})
          </TabsTrigger>
          <TabsTrigger 
            value="entertainment" 
            className="flex-1 data-[state=active]:bg-crd-green data-[state=active]:text-black"
          >
            <Music className="w-4 h-4 mr-2" />
            Entertainment ({ENTERTAINMENT_TEMPLATES.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sports" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPORTS_TEMPLATES.map(renderTemplatePreview)}
          </div>
        </TabsContent>
        
        <TabsContent value="entertainment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENTERTAINMENT_TEMPLATES.map(renderTemplatePreview)}
          </div>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-crd-green/10 rounded-lg border border-crd-green/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-crd-green" />
            <div>
              <p className="text-white font-medium">Template Selected</p>
              <p className="text-crd-lightGray text-sm">
                You've chosen "{selectedTemplate.name}" - perfect choice for a professional {selectedTemplate.category} card!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
