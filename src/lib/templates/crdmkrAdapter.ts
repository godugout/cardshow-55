
import type { DesignTemplate } from '@/types/card';
import type { CRDMKRTemplate, CRDLayer, TemplateParameter } from '@/types/crdmkr';

export class CRDMKRAdapter {
  // Convert CRDMKR template to standard DesignTemplate
  static toDesignTemplate(crdmkrTemplate: CRDMKRTemplate): DesignTemplate {
    return {
      id: crdmkrTemplate.id,
      name: crdmkrTemplate.name,
      category: crdmkrTemplate.category,
      preview_url: crdmkrTemplate.preview_url,
      description: crdmkrTemplate.description,
      is_premium: crdmkrTemplate.is_premium,
      usage_count: crdmkrTemplate.usage_count,
      tags: crdmkrTemplate.tags || [],
      template_data: {
        ...crdmkrTemplate.template_data,
        sourceType: 'crdmkr-generated',
        fabricData: crdmkrTemplate.fabricData,
        layers: crdmkrTemplate.layers,
        parameters: crdmkrTemplate.parameters,
        aiAnalysis: crdmkrTemplate.aiAnalysis,
        sourceFile: crdmkrTemplate.sourceFile
      }
    };
  }

  // Convert standard DesignTemplate to CRDMKR template
  static fromDesignTemplate(designTemplate: DesignTemplate): CRDMKRTemplate | null {
    if (!designTemplate.template_data?.sourceType?.includes('crdmkr')) {
      return null;
    }

    return {
      id: designTemplate.id,
      name: designTemplate.name,
      category: designTemplate.category,
      preview_url: designTemplate.preview_url,
      description: designTemplate.description,
      template_data: designTemplate.template_data,
      is_premium: designTemplate.is_premium,
      usage_count: designTemplate.usage_count,
      tags: designTemplate.tags || [],
      sourceType: 'crdmkr',
      sourceFile: designTemplate.template_data.sourceFile || '',
      fabricData: designTemplate.template_data.fabricData,
      dimensions: {
        width: 400,
        height: 600,
        orientation: 'portrait'
      },
      layers: designTemplate.template_data.layers || [],
      parameters: designTemplate.template_data.parameters || [],
      colorPalette: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ff0000',
        background: '#f0f0f0'
      },
      typography: [],
      metadata: {
        createdAt: new Date(),
        processedBy: 'manual',
        accuracy: 0
      },
      aiAnalysis: designTemplate.template_data.aiAnalysis
    };
  }

  // Check if template is CRDMKR generated
  static isCRDMKRTemplate(template: DesignTemplate): boolean {
    return template.template_data?.sourceType === 'crdmkr-generated' || 
           template.template_data?.sourceType === 'crdmkr';
  }

  // Extract customizable parameters from template
  static extractParameters(template: CRDMKRTemplate): TemplateParameter[] {
    return template.parameters || [];
  }

  // Apply parameter values to template (stub implementation)
  static applyParameters(
    template: CRDMKRTemplate, 
    parameterValues: Record<string, any>
  ): CRDMKRTemplate {
    // TODO: Implement parameter application logic
    console.log('Applying parameters:', parameterValues, 'to template:', template.name);
    return template;
  }

  // Generate SVG from template (stub implementation)
  static generateSVG(
    template: CRDMKRTemplate,
    parameterValues: Record<string, any> = {}
  ): string {
    // TODO: Implement SVG generation from template data
    console.log('Generating SVG for template:', template.name, 'with params:', parameterValues);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#f0f0f0" stroke="#ccc"/>
      <text x="200" y="300" text-anchor="middle" font-size="16">${template.name}</text>
    </svg>`;
  }

  // Get template statistics
  static getTemplateStats(template: CRDMKRTemplate) {
    return {
      layerCount: template.layers?.length || 0,
      parameterCount: template.parameters?.length || 0,
      hasAIAnalysis: !!template.aiAnalysis,
      confidence: template.aiAnalysis?.confidence || 0,
      detectedRegions: template.aiAnalysis?.detectedRegions?.length || 0
    };
  }

  // Validate template compatibility
  static validateTemplate(template: CRDMKRTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required');
    }
    
    if (!template.category || template.category.trim().length === 0) {
      errors.push('Template category is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
