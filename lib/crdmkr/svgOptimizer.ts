
interface OptimizationOptions {
  removeComments?: boolean;
  removeMetadata?: boolean;
  removeUnusedDefs?: boolean;
  minifyPaths?: boolean;
  roundNumbers?: number;
  removeDefaultAttributes?: boolean;
  collapseGroups?: boolean;
  removeEmptyElements?: boolean;
}

export class SVGOptimizer {
  optimize(svgString: string, options: OptimizationOptions = {}): string {
    const {
      removeComments = true,
      removeMetadata = true,
      removeUnusedDefs = true,
      minifyPaths = true,
      roundNumbers = 3,
      removeDefaultAttributes = true,
      collapseGroups = true,
      removeEmptyElements = true
    } = options;

    let optimizedSVG = svgString;

    // Remove comments
    if (removeComments) {
      optimizedSVG = this.removeComments(optimizedSVG);
    }

    // Remove metadata
    if (removeMetadata) {
      optimizedSVG = this.removeMetadata(optimizedSVG);
    }

    // Round numbers to reduce precision
    if (roundNumbers > 0) {
      optimizedSVG = this.roundNumbers(optimizedSVG, roundNumbers);
    }

    // Remove default attributes
    if (removeDefaultAttributes) {
      optimizedSVG = this.removeDefaultAttributes(optimizedSVG);
    }

    // Minify paths
    if (minifyPaths) {
      optimizedSVG = this.minifyPaths(optimizedSVG);
    }

    // Remove empty elements
    if (removeEmptyElements) {
      optimizedSVG = this.removeEmptyElements(optimizedSVG);
    }

    // Collapse unnecessary groups
    if (collapseGroups) {
      optimizedSVG = this.collapseGroups(optimizedSVG);
    }

    // Remove unused definitions
    if (removeUnusedDefs) {
      optimizedSVG = this.removeUnusedDefs(optimizedSVG);
    }

    // Clean up whitespace
    optimizedSVG = this.cleanupWhitespace(optimizedSVG);

    return optimizedSVG;
  }

  private removeComments(svg: string): string {
    return svg.replace(/<!--[\s\S]*?-->/g, '');
  }

  private removeMetadata(svg: string): string {
    return svg
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      .replace(/<title[\s\S]*?<\/title>/gi, '')
      .replace(/<desc[\s\S]*?<\/desc>/gi, '');
  }

  private roundNumbers(svg: string, precision: number): string {
    const numberRegex = /(\d+\.\d{4,})/g;
    return svg.replace(numberRegex, (match) => {
      const num = parseFloat(match);
      return num.toFixed(precision).replace(/\.?0+$/, '');
    });
  }

  private removeDefaultAttributes(svg: string): string {
    return svg
      // Remove default fill and stroke attributes
      .replace(/\s+fill="none"/g, '')
      .replace(/\s+stroke="none"/g, '')
      .replace(/\s+fill-opacity="1"/g, '')
      .replace(/\s+stroke-opacity="1"/g, '')
      .replace(/\s+opacity="1"/g, '')
      .replace(/\s+stroke-width="1"/g, '')
      .replace(/\s+stroke-linecap="butt"/g, '')
      .replace(/\s+stroke-linejoin="miter"/g, '')
      .replace(/\s+stroke-miterlimit="4"/g, '')
      .replace(/\s+fill-rule="nonzero"/g, '')
      .replace(/\s+clip-rule="nonzero"/g, '');
  }

  private minifyPaths(svg: string): string {
    // Simplify path data by removing unnecessary spaces and commands
    return svg.replace(/\s*([MmLlHhVvCcSsQqTtAaZz])\s*/g, '$1')
              .replace(/\s+/g, ' ')
              .replace(/([MmLlHhVvCcSsQqTtAaZz])\s+/g, '$1');
  }

  private removeEmptyElements(svg: string): string {
    return svg
      .replace(/<g[^>]*>\s*<\/g>/g, '')
      .replace(/<defs[^>]*>\s*<\/defs>/g, '')
      .replace(/<clipPath[^>]*>\s*<\/clipPath>/g, '')
      .replace(/<mask[^>]*>\s*<\/mask>/g, '');
  }

  private collapseGroups(svg: string): string {
    // Remove groups that only contain a single element and have no attributes
    return svg.replace(/<g>\s*(<[^>]+(?:\/>|>[^<]*<\/[^>]+>))\s*<\/g>/g, '$1');
  }

  private removeUnusedDefs(svg: string): string {
    // Extract all IDs used in the SVG
    const usedIds = new Set<string>();
    const idUsageRegex = /(?:url\(#|href="#|xlink:href="#)([^")]+)/g;
    let match;
    
    while ((match = idUsageRegex.exec(svg)) !== null) {
      usedIds.add(match[1]);
    }

    // Remove unused definitions
    return svg.replace(/<defs[^>]*>([\s\S]*?)<\/defs>/g, (defsMatch, defsContent) => {
      const cleanedDefs = defsContent.replace(
        /<[^>]+\s+id="([^"]+)"[^>]*>[\s\S]*?<\/[^>]+>/g,
        (defMatch: string, id: string) => {
          return usedIds.has(id) ? defMatch : '';
        }
      );
      
      return cleanedDefs.trim() ? `<defs>${cleanedDefs}</defs>` : '';
    });
  }

  private cleanupWhitespace(svg: string): string {
    return svg
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/^\s+|\s+$/g, '')
      .trim();
  }

  // Generate symbol definitions for reused elements
  generateSymbolDefinitions(elements: string[]): string {
    const symbols = elements.map((element, index) => {
      const symbolId = `symbol-${index}`;
      return `<symbol id="${symbolId}">${element}</symbol>`;
    }).join('');

    return symbols ? `<defs>${symbols}</defs>` : '';
  }

  // Extract reusable elements that appear multiple times
  extractReusableElements(svg: string): { optimized: string; symbols: string } {
    const elementCounts = new Map<string, number>();
    const elementRegex = /<(rect|circle|ellipse|line|polyline|polygon|path)[^>]*\/?>(?:[^<]*<\/\1>)?/g;
    
    let match;
    while ((match = elementRegex.exec(svg)) !== null) {
      const element = match[0];
      const count = elementCounts.get(element) || 0;
      elementCounts.set(element, count + 1);
    }

    // Find elements that appear more than once
    const reusableElements: string[] = [];
    elementCounts.forEach((count, element) => {
      if (count > 1) {
        reusableElements.push(element);
      }
    });

    if (reusableElements.length === 0) {
      return { optimized: svg, symbols: '' };
    }

    // Replace reusable elements with symbol references
    let optimizedSVG = svg;
    const symbols = this.generateSymbolDefinitions(reusableElements);

    reusableElements.forEach((element, index) => {
      const symbolId = `symbol-${index}`;
      const useElement = `<use href="#${symbolId}"/>`;
      optimizedSVG = optimizedSVG.replace(new RegExp(element.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), useElement);
    });

    return { optimized: optimizedSVG, symbols };
  }

  // Calculate optimal viewBox for responsive scaling
  calculateOptimalViewBox(svg: string): string {
    const elements = svg.match(/<(rect|circle|ellipse|line|polyline|polygon|path)[^>]*(?:\/>|>[^<]*<\/\1>)/g) || [];
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(element => {
      // Extract coordinates from various shape types
      const coords = this.extractCoordinates(element);
      coords.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
    });

    // Add padding
    const padding = 10;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const width = maxX - minX;
    const height = maxY - minY;

    return `${minX} ${minY} ${width} ${height}`;
  }

  private extractCoordinates(element: string): number[][] {
    const coords: number[][] = [];
    
    // Extract x, y coordinates
    const xyRegex = /(?:x|cx)="([^"]+)"[^>]*(?:y|cy)="([^"]+)"/g;
    let match;
    
    while ((match = xyRegex.exec(element)) !== null) {
      coords.push([parseFloat(match[1]), parseFloat(match[2])]);
    }

    // Extract path coordinates
    const pathMatch = element.match(/d="([^"]+)"/);
    if (pathMatch) {
      const pathData = pathMatch[1];
      const pathCoords = pathData.match(/[\d.-]+/g) || [];
      
      for (let i = 0; i < pathCoords.length; i += 2) {
        if (i + 1 < pathCoords.length) {
          coords.push([parseFloat(pathCoords[i]), parseFloat(pathCoords[i + 1])]);
        }
      }
    }

    return coords;
  }
}

// Singleton instance
export const svgOptimizer = new SVGOptimizer();
