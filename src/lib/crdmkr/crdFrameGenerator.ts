
import type { PSDLayer } from './psdProcessor';
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
  layers: PSDLayer[];
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
    console.log('🎯 Generating CRD template from frame data:', frameData);
    
    try {
      // Create SVG template data
      const svgTemplate = await this.createSVGTemplate(frameData);
      
      // Build template data structure
      const templateData = {
        type: 'crdmkr-generated',
        sourceType: 'psd',
        dimensions: frameData.dimensions,
        layers: frameData.layers.map(layer => ({
          id: layer.id,
          name: layer.name,
          type: layer.type,
          bounds: layer.bounds,
          imageUrl: layer.imageUrl,
          visible: true,
          opacity: layer.opacity,
          blendMode: layer.blendMode
        })),
        photoReplacement: frameData.photoReplacement,
        svg: svgTemplate,
        fabricData: await this.createFabricData(frameData)
      };
      
      // Create DesignTemplate object
      const template: DesignTemplate = {
        id: frameData.id,
        name: frameData.name,
        category: frameData.category,
        preview_url: frameData.previewUrl,
        description: frameData.description,
        is_premium: false,
        usage_count: 0,
        tags: ['psd-generated', 'custom', 'layered'],
        template_data: templateData
      };
      
      console.log('✅ CRD Template generated:', template);
      return template;
    } catch (error) {
      console.error('❌ Error generating CRD template:', error);
      throw new Error(`Failed to generate CRD template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static async createSVGTemplate(frameData: CRDFrameData): Promise<string> {
    const { dimensions, layers, photoReplacement } = frameData;
    
    let svgContent = `
      <svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="cardBounds">
            <rect width="${dimensions.width}" height="${dimensions.height}" />
          </clipPath>
        </defs>
        <g clip-path="url(#cardBounds)">
    `;
    
    // Add photo placeholder if there's a photo replacement
    if (photoReplacement) {
      svgContent += `
        <rect 
          x="${photoReplacement.bounds.x}" 
          y="${photoReplacement.bounds.y}" 
          width="${photoReplacement.bounds.width}" 
          height="${photoReplacement.bounds.height}"
          fill="url(#userImage)"
          id="photoPlaceholder"
        />
      `;
    }
    
    // Add each layer as an image element
    for (const layer of layers) {
      if (layer.imageUrl && layer.id !== photoReplacement?.layerId) {
        svgContent += `
          <image 
            x="${layer.bounds.x}" 
            y="${layer.bounds.y}" 
            width="${layer.bounds.width}" 
            height="${layer.bounds.height}"
            href="${layer.imageUrl}"
            opacity="${layer.opacity}"
            id="${layer.id}"
          />
        `;
      }
    }
    
    svgContent += `
        </g>
      </svg>
    `;
    
    return svgContent;
  }
  
  private static async createFabricData(frameData: CRDFrameData): Promise<any> {
    const objects = [];
    
    // Add photo placeholder
    if (frameData.photoReplacement) {
      const bounds = frameData.photoReplacement.bounds;
      objects.push({
        type: 'rect',
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        fill: 'rgba(200, 200, 200, 0.5)',
        stroke: '#10b981',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        name: 'photoPlaceholder',
        id: 'photoPlaceholder'
      });
    }
    
    // Add layer objects
    for (const layer of frameData.layers) {
      if (layer.imageUrl && layer.id !== frameData.photoReplacement?.layerId) {
        objects.push({
          type: 'image',
          left: layer.bounds.x,
          top: layer.bounds.y,
          width: layer.bounds.width,
          height: layer.bounds.height,
          src: layer.imageUrl,
          opacity: layer.opacity,
          selectable: false,
          name: layer.name,
          id: layer.id
        });
      }
    }
    
    return {
      version: '6.0.0',
      objects: objects,
      background: 'white',
      width: frameData.dimensions.width,
      height: frameData.dimensions.height
    };
  }
  
  static async saveTemplate(template: DesignTemplate): Promise<boolean> {
    try {
      // In a real implementation, this would save to the database
      // For now, we'll store in localStorage as a fallback
      const existingTemplates = this.getStoredTemplates();
      existingTemplates.push(template);
      localStorage.setItem('crdmkr_templates', JSON.stringify(existingTemplates));
      
      console.log('✅ Template saved locally:', template.id);
      return true;
    } catch (error) {
      console.error('❌ Error saving template:', error);
      return false;
    }
  }
  
  static getStoredTemplates(): DesignTemplate[] {
    try {
      const stored = localStorage.getItem('crdmkr_templates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error loading stored templates:', error);
      return [];
    }
  }
}
