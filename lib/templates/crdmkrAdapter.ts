
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
      tags: crdmkrTemplate.tags,
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
      sourceFile: designTemplate.template_data.sourceFile,
      fabricData: designTemplate.template_data.fabricData,
      layers: designTemplate.template_data.layers || [],
      parameters: designTemplate.template_data.parameters || [],
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

  // Apply parameter values to template
  static applyParameters(
    template: CRDMKRTemplate, 
    parameterValues: Record<string, any>
  ): CRDMKRTemplate {
    const updatedTemplate = { ...template };
    
    // Update layers with parameter values
    if (updatedTemplate.layers) {
      updatedTemplate.layers = updatedTemplate.layers.map(layer => {
        const updatedLayer = { ...layer };
        
        // Apply parameter values to layer properties
        if (layer.parameterKey && parameterValues[layer.parameterKey]) {
          const value = parameterValues[layer.parameterKey];
          
          // Apply based on parameter type
          const parameter = template.parameters?.find(p => p.key === layer.parameterKey);
          if (parameter) {
            switch (parameter.type) {
              case 'color':
                if (updatedLayer.styles) {
                  updatedLayer.styles.fill = value;
                }
                break;
              case 'text':
                // Text content would be handled by fabric object
                break;
              case 'image':
              case 'logo':
                // Image source would be handled by fabric object
                break;
            }
          }
        }
        
        return updatedLayer;
      });
    }
    
    return updatedTemplate;
  }

  // Generate SVG from template with parameters
  static generateSVG(
    template: CRDMKRTemplate,
    parameterValues: Record<string, any> = {}
  ): string {
    const parametrizedTemplate = this.applyParameters(template, parameterValues);
    
    // This would typically use the fabric.js canvas to generate SVG
    // For now, return a basic SVG structure
    const { layers = [] } = parametrizedTemplate;
    
    let svgContent = '';
    
    layers.forEach(layer => {
      switch (layer.type) {
        case 'shape':
          svgContent += this.generateShapeSVG(layer);
          break;
        case 'text':
          svgContent += this.generateTextSVG(layer);
          break;
        case 'image':
          svgContent += this.generateImageSVG(layer);
          break;
      }
    });
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
        ${svgContent}
      </svg>
    `;
  }

  // Generate shape SVG
  private static generateShapeSVG(layer: CRDLayer): string {
    const { position, dimensions, styles } = layer;
    const { x, y } = position;
    const { width, height } = dimensions;
    const { fill = '#000000', stroke = 'none', strokeWidth = 0 } = styles || {};
    
    return `
      <rect 
        x="${x}" 
        y="${y}" 
        width="${width}" 
        height="${height}" 
        fill="${fill}" 
        stroke="${stroke}" 
        stroke-width="${strokeWidth}" 
      />
    `;
  }

  // Generate text SVG
  private static generateTextSVG(layer: CRDLayer): string {
    const { position, styles } = layer;
    const { x, y } = position;
    const { 
      fill = '#000000', 
      fontSize = 16, 
      fontFamily = 'Arial',
      fontWeight = 'normal'
    } = styles || {};
    
    return `
      <text 
        x="${x}" 
        y="${y}" 
        fill="${fill}" 
        font-size="${fontSize}" 
        font-family="${fontFamily}" 
        font-weight="${fontWeight}"
      >
        ${layer.name}
      </text>
    `;
  }

  // Generate image SVG
  private static generateImageSVG(layer: CRDLayer): string {
    const { position, dimensions } = layer;
    const { x, y } = position;
    const { width, height } = dimensions;
    
    return `
      <rect 
        x="${x}" 
        y="${y}" 
        width="${width}" 
        height="${height}" 
        fill="#f0f0f0" 
        stroke="#ccc" 
        stroke-width="1" 
        stroke-dasharray="4,4"
      />
      <text 
        x="${x + width/2}" 
        y="${y + height/2}" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        fill="#999"
        font-size="12"
      >
        Image
      </text>
    `;
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
    
    if (!template.layers || template.layers.length === 0) {
      errors.push('Template must have at least one layer');
    }
    
    // Validate layers
    template.layers?.forEach((layer, index) => {
      if (!layer.id) {
        errors.push(`Layer ${index + 1} is missing ID`);
      }
      if (!layer.type) {
        errors.push(`Layer ${index + 1} is missing type`);
      }
      if (!layer.position) {
        errors.push(`Layer ${index + 1} is missing position`);
      }
      if (!layer.dimensions) {
        errors.push(`Layer ${index + 1} is missing dimensions`);
      }
    });
    
    // Validate parameters
    template.parameters?.forEach((param, index) => {
      if (!param.key) {
        errors.push(`Parameter ${index + 1} is missing key`);
      }
      if (!param.type) {
        errors.push(`Parameter ${index + 1} is missing type`);
      }
      if (!param.uiLabel) {
        errors.push(`Parameter ${index + 1} is missing UI label`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
