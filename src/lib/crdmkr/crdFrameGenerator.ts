import type { DesignTemplate } from '@/types/card';

export interface CRDFrameData {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensions: {
    width: number;
    height: number;
  };
  layers: any[];
  photoReplacement?: {
    layerId: string;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  previewUrl: string;
  sourceFile: string;
  createdAt: string;
}

export class CRDFrameGenerator {
  static async generateTemplate(frameData: CRDFrameData): Promise<DesignTemplate> {
    console.log('🎯 Generating CRD template from frame data:', frameData.name);
    
    // Convert frame data to DesignTemplate format
    const template: DesignTemplate = {
      id: frameData.id,
      name: frameData.name,
      description: frameData.description,
      category: frameData.category,
      preview_url: frameData.previewUrl,
      template_data: {
        type: 'crd-frame',
        dimensions: frameData.dimensions,
        layers: frameData.layers,
        photoReplacement: frameData.photoReplacement,
        sourceFile: frameData.sourceFile
      },
      is_premium: false,
      tags: ['psd-generated', 'custom-frame']
    };
    
    console.log('✅ CRD template generated:', template);
    return template;
  }
  
  static async saveTemplate(template: DesignTemplate): Promise<boolean> {
    try {
      console.log('💾 Saving CRD template:', template.name);
      
      // For now, we'll store in localStorage as a mock implementation
      // In production, this would save to Supabase database
      const savedTemplates = this.getSavedTemplates();
      savedTemplates.push(template);
      
      localStorage.setItem('crd-custom-templates', JSON.stringify(savedTemplates));
      
      console.log('✅ CRD template saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving CRD template:', error);
      return false;
    }
  }
  
  static getSavedTemplates(): DesignTemplate[] {
    try {
      const saved = localStorage.getItem('crd-custom-templates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('❌ Error loading saved templates:', error);
      return [];
    }
  }
  
  static async loadTemplate(templateId: string): Promise<DesignTemplate | null> {
    try {
      const savedTemplates = this.getSavedTemplates();
      return savedTemplates.find(t => t.id === templateId) || null;
    } catch (error) {
      console.error('❌ Error loading template:', error);
      return null;
    }
  }
  
  static async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const savedTemplates = this.getSavedTemplates();
      const filtered = savedTemplates.filter(t => t.id !== templateId);
      
      localStorage.setItem('crd-custom-templates', JSON.stringify(filtered));
      
      console.log('✅ Template deleted:', templateId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      return false;
    }
  }
}
