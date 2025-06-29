
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CRDMKRTemplate } from '@/types/crdmkr';

export const useCRDMKRTemplates = () => {
  const [templates, setTemplates] = useState<CRDMKRTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load templates from database
  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('card_templates')
        .select('*')
        .eq('source_type', 'crdmkr')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to load CRDMKR templates:', error);
        return;
      }

      // Transform database records to CRDMKRTemplate format
      const crdmkrTemplates: CRDMKRTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview_url: template.preview_url,
        description: template.description,
        template_data: template.template_data,
        is_premium: template.is_premium,
        usage_count: template.usage_count,
        tags: template.tags || [],
        sourceType: 'crdmkr',
        sourceFile: template.source_file_url,
        fabricData: template.fabric_data,
        layers: template.layers || [],
        parameters: template.parameters || [],
        aiAnalysis: template.ai_analysis
      }));

      setTemplates(crdmkrTemplates);

      // Extract unique categories
      const uniqueCategories = [...new Set(crdmkrTemplates.map(t => t.category).filter(Boolean))];
      setCategories(uniqueCategories);

    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  // Create a new template
  const createTemplate = useCallback(async (templateData: Partial<CRDMKRTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .insert([{
          name: templateData.name,
          category: templateData.category,
          description: templateData.description,
          template_data: templateData.template_data,
          preview_url: templateData.preview_url,
          source_type: 'crdmkr',
          source_file_url: templateData.sourceFile,
          fabric_data: templateData.fabricData,
          layers: templateData.layers,
          parameters: templateData.parameters,
          ai_analysis: templateData.aiAnalysis,
          is_premium: templateData.is_premium || false,
          is_public: true,
          tags: templateData.tags || []
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create template:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }, []);

  // Update template
  const updateTemplate = useCallback(async (templateId: string, updates: Partial<CRDMKRTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .update({
          name: updates.name,
          category: updates.category,
          description: updates.description,
          template_data: updates.template_data,
          preview_url: updates.preview_url,
          fabric_data: updates.fabricData,
          layers: updates.layers,
          parameters: updates.parameters,
          ai_analysis: updates.aiAnalysis,
          tags: updates.tags
        })
        .eq('id', templateId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update template:', error);
        return null;
      }

      // Refresh templates list
      loadTemplates();
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      return null;
    }
  }, [loadTemplates]);

  // Duplicate template
  const duplicateTemplate = useCallback(async (templateId: string) => {
    try {
      // Get original template
      const { data: original, error: fetchError } = await supabase
        .from('card_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (fetchError || !original) {
        console.error('Failed to fetch original template:', fetchError);
        return null;
      }

      // Create duplicate
      const { data, error } = await supabase
        .from('card_templates')
        .insert([{
          ...original,
          id: undefined, // Let database generate new ID
          name: `${original.name} (Copy)`,
          created_at: undefined,
          updated_at: undefined
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to duplicate template:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error duplicating template:', error);
      return null;
    }
  }, []);

  // Share template (generate shareable link)
  const shareTemplate = useCallback(async (templateId: string) => {
    try {
      // For now, return a simple share URL
      // In production, you might want to implement proper sharing with tokens
      const shareUrl = `${window.location.origin}/templates/${templateId}`;
      return shareUrl;
    } catch (error) {
      console.error('Error sharing template:', error);
      return null;
    }
  }, []);

  // Get template by ID
  const getTemplate = useCallback(async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('id', templateId)
        .eq('source_type', 'crdmkr')
        .single();

      if (error) {
        console.error('Failed to get template:', error);
        return null;
      }

      // Transform to CRDMKRTemplate format
      const crdmkrTemplate: CRDMKRTemplate = {
        id: data.id,
        name: data.name,
        category: data.category,
        preview_url: data.preview_url,
        description: data.description,
        template_data: data.template_data,
        is_premium: data.is_premium,
        usage_count: data.usage_count,
        tags: data.tags || [],
        sourceType: 'crdmkr',
        sourceFile: data.source_file_url,
        fabricData: data.fabric_data,
        layers: data.layers || [],
        parameters: data.parameters || [],
        aiAnalysis: data.ai_analysis
      };

      return crdmkrTemplate;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }, []);

  // Track template usage
  const trackUsage = useCallback(async (templateId: string) => {
    try {
      await supabase
        .from('card_templates')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('id', templateId);
    } catch (error) {
      console.error('Error tracking template usage:', error);
    }
  }, []);

  // Auto-load templates when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTemplates();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory]);

  return {
    templates,
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    loadTemplates,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    shareTemplate,
    getTemplate,
    trackUsage
  };
};
