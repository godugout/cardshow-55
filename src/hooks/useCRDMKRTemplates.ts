
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

      // Transform database records to CRDMKRTemplate format with all required properties
      const crdmkrTemplates: CRDMKRTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview_url: template.preview_url,
        description: template.description,
        template_data: typeof template.template_data === 'object' && template.template_data !== null 
          ? template.template_data as Record<string, any>
          : {},
        is_premium: template.is_premium,
        usage_count: template.usage_count,
        tags: [], // Default to empty array since tags doesn't exist in schema
        sourceType: 'crdmkr' as const,
        sourceFile: template.source_file_url || '',
        fabricData: template.fabric_data,
        dimensions: {
          width: 400,
          height: 600,
          orientation: 'portrait' as const
        },
        layers: Array.isArray(template.layers) ? template.layers as any[] : [],
        parameters: Array.isArray(template.parameters) ? template.parameters as any[] : [],
        colorPalette: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#ff0000',
          background: '#f0f0f0'
        },
        typography: [], // Default to empty array since typography doesn't exist in schema
        metadata: {
          createdAt: new Date(template.created_at),
          processedBy: 'manual' as const,
          accuracy: 0
        },
        aiAnalysis: template.ai_analysis ? {
          confidence: typeof template.ai_analysis === 'object' && template.ai_analysis !== null && 'confidence' in template.ai_analysis 
            ? (template.ai_analysis as any).confidence || 0 
            : 0,
          detectedRegions: typeof template.ai_analysis === 'object' && template.ai_analysis !== null && 'detectedRegions' in template.ai_analysis 
            ? (template.ai_analysis as any).detectedRegions || [] 
            : [],
          dominantColors: typeof template.ai_analysis === 'object' && template.ai_analysis !== null && 'dominantColors' in template.ai_analysis 
            ? (template.ai_analysis as any).dominantColors || [] 
            : [],
          suggestedRarity: typeof template.ai_analysis === 'object' && template.ai_analysis !== null && 'suggestedRarity' in template.ai_analysis 
            ? (template.ai_analysis as any).suggestedRarity || 'Common' 
            : 'Common',
          contentType: typeof template.ai_analysis === 'object' && template.ai_analysis !== null && 'contentType' in template.ai_analysis 
            ? (template.ai_analysis as any).contentType || 'Trading Card' 
            : 'Trading Card'
        } : undefined
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
        .insert({
          name: templateData.name,
          category: templateData.category,
          description: templateData.description,
          template_data: templateData.template_data as any,
          preview_url: templateData.preview_url,
          source_type: 'crdmkr',
          source_file_url: templateData.sourceFile,
          fabric_data: templateData.fabricData as any,
          layers: templateData.layers as any,
          parameters: templateData.parameters as any,
          ai_analysis: templateData.aiAnalysis as any,
          is_premium: templateData.is_premium || false,
          is_public: true
        })
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
          template_data: updates.template_data as any,
          preview_url: updates.preview_url,
          fabric_data: updates.fabricData as any,
          layers: updates.layers as any,
          parameters: updates.parameters as any,
          ai_analysis: updates.aiAnalysis as any
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
        .insert({
          name: `${original.name} (Copy)`,
          category: original.category,
          description: original.description,
          template_data: original.template_data,
          preview_url: original.preview_url,
          source_type: original.source_type,
          source_file_url: original.source_file_url,
          fabric_data: original.fabric_data,
          layers: original.layers,
          parameters: original.parameters,
          ai_analysis: original.ai_analysis,
          is_premium: original.is_premium,
          is_public: original.is_public,
          creator_id: original.creator_id,
          usage_count: 0
        })
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
        template_data: typeof data.template_data === 'object' && data.template_data !== null 
          ? data.template_data as Record<string, any>
          : {},
        is_premium: data.is_premium,
        usage_count: data.usage_count,
        tags: [], // Default to empty array since tags doesn't exist in schema
        sourceType: 'crdmkr' as const,
        sourceFile: data.source_file_url,
        fabricData: data.fabric_data,
        dimensions: {
          width: 400,
          height: 600,
          orientation: 'portrait' as const
        },
        layers: Array.isArray(data.layers) ? data.layers as any[] : [],
        parameters: Array.isArray(data.parameters) ? data.parameters as any[] : [],
        colorPalette: {
          primary: '#000000',
          secondary: '#ffffff',
          accent: '#ff0000',
          background: '#f0f0f0'
        },
        typography: [],
        metadata: {
          createdAt: new Date(data.created_at),
          processedBy: 'manual' as const,
          accuracy: 0
        },
        aiAnalysis: data.ai_analysis ? {
          confidence: typeof data.ai_analysis === 'object' && data.ai_analysis !== null && 'confidence' in data.ai_analysis 
            ? (data.ai_analysis as any).confidence || 0 
            : 0,
          detectedRegions: typeof data.ai_analysis === 'object' && data.ai_analysis !== null && 'detectedRegions' in data.ai_analysis 
            ? (data.ai_analysis as any).detectedRegions || [] 
            : [],
          dominantColors: typeof data.ai_analysis === 'object' && data.ai_analysis !== null && 'dominantColors' in data.ai_analysis 
            ? (data.ai_analysis as any).dominantColors || [] 
            : [],
          suggestedRarity: typeof data.ai_analysis === 'object' && data.ai_analysis !== null && 'suggestedRarity' in data.ai_analysis 
            ? (data.ai_analysis as any).suggestedRarity || 'Common' 
            : 'Common',
          contentType: typeof data.ai_analysis === 'object' && data.ai_analysis !== null && 'contentType' in data.ai_analysis 
            ? (data.ai_analysis as any).contentType || 'Trading Card' 
            : 'Trading Card'
        } : undefined
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
      // Get current usage count first
      const { data: currentData } = await supabase
        .from('card_templates')
        .select('usage_count')
        .eq('id', templateId)
        .single();

      if (currentData) {
        await supabase
          .from('card_templates')
          .update({ usage_count: (currentData.usage_count || 0) + 1 })
          .eq('id', templateId);
      }
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
