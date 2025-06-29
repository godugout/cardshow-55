
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import type { DetectedRegion } from '@/types/crdmkr';

interface ParameterDefinition {
  id: string;
  name: string;
  type: 'color' | 'text' | 'image' | 'number' | 'boolean';
  defaultValue: any;
  category: 'team' | 'player' | 'design';
  cssProperty?: string;
  fabricProperty?: string;
  constraints?: {
    min?: number;
    max?: number;
    options?: string[];
  };
}

interface TemplateParameters {
  parameters: ParameterDefinition[];
  cssVariables: Record<string, string>;
  fabricBindings: Record<string, string>;
}

export class TemplateParameterizer {
  generateParameters(
    canvas: FabricCanvas, 
    detectedRegions: DetectedRegion[] = []
  ): TemplateParameters {
    const parameters: ParameterDefinition[] = [];
    const cssVariables: Record<string, string> = {};
    const fabricBindings: Record<string, string> = {};

    // Process fabric objects
    const objects = canvas.getObjects();
    objects.forEach((obj, index) => {
      const objectId = obj.data?.regionId || `element-${index}`;
      const regionType = obj.data?.regionType || this.inferRegionType(obj);

      // Generate parameters based on object type and properties
      this.generateObjectParameters(obj, objectId, regionType, parameters, cssVariables, fabricBindings);
    });

    // Add region-specific parameters
    detectedRegions.forEach(region => {
      this.generateRegionParameters(region, parameters, cssVariables);
    });

    // Add common template parameters
    this.addCommonParameters(parameters, cssVariables);

    return {
      parameters,
      cssVariables,
      fabricBindings
    };
  }

  private generateObjectParameters(
    obj: FabricObject,
    objectId: string,
    regionType: string,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>,
    fabricBindings: Record<string, string>
  ): void {
    const baseId = objectId.replace(/[^a-zA-Z0-9]/g, '');

    // Fill color parameter
    if (obj.fill && typeof obj.fill === 'string') {
      const paramId = `${baseId}FillColor`;
      parameters.push({
        id: paramId,
        name: `${this.formatName(baseId)} Fill Color`,
        type: 'color',
        defaultValue: obj.fill,
        category: regionType === 'logo' ? 'team' : 'design',
        cssProperty: `--${objectId}-fill-color`,
        fabricProperty: 'fill'
      });
      cssVariables[`--${objectId}-fill-color`] = obj.fill;
      fabricBindings[paramId] = `${objectId}.fill`;
    }

    // Stroke color parameter
    if (obj.stroke && typeof obj.stroke === 'string') {
      const paramId = `${baseId}StrokeColor`;
      parameters.push({
        id: paramId,
        name: `${this.formatName(baseId)} Border Color`,
        type: 'color',
        defaultValue: obj.stroke,
        category: 'design',
        cssProperty: `--${objectId}-stroke-color`,
        fabricProperty: 'stroke'
      });
      cssVariables[`--${objectId}-stroke-color`] = obj.stroke;
      fabricBindings[paramId] = `${objectId}.stroke`;
    }

    // Opacity parameter
    if (obj.opacity !== undefined && obj.opacity !== 1) {
      const paramId = `${baseId}Opacity`;
      parameters.push({
        id: paramId,
        name: `${this.formatName(baseId)} Opacity`,
        type: 'number',
        defaultValue: obj.opacity,
        category: 'design',
        cssProperty: `--${objectId}-opacity`,
        fabricProperty: 'opacity',
        constraints: { min: 0, max: 1 }
      });
      cssVariables[`--${objectId}-opacity`] = obj.opacity.toString();
      fabricBindings[paramId] = `${objectId}.opacity`;
    }

    // Text-specific parameters
    if (obj.type === 'text' || obj.type === 'i-text') {
      this.generateTextParameters(obj, objectId, baseId, parameters, cssVariables, fabricBindings);
    }
  }

  private generateTextParameters(
    obj: FabricObject,
    objectId: string,
    baseId: string,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>,
    fabricBindings: Record<string, string>
  ): void {
    // Text content
    const textContentParam = `${baseId}Text`;
    parameters.push({
      id: textContentParam,
      name: `${this.formatName(baseId)} Text`,
      type: 'text',
      defaultValue: (obj as any).text || '',
      category: 'player',
      fabricProperty: 'text'
    });
    fabricBindings[textContentParam] = `${objectId}.text`;

    // Font family
    if ((obj as any).fontFamily) {
      const fontParam = `${baseId}Font`;
      parameters.push({
        id: fontParam,
        name: `${this.formatName(baseId)} Font`,
        type: 'text',
        defaultValue: (obj as any).fontFamily,
        category: 'design',
        fabricProperty: 'fontFamily',
        constraints: {
          options: ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana']
        }
      });
      fabricBindings[fontParam] = `${objectId}.fontFamily`;
    }

    // Font size
    if ((obj as any).fontSize) {
      const sizeParam = `${baseId}FontSize`;
      parameters.push({
        id: sizeParam,
        name: `${this.formatName(baseId)} Font Size`,
        type: 'number',
        defaultValue: (obj as any).fontSize,
        category: 'design',
        fabricProperty: 'fontSize',
        constraints: { min: 8, max: 72 }
      });
      fabricBindings[sizeParam] = `${objectId}.fontSize`;
    }
  }

  private generateRegionParameters(
    region: DetectedRegion,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>
  ): void {
    const regionId = region.id.replace(/[^a-zA-Z0-9]/g, '');
    
    // Visibility parameter for each region
    parameters.push({
      id: `${regionId}Visible`,
      name: `Show ${this.formatName(regionId)}`,
      type: 'boolean',
      defaultValue: true,
      category: 'design',
      cssProperty: `--${region.id}-display`
    });
    cssVariables[`--${region.id}-display`] = 'block';

    // Region-specific parameters based on type
    switch (region.type) {
      case 'photo':
        this.addPhotoParameters(region, parameters, cssVariables);
        break;
      case 'text':
        this.addTextRegionParameters(region, parameters, cssVariables);
        break;
      case 'logo':
        this.addLogoParameters(region, parameters, cssVariables);
        break;
    }
  }

  private addPhotoParameters(
    region: DetectedRegion,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>
  ): void {
    const regionId = region.id.replace(/[^a-zA-Z0-9]/g, '');
    
    parameters.push({
      id: `${regionId}Image`,
      name: 'Player Photo',
      type: 'image',
      defaultValue: '',
      category: 'player'
    });

    parameters.push({
      id: `${regionId}ImageFit`,
      name: 'Photo Fit',
      type: 'text',
      defaultValue: 'cover',
      category: 'design',
      constraints: {
        options: ['cover', 'contain', 'fill']
      }
    });
  }

  private addTextRegionParameters(
    region: DetectedRegion,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>
  ): void {
    const regionId = region.id.replace(/[^a-zA-Z0-9]/g, '');
    
    parameters.push({
      id: `${regionId}TextAlign`,
      name: 'Text Alignment',
      type: 'text',
      defaultValue: 'center',
      category: 'design',
      constraints: {
        options: ['left', 'center', 'right']
      }
    });
  }

  private addLogoParameters(
    region: DetectedRegion,
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>
  ): void {
    const regionId = region.id.replace(/[^a-zA-Z0-9]/g, '');
    
    parameters.push({
      id: `${regionId}Logo`,
      name: 'Team Logo',
      type: 'image',
      defaultValue: '',
      category: 'team'
    });

    parameters.push({
      id: `${regionId}LogoSize`,
      name: 'Logo Size',
      type: 'number',
      defaultValue: 1,
      category: 'design',
      constraints: { min: 0.5, max: 2 }
    });
  }

  private addCommonParameters(
    parameters: ParameterDefinition[],
    cssVariables: Record<string, string>
  ): void {
    // Common team parameters
    parameters.push(
      {
        id: 'teamPrimaryColor',
        name: 'Primary Team Color',
        type: 'color',
        defaultValue: '#1a365d',
        category: 'team',
        cssProperty: '--team-primary-color'
      },
      {
        id: 'teamSecondaryColor',
        name: 'Secondary Team Color',
        type: 'color',
        defaultValue: '#2d3748',
        category: 'team',
        cssProperty: '--team-secondary-color'
      },
      {
        id: 'teamAccentColor',
        name: 'Accent Color',
        type: 'color',
        defaultValue: '#4299e1',
        category: 'team',
        cssProperty: '--team-accent-color'
      }
    );

    // Common player parameters
    parameters.push(
      {
        id: 'playerName',
        name: 'Player Name',
        type: 'text',
        defaultValue: 'Player Name',
        category: 'player'
      },
      {
        id: 'teamName',
        name: 'Team Name',
        type: 'text',
        defaultValue: 'Team Name',
        category: 'team'
      },
      {
        id: 'playerPosition',
        name: 'Position',
        type: 'text',
        defaultValue: 'Position',
        category: 'player'
      }
    );

    // Set CSS variable defaults
    cssVariables['--team-primary-color'] = '#1a365d';
    cssVariables['--team-secondary-color'] = '#2d3748';
    cssVariables['--team-accent-color'] = '#4299e1';
  }

  private inferRegionType(obj: FabricObject): string {
    if (obj.type === 'text' || obj.type === 'i-text') {
      return 'text';
    }
    if (obj.type === 'image') {
      return 'photo';
    }
    if (obj.type === 'rect' || obj.type === 'circle') {
      return 'border';
    }
    return 'decoration';
  }

  private formatName(id: string): string {
    return id
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Apply parameter values to fabric canvas
  applyParametersToCanvas(
    canvas: FabricCanvas,
    parameterValues: Record<string, any>,
    fabricBindings: Record<string, string>
  ): void {
    Object.entries(parameterValues).forEach(([paramId, value]) => {
      const binding = fabricBindings[paramId];
      if (binding) {
        const [objectId, property] = binding.split('.');
        const obj = canvas.getObjects().find(o => 
          (o.data?.regionId || `element-${canvas.getObjects().indexOf(o)}`) === objectId
        );
        
        if (obj && property) {
          (obj as any)[property] = value;
        }
      }
    });

    canvas.renderAll();
  }
}

// Singleton instance
export const templateParameterizer = new TemplateParameterizer();
