
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Share, 
  Copy, 
  Trash2, 
  Download,
  Star,
  TrendingUp,
  Users,
  Palette,
  BarChart3
} from 'lucide-react';
import { useCRDMKRTemplates } from '@/hooks/useCRDMKRTemplates';
import { CRDMKRAdapter } from '@/lib/templates/crdmkrAdapter';
import type { CRDMKRTemplate } from '@/types/crdmkr';
import { toast } from 'sonner';

interface TemplateManagerProps {
  onCreateNew?: () => void;
  onEditTemplate?: (template: CRDMKRTemplate) => void;
}

export const TemplateManager = ({ onCreateNew, onEditTemplate }: TemplateManagerProps) => {
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
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'created'>('created');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTemplates.length === templates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map(t => t.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTemplates.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTemplates.length} template(s)? This action cannot be undone.`
    );
    
    if (confirmed) {
      // Implement bulk delete logic here
      toast.success(`${selectedTemplates.length} template(s) deleted`);
      setSelectedTemplates([]);
      loadTemplates();
    }
  };

  const handleDuplicate = async (templateId: string) => {
    try {
      await duplicateTemplate(templateId);
      toast.success('Template duplicated successfully!');
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

  const sortedTemplates = [...templates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'usage':
        return (b.usage_count || 0) - (a.usage_count || 0);
      case 'created':
      default:
        return new Date(b.template_data?.created_at || '').getTime() - 
               new Date(a.template_data?.created_at || '').getTime();
    }
  });

  const renderTemplateCard = (template: CRDMKRTemplate) => {
    const stats = CRDMKRAdapter.getTemplateStats(template);
    const isSelected = selectedTemplates.includes(template.id);

    return (
      <Card
        key={template.id}
        className={`transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-crd-green border-crd-green' : 'border-crd-mediumGray/20'
        }`}
      >
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectTemplate(template.id)}
                className="rounded border-crd-mediumGray/30"
              />
              <div className="aspect-[3/4] w-16 bg-crd-darkest rounded-lg overflow-hidden">
                {template.preview_url ? (
                  <img
                    src={template.preview_url}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="w-6 h-6 text-crd-mediumGray" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-crd-white truncate">
                  {template.name}
                </h3>
                <p className="text-sm text-crd-lightGray truncate">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.is_premium && (
                    <Badge className="bg-crd-gold text-black text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="text-crd-white font-semibold">
                {template.usage_count || 0}
              </div>
              <div className="text-crd-mediumGray">Uses</div>
            </div>
            <div className="text-center">
              <div className="text-crd-white font-semibold">
                {stats.layerCount}
              </div>
              <div className="text-crd-mediumGray">Layers</div>
            </div>
            <div className="text-center">
              <div className="text-crd-white font-semibold">
                {stats.parameterCount}
              </div>
              <div className="text-crd-mediumGray">Params</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <CRDButton
              size="sm"
              variant="outline"
              onClick={() => onEditTemplate?.(template)}
              className="flex-1"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              onClick={() => handleDuplicate(template.id)}
            >
              <Copy className="w-3 h-3" />
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              onClick={() => handleShare(template.id)}
            >
              <Share className="w-3 h-3" />
            </CRDButton>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStats = () => {
    const totalUsage = templates.reduce((sum, t) => sum + (t.usage_count || 0), 0);
    const avgUsage = templates.length > 0 ? Math.round(totalUsage / templates.length) : 0;
    const premiumCount = templates.filter(t => t.is_premium).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crd-blue/20 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-crd-blue" />
              </div>
              <div>
                <div className="text-xl font-bold text-crd-white">
                  {templates.length}
                </div>
                <div className="text-sm text-crd-lightGray">
                  Total Templates
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crd-green/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-crd-green" />
              </div>
              <div>
                <div className="text-xl font-bold text-crd-white">
                  {totalUsage}
                </div>
                <div className="text-sm text-crd-lightGray">
                  Total Usage
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crd-gold/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-crd-gold" />
              </div>
              <div>
                <div className="text-xl font-bold text-crd-white">
                  {premiumCount}
                </div>
                <div className="text-sm text-crd-lightGray">
                  Premium
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-crd-purple/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-crd-purple" />
              </div>
              <div>
                <div className="text-xl font-bold text-crd-white">
                  {avgUsage}
                </div>
                <div className="text-sm text-crd-lightGray">
                  Avg Usage
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-crd-white">Template Manager</h1>
          <p className="text-crd-lightGray">
            Manage your AI-generated card templates
          </p>
        </div>
        <CRDButton onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </CRDButton>
      </div>

      {/* Statistics */}
      {renderStats()}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-mediumGray" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-crd-darker border-crd-mediumGray/30 text-crd-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-crd-darker border border-crd-mediumGray/30 text-crd-white rounded-md px-3 py-2"
          >
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
            <option value="usage">Sort by Usage</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedTemplates.length > 0 && (
            <>
              <span className="text-sm text-crd-lightGray">
                {selectedTemplates.length} selected
              </span>
              <CRDButton
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </CRDButton>
            </>
          )}
          <CRDButton
            size="sm"
            variant="outline"
            onClick={handleSelectAll}
          >
            {selectedTemplates.length === templates.length ? 'Deselect All' : 'Select All'}
          </CRDButton>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-crd-mediumGray/20 rounded-lg mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-crd-mediumGray/20 rounded" />
                  <div className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTemplates.map(renderTemplateCard)}
        </div>
      )}

      {templates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Palette className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-crd-white mb-2">
            No templates found
          </h3>
          <p className="text-crd-lightGray mb-4">
            Create your first AI-generated template to get started
          </p>
          <CRDButton onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </CRDButton>
        </div>
      )}
    </div>
  );
};
