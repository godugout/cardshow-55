
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CRDMKRTemplate } from '@/types/crdmkr';
import { toast } from 'sonner';

export const useCRDMKRTemplates = () => {
  const [templates, setTemplates] = useState<CRDMKRTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories] = useState<string[]>(['Sports', 'Entertainment', 'Abstract', 'Vintage']);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      // Query from card_templates table with CRDMKR source type
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('source_type', 'crdmkr')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load CRDMKR templates:', error);
        setTemplates([]);
        return;
      }

      // Transform to CRDMKRTemplate format
      const crdmkrTemplates: CRDMKRTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview_url: template.preview_url,
        description: template.description,
        is_premium: template.is_premium || false,
        usage_count: template.usage_count || 0,
        tags: [], // Default to empty array
        template_data: template.template_data || {},
        sourceType: 'crdmkr',
        sourceFile: template.source_file_url,
        fabricData: template.fabric_data,
        layers: template.layers || [],
        parameters: template.parameters || [],
        aiAnalysis: template.ai_analysis
      }));

      setTemplates(crdmkrTemplates);
    } catch (error) {
      console.error('Error loading CRDMKR templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const duplicateTemplate = async (templateId: string): Promise<CRDMKRTemplate | null> => {
    try {
      const originalTemplate = templates.find(t => t.id === templateId);
      if (!originalTemplate) return null;

      const { data, error } = await supabase
        .from('card_templates')
        .insert([{
          name: `${originalTemplate.name} (Copy)`,
          category: originalTemplate.category,
          description: originalTemplate.description,
          template_data: originalTemplate.template_data,
          source_type: 'crdmkr',
          fabric_data: originalTemplate.fabricData,
          layers: originalTemplate.layers,
          parameters: originalTemplate.parameters,
          ai_analysis: originalTemplate.aiAnalysis,
          is_public: false
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        ...originalTemplate,
        id: data.id,
        name: data.name,
        is_premium: false
      };
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      return null;
    }
  };

  const shareTemplate = async (templateId: string): Promise<string | null> => {
    try {
      // Generate a shareable URL - for now just return a placeholder
      const shareUrl = `${window.location.origin}/templates/${templateId}`;
      return shareUrl;
    } catch (error) {
      console.error('Failed to generate share URL:', error);
      return null;
    }
  };

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
    templates: filteredTemplates,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    loadTemplates,
    duplicateTemplate,
    shareTemplate
  };
};
