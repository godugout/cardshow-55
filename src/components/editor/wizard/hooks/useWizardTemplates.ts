
import { useState, useEffect } from 'react';
import type { DesignTemplate } from '@/types/card';

// Mock templates for now - in a real app these would come from your API
const mockTemplates: DesignTemplate[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'sports',
    preview_url: '/templates/classic-sports.jpg',
    is_premium: false,
    template_data: {},
    usage_count: 0,
    tags: ['sports', 'classic']
  },
  {
    id: 'modern-gaming',
    name: 'Modern Gaming',
    category: 'gaming', 
    preview_url: '/templates/modern-gaming.jpg',
    is_premium: true,
    template_data: {},
    usage_count: 0,
    tags: ['gaming', 'modern']
  },
  {
    id: 'vintage-card',
    name: 'Vintage Card',
    category: 'classic',
    preview_url: '/templates/vintage-card.jpg',
    is_premium: false,
    template_data: {},
    usage_count: 0,
    tags: ['vintage', 'classic']
  }
];

export const useWizardTemplates = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadTemplates = async () => {
      setIsLoading(true);
      // In a real app, you'd fetch from your API here
      await new Promise(resolve => setTimeout(resolve, 500));
      setTemplates(mockTemplates);
      setIsLoading(false);
    };

    loadTemplates();
  }, []);

  return {
    templates,
    isLoading
  };
};
