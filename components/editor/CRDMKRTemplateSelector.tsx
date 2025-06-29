
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Upload, 
  Search, 
  Filter,
  Star,
  Eye,
  Download,
  Share,
  Copy,
  Palette,
  Layout
} from 'lucide-react';
import { useCRDMKRTemplates } from '../hooks/useCRDMKRTemplates';
import type { DesignTemplate } from '@/types/card';
import type { CRDMKRTemplate } from '@/types/crdmkr';
import { toast } from 'sonner';

interface CRDMKRTemplateSelectorProps {
  onTemplateSelect: (template: DesignTemplate) => void;
  onCreateFromPSD: () => void;
  selectedTemplate?: DesignTemplate | null;
  showCreateFromPSD?: boolean;
}

export const CRDMKRTemplateSelector = ({
  onTemplateSelect,
  onCreateFromPSD,
  selectedTemplate,
  showCreateFromPSD = true
}: CRDMKRTemplateSelectorProps) => {
  const {
    templates,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    loadTemplates,
    duplicateTemplate,
    shareTemplate
  } = useCRDMKRTemplates();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleTemplateSelect = (template: CRDMKRTemplate) => {
    // Convert CRDMKR template to standard DesignTemplate format
    const designTemplate: DesignTemplate = {
      id: template.id,
      name: template.name,
      category: template.category,
      preview_url: template.preview_url,
      description: template.description,
      is_premium: template.is_premium,
      usage_count: template.usage_count,
      tags: template.tags,
      template_data: {
        ...template.template_data,
        sourceType: 'crdmkr',
        fabricData: template.fabricData,
        layers: template.layers,
        parameters: template.parameters,
        aiAnalysis: template.aiAnalysis
      }
    };
    
    onTemplateSelect(designTemplate);
  };

  const handleDuplicate = async (templateId: string) => {
    try {
      const duplicatedTemplate = await duplicateTemplate(templateId);
      if (duplicatedTemplate) {
        toast.success('Template duplicated successfully!');
        loadTemplates();
      }
    } catch (error) {
      toast.error('Failed to duplicate template');
    }
  };

  const handleShare = async (templateId: string) => {
    try {
      const shareUrl = await shareTemplate(templateId);
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share template');
    }
  };

  const renderTemplateCard = (template: CRDMKRTemplate) => {
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <Card
        key={template.id}
        className={`cursor-pointer transition-all hover:scale-105 ${
          isSelected 
            ? 'ring-2 ring-crd-green border-crd-green' 
            : 'border-crd-mediumGray/20 hover:border-crd-green/50'
        }`}
        onClick={() => handleTemplateSelect(template)}
      >
        <CardHeader className="p-3">
          <div className="aspect-[5/7] bg-crd-darkest rounded-lg overflow-hidden mb-3">
            {template.preview_url ? (
              <img
                src={template.preview_url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Palette className="w-8 h-8 text-crd-mediumGray" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-crd-white truncate">
                {template.name}
              </h3>
              {template.is_premium && (
                <Badge className="bg-crd-gold text-black text-xs">
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-xs text-crd-lightGray line-clamp-2">
              {template.description}
            </p>
            <div className="flex items-center justify-between text-xs text-crd-mediumGray">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {template.usage_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex gap-2">
            <CRDButton
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleTemplateSelect(template);
              }}
            >
              Select
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(template.id);
              }}
            >
              <Copy className="w-3 h-3" />
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleShare(template.id);
              }}
            >
              <Share className="w-3 h-3" />
            </CRDButton>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCreateFromPSD = () => (
    <Card
      className="cursor-pointer transition-all hover:scale-105 border-2 border-dashed border-crd-green/50 hover:border-crd-green bg-crd-green/5"
      onClick={onCreateFromPSD}
    >
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-crd-green/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-crd-green" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-crd-white mb-2">
              Create from PSD
            </h3>
            <p className="text-sm text-crd-lightGray">
              Upload a PSD file to automatically generate a customizable template
            </p>
          </div>
          <CRDButton variant="primary" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Start Creating
          </CRDButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-crd-white">AI-Generated Templates</h2>
          <p className="text-crd-lightGray">
            Choose from professionally designed templates or create your own
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CRDButton
            size="sm"
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Layout className="w-4 h-4" />
          </CRDButton>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-mediumGray" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white"
            />
          </div>
        </div>
        <div className="w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-[5/7] bg-crd-mediumGray/20 rounded-lg mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-crd-mediumGray/20 rounded" />
                  <div className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {showCreateFromPSD && renderCreateFromPSD()}
          {templates.map(renderTemplateCard)}
        </div>
      )}

      {templates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-crd-white mb-2">
            No templates found
          </h3>
          <p className="text-crd-lightGray mb-4">
            Try adjusting your search or create a new template from PSD
          </p>
          {showCreateFromPSD && (
            <CRDButton onClick={onCreateFromPSD}>
              <Upload className="w-4 h-4 mr-2" />
              Create from PSD
            </CRDButton>
          )}
        </div>
      )}
    </div>
  );
};
