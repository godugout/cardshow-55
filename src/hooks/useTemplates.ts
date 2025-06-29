
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DesignTemplate } from '@/types/card';

export const useTemplates = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load templates:', error);
        setError(error.message);
        return;
      }

      // Transform to DesignTemplate format
      const designTemplates: DesignTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview_url: template.preview_url,
        description: template.description,
        is_premium: template.is_premium,
        usage_count: template.usage_count || 0,
        tags: template.tags || [],
        template_data: typeof template.template_data === 'object' && template.template_data !== null 
          ? template.template_data as Record<string, any>
          : {}
      }));

      setTemplates(designTemplates);
      setError(null);
    } catch (err: any) {
      console.error('Error loading templates:', err);
      setError(err.message || 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: loadTemplates
  };
};
