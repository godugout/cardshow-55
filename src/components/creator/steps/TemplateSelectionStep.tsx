
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  premium?: boolean;
  tags: string[];
  description: string;
}

interface TemplateSelectionStepProps {
  onComplete: (data: any) => void;
  initialData: any;
}

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'sports', name: 'Sports' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'business', name: 'Business' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' }
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'sports-classic',
    name: 'Classic Sports Card',
    category: 'sports',
    thumbnail: '/api/placeholder/200/280',
    tags: ['athlete', 'professional', 'classic'],
    description: 'Traditional sports card layout with stats section'
  },
  {
    id: 'gaming-hero',
    name: 'Gaming Hero',
    category: 'gaming',
    thumbnail: '/api/placeholder/200/280',
    premium: true,
    tags: ['character', 'fantasy', 'action'],
    description: 'Epic gaming character card with special effects'
  },
  {
    id: 'minimal-portrait',
    name: 'Minimal Portrait',
    category: 'minimal',
    thumbnail: '/api/placeholder/200/280',
    tags: ['clean', 'simple', 'portrait'],
    description: 'Clean and simple portrait-focused design'
  },
  {
    id: 'business-profile',
    name: 'Business Profile',
    category: 'business',
    thumbnail: '/api/placeholder/200/280',
    tags: ['professional', 'corporate', 'linkedin'],
    description: 'Professional business card style layout'
  }
];

export const TemplateSelectionStep = ({ onComplete, initialData }: TemplateSelectionStepProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialData.selectedTemplate || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = MOCK_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    const template = MOCK_TEMPLATES.find(t => t.id === selectedTemplate);
    onComplete({
      selectedTemplate,
      templateData: template
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Template</h2>
        <p className="text-crd-lightGray">Select a template that matches your vision</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Search and View Mode */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-mediumGray w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-crd-darkGray border-crd-mediumGray/30 text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-crd-mediumGray/20 border-crd-mediumGray/30"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-crd-mediumGray/20 border-crd-mediumGray/30"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id
                  ? 'bg-crd-green text-black'
                  : 'bg-crd-mediumGray/20 border-crd-mediumGray/30 text-crd-lightGray hover:bg-crd-mediumGray/40'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Templates */}
        <div className="lg:col-span-3">
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-crd-green bg-crd-darker border-crd-green'
                    : 'bg-crd-darkGray border-crd-mediumGray/30 hover:border-crd-lightGray'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-3'}`}>
                  {/* Thumbnail */}
                  <div className={`relative ${viewMode === 'list' ? 'w-20 h-28 flex-shrink-0' : 'w-full h-48'}`}>
                    <div className="w-full h-full bg-crd-mediumGray/30 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-crd-mediumGray">
                        Template
                      </div>
                    </div>
                    
                    {template.premium && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
                        PRO
                      </Badge>
                    )}
                    
                    {selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-crd-green/20 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className={`${viewMode === 'list' ? 'flex-1' : 'space-y-2'}`}>
                    <h4 className="font-medium text-white">{template.name}</h4>
                    <p className="text-sm text-crd-lightGray">{template.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-crd-mediumGray/20 text-crd-lightGray rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-crd-lightGray">No templates found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="bg-crd-darkGray border-crd-mediumGray/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Template Preview</h3>
              
              {selectedTemplate ? (
                <div className="space-y-4">
                  {/* Large preview */}
                  <div className="w-full h-64 bg-crd-mediumGray/30 rounded-lg flex items-center justify-center">
                    <span className="text-crd-mediumGray">Template Preview</span>
                  </div>
                  
                  {/* Template info */}
                  {(() => {
                    const template = MOCK_TEMPLATES.find(t => t.id === selectedTemplate);
                    return template ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-white">{template.name}</h4>
                        <p className="text-sm text-crd-lightGray">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-crd-mediumGray/20 text-crd-lightGray rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                  
                  {/* Continue button */}
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                  >
                    Use This Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-crd-lightGray">Select a template to preview</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
