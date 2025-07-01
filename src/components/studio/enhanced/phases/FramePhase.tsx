
import React, { useState, useEffect } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Palette, Star, Crown, Zap, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { CardData } from '@/hooks/useCardEditor';

interface FramePhaseProps {
  cardEditor: {
    cardData: CardData;
    updateCardField: (field: keyof CardData, value: any) => void;
    updateDesignMetadata: (key: string, value: any) => void;
  };
  onComplete: () => void;
}

interface FrameTemplate {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  category: string;
  is_premium: boolean;
  template_data: any;
  usage_count: number;
}

export const FramePhase = ({ cardEditor, onComplete }: FramePhaseProps) => {
  const [templates, setTemplates] = useState<FrameTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Frames', icon: Palette },
    { id: 'sports', label: 'Sports', icon: Star },
    { id: 'fantasy', label: 'Fantasy', icon: Crown },
    { id: 'modern', label: 'Modern', icon: Zap },
    { id: 'vintage', label: 'Vintage', icon: Filter }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load frame templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: FrameTemplate) => {
    setSelectedTemplate(template);
    cardEditor.updateCardField('template_id', template.id);
    cardEditor.updateDesignMetadata('frame', template.template_data);
    toast.success(`Selected ${template.name} frame!`);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onComplete();
    } else {
      toast.error('Please select a frame template first');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-crd-white mb-4">Choose Your Frame</h2>
        <p className="text-crd-lightGray text-lg max-w-2xl mx-auto">
          Select the perfect frame template that matches your vision and style
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-mediumGray w-4 h-4" />
          <Input
            placeholder="Search frames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-crd-green text-black'
                    : 'bg-crd-darker text-crd-lightGray hover:bg-crd-mediumGray/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-crd-darker rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedTemplate?.id === template.id
                  ? 'bg-crd-green/20 border-crd-green ring-2 ring-crd-green/50'
                  : 'bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardContent className="p-0">
                <div className="aspect-[5/7] relative overflow-hidden rounded-t-lg">
                  {template.preview_url ? (
                    <img
                      src={template.preview_url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-crd-mediumGray/20 flex items-center justify-center">
                      <Palette className="w-8 h-8 text-crd-mediumGray" />
                    </div>
                  )}
                  
                  {template.is_premium && (
                    <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute inset-0 bg-crd-green/20 flex items-center justify-center">
                      <div className="bg-crd-green text-black p-2 rounded-full">
                        <Star className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-crd-white truncate">{template.name}</h3>
                  <p className="text-crd-lightGray text-sm mt-1 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    <span className="text-crd-mediumGray text-xs">
                      {template.usage_count} uses
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-crd-white mb-2">No frames found</h3>
          <p className="text-crd-lightGray">
            Try adjusting your search or category filters
          </p>
        </div>
      )}

      {/* Selected Template Preview */}
      {selectedTemplate && (
        <div className="bg-crd-darker rounded-xl p-6">
          <h3 className="text-lg font-semibold text-crd-white mb-4">Selected Frame</h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-32 rounded-lg overflow-hidden border border-crd-green">
              {selectedTemplate.preview_url ? (
                <img
                  src={selectedTemplate.preview_url}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-crd-mediumGray/20 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-crd-mediumGray" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-crd-white">{selectedTemplate.name}</h4>
              <p className="text-crd-lightGray text-sm mt-1">{selectedTemplate.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline">{selectedTemplate.category}</Badge>
                {selectedTemplate.is_premium && (
                  <Badge className="bg-purple-500/20 text-purple-400">Premium</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedTemplate && (
        <div className="flex justify-center">
          <CRDButton
            onClick={handleContinue}
            className="bg-crd-green text-black hover:bg-crd-green/90 px-8 py-3"
          >
            Continue to Effects
            <Zap className="w-4 h-4 ml-2" />
          </CRDButton>
        </div>
      )}
    </div>
  );
};
