
import { Canvas as FabricCanvas, FabricObject } from 'fabric';
import type { TeamColorScheme } from '@/components/editor/templates/TeamColors';

interface SVGExportOptions {
  width?: number;
  height?: number;
  viewBox?: string;
  preserveAspectRatio?: string;
  includeParameterPlaceholders?: boolean;
  optimized?: boolean;
}

interface ParameterizedElement {
  id: string;
  type: string;
  parameters: Record<string, any>;
  fabricProps: Record<string, any>;
}

export class FabricToSVGConverter {
  private parameterCounter = 0;
  private parameterMap = new Map<string, string>();

  async convertCanvasToSVG(
    canvas: FabricCanvas, 
    options: SVGExportOptions = {}
  ): Promise<string> {
    const {
      width = canvas.width || 350,
      height = canvas.height || 490,
      viewBox = `0 0 ${width} ${height}`,
      preserveAspectRatio = 'xMidYMid meet',
      includeParameterPlaceholders = true,
      optimized = true
    } = options;

    // Get base SVG from fabric
    let svgString = canvas.toSVG({
      width,
      height,
      viewBox: { 
        x: 0, 
        y: 0, 
        width, 
        height 
      }
    });

    // Inject parameter placeholders if requested
    if (includeParameterPlaceholders) {
      svgString = this.injectParameterPlaceholders(svgString, canvas);
    }

    // Optimize SVG if requested
    if (optimized) {
      svgString = this.optimizeSVG(svgString);
    }

    // Add responsive attributes
    svgString = this.addResponsiveAttributes(svgString, viewBox, preserveAspectRatio);

    return svgString;
  }

  convertObjectToSVG(fabricObject: FabricObject): string {
    // Use fabric's built-in object SVG export
    const svgString = fabricObject.toSVG();
    
    // Add parameter attributes based on object type
    return this.addObjectParameters(svgString, fabricObject);
  }

  private injectParameterPlaceholders(svgString: string, canvas: FabricCanvas): string {
    const objects = canvas.getObjects();
    let processedSVG = svgString;

    objects.forEach((obj, index) => {
      const objectId = obj.data?.regionId || `element-${index}`;
      
      // Replace colors with CSS custom properties
      if (obj.fill && typeof obj.fill === 'string') {
        const paramName = `--${objectId}-fill-color`;
        processedSVG = processedSVG.replace(
          new RegExp(`fill="${obj.fill}"`, 'g'),
          `fill="var(${paramName}, ${obj.fill})"`
        );
      }

      // Replace stroke colors
      if (obj.stroke && typeof obj.stroke === 'string') {
        const paramName = `--${objectId}-stroke-color`;
        processedSVG = processedSVG.replace(
          new RegExp(`stroke="${obj.stroke}"`, 'g'),
          `stroke="var(${paramName}, ${obj.stroke})"`
        );
      }

      // Add data attributes for customizable zones
      if (obj.data?.regionType) {
        const regionType = obj.data.regionType;
        processedSVG = processedSVG.replace(
          /(<g[^>]*>)/,
          `$1<g data-region-type="${regionType}" data-region-id="${objectId}">`
        );
      }
    });

    return processedSVG;
  }

  private addObjectParameters(svgString: string, fabricObject: FabricObject): string {
    const objectData = fabricObject.data || {};
    const regionType = objectData.regionType || 'unknown';
    const regionId = objectData.regionId || `obj-${this.parameterCounter++}`;

    // Wrap object in a group with data attributes
    return `<g data-region-type="${regionType}" data-region-id="${regionId}" data-fabric-type="${fabricObject.type}">
      ${svgString}
    </g>`;
  }

  private optimizeSVG(svgString: string): string {
    return svgString
      // Remove unnecessary precision from numbers
      .replace(/(\d+\.\d{6,})/g, (match) => parseFloat(match).toFixed(3))
      // Remove default attributes
      .replace(/fill-opacity="1"/g, '')
      .replace(/stroke-opacity="1"/g, '')
      .replace(/opacity="1"/g, '')
      // Consolidate whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  private addResponsiveAttributes(
    svgString: string, 
    viewBox: string, 
    preserveAspectRatio: string
  ): string {
    // Add responsive attributes to the root SVG element
    return svgString.replace(
      /<svg([^>]*)>/,
      `<svg$1 viewBox="${viewBox}" preserveAspectRatio="${preserveAspectRatio}" class="crd-template-svg">`
    );
  }

  generateParameterDefinitions(canvas: FabricCanvas): Record<string, any> {
    const objects = canvas.getObjects();
    const parameters: Record<string, any> = {};

    objects.forEach((obj, index) => {
      const objectId = obj.data?.regionId || `element-${index}`;
      const regionType = obj.data?.regionType || 'decoration';

      parameters[objectId] = {
        type: regionType,
        fillColor: obj.fill,
        strokeColor: obj.stroke,
        strokeWidth: obj.strokeWidth,
        opacity: obj.opacity,
        visible: obj.visible,
        position: {
          left: obj.left,
          top: obj.top
        },
        size: {
          width: obj.width,
          height: obj.height
        },
        fabricType: obj.type
      };
    });

    return parameters;
  }

  generateCSSCustomProperties(canvas: FabricCanvas): string {
    const objects = canvas.getObjects();
    const cssProperties: string[] = [];

    objects.forEach((obj, index) => {
      const objectId = obj.data?.regionId || `element-${index}`;
      
      if (obj.fill && typeof obj.fill === 'string') {
        cssProperties.push(`  --${objectId}-fill-color: ${obj.fill};`);
      }
      
      if (obj.stroke && typeof obj.stroke === 'string') {
        cssProperties.push(`  --${objectId}-stroke-color: ${obj.stroke};`);
      }

      if (obj.opacity !== undefined && obj.opacity !== 1) {
        cssProperties.push(`  --${objectId}-opacity: ${obj.opacity};`);
      }
    });

    return `.crd-template-svg {\n${cssProperties.join('\n')}\n}`;
  }

  // Generate React component compatible with existing templates
  generateReactComponent(
    canvas: FabricCanvas, 
    componentName: string,
    options: SVGExportOptions = {}
  ): string {
    const svgContent = this.convertCanvasToSVG(canvas, options);
    const parameters = this.generateParameterDefinitions(canvas);
    const cssProperties = this.generateCSSCustomProperties(canvas);

    return `import React from 'react';
import type { TeamColorScheme } from '@/components/editor/templates/TeamColors';

interface ${componentName}Props {
  imageUrl?: string;
  playerName?: string;
  teamName?: string;
  position?: string;
  colors?: TeamColorScheme;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  imageUrl,
  playerName,
  teamName,
  position,
  colors
}) => {
  const templateStyle = {
    ${Object.entries(parameters).map(([id, params]) => 
      `'--${id}-fill-color': colors?.primary || '${params.fillColor}',`
    ).join('\n    ')}
  } as React.CSSProperties;

  return (
    <div className="relative w-full h-full" style={templateStyle}>
      ${svgContent.replace(/'/g, "\\'")}
    </div>
  );
};`;
  }
}

// Singleton instance
export const fabricToSVGConverter = new FabricToSVGConverter();
