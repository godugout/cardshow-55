
import type { readPsd } from 'ag-psd';

// Enhanced PSD processor with real PSD parsing capabilities
export interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  visible: boolean;
  opacity: number;
  blendMode: string;
  isPhotoLayer: boolean;
  imageUrl?: string;
  textContent?: string;
  layerImage?: string; // Base64 encoded layer image
}

export interface PSDProcessingResult {
  layers: PSDLayer[];
  dimensions: {
    width: number;
    height: number;
  };
  previewUrl: string;
  originalFile: File;
  flattenedImage: string; // Base64 encoded flattened PSD image
}

export class PSDProcessor {
  static async processPSDFile(file: File): Promise<PSDProcessingResult> {
    console.log('🎨 Processing PSD file:', file.name);
    
    try {
      // Try to process real PSD if ag-psd is available
      if (typeof window !== 'undefined' && (window as any).agPsd) {
        return await this.processRealPSD(file);
      }
      
      // Fallback to enhanced mock processing
      return await this.processEnhancedMock(file);
    } catch (error) {
      console.error('❌ Error processing PSD:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static async processRealPSD(file: File): Promise<PSDProcessingResult> {
    const arrayBuffer = await file.arrayBuffer();
    const psd = (window as any).agPsd.readPsd(new Uint8Array(arrayBuffer));
    
    // Extract flattened image
    const canvas = document.createElement('canvas');
    canvas.width = psd.width;
    canvas.height = psd.height;
    const ctx = canvas.getContext('2d');
    
    if (psd.canvas) {
      ctx?.drawImage(psd.canvas, 0, 0);
    }
    
    const flattenedImage = canvas.toDataURL('image/png');
    
    // Process layers
    const layers: PSDLayer[] = this.extractLayers(psd.children || [], psd.width, psd.height);
    
    return {
      layers,
      dimensions: { width: psd.width, height: psd.height },
      previewUrl: flattenedImage,
      originalFile: file,
      flattenedImage
    };
  }
  
  private static async processEnhancedMock(file: File): Promise<PSDProcessingResult> {
    // Create enhanced mock with actual file preview
    const width = 750;
    const height = 1050;
    
    // Generate realistic preview from file
    const flattenedImage = await this.generateRealisticPreview(file, width, height);
    
    // Create realistic mock layers
    const layers: PSDLayer[] = this.generateEnhancedMockLayers(width, height, file.name);
    
    console.log('✅ Enhanced mock PSD processing complete:', layers.length, 'layers');
    
    return {
      layers,
      dimensions: { width, height },
      previewUrl: flattenedImage,
      originalFile: file,
      flattenedImage
    };
  }
  
  private static extractLayers(children: any[], width: number, height: number): PSDLayer[] {
    const layers: PSDLayer[] = [];
    
    children.forEach((layer, index) => {
      if (layer.canvas) {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = layer.canvas.width;
        layerCanvas.height = layer.canvas.height;
        const layerCtx = layerCanvas.getContext('2d');
        layerCtx?.drawImage(layer.canvas, 0, 0);
        
        layers.push({
          id: `layer-${index}`,
          name: layer.name || `Layer ${index + 1}`,
          type: this.detectLayerType(layer),
          bounds: {
            x: layer.left || 0,
            y: layer.top || 0,
            width: layer.right - layer.left || 100,
            height: layer.bottom - layer.top || 100
          },
          visible: !layer.hidden,
          opacity: (layer.opacity || 255) / 255,
          blendMode: layer.blendMode || 'normal',
          isPhotoLayer: this.isPhotoLayer(layer),
          layerImage: layerCanvas.toDataURL('image/png')
        });
      }
    });
    
    return layers;
  }
  
  private static detectLayerType(layer: any): 'image' | 'text' | 'shape' | 'group' {
    if (layer.text) return 'text';
    if (layer.children) return 'group';
    if (layer.canvas) return 'image';
    return 'shape';
  }
  
  private static isPhotoLayer(layer: any): boolean {
    const name = (layer.name || '').toLowerCase();
    return name.includes('photo') || name.includes('image') || name.includes('picture');
  }
  
  private static async generateRealisticPreview(file: File, width: number, height: number): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Create sophisticated gradient background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add elegant border with gradient
    const borderGradient = ctx.createLinearGradient(0, 0, width, height);
    borderGradient.addColorStop(0, '#45B26B');
    borderGradient.addColorStop(1, '#3772FF');
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
    
    // Add file info with better typography
    ctx.fillStyle = '#45B26B';
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PSD PREVIEW', width / 2, height / 2 - 40);
    
    ctx.fillStyle = '#FCFCFD';
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    const displayName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
    ctx.fillText(displayName, width / 2, height / 2 + 20);
    
    // Add photo area indicator with modern styling
    const photoX = Math.round(width * 0.08);
    const photoY = Math.round(height * 0.08);
    const photoWidth = Math.round(width * 0.84);
    const photoHeight = Math.round(height * 0.55);
    
    // Subtle photo area background
    ctx.fillStyle = 'rgba(69, 178, 107, 0.05)';
    ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
    
    // Dashed border for photo area
    ctx.strokeStyle = '#45B26B';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
    
    // Photo area label
    ctx.fillStyle = '#45B26B';
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillText('Photo Replacement Area', photoX + photoWidth / 2, photoY + photoHeight / 2);
    
    return canvas.toDataURL('image/png');
  }
  
  private static generateEnhancedMockLayers(width: number, height: number, fileName: string): PSDLayer[] {
    return [
      {
        id: 'background',
        name: 'Card Background',
        type: 'shape',
        bounds: { x: 0, y: 0, width, height },
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        isPhotoLayer: false,
        layerImage: this.generateLayerPreview(width, height, 'rgba(26, 26, 46, 0.8)')
      },
      {
        id: 'frame-border',
        name: 'Frame Border',
        type: 'shape',
        bounds: { x: 0, y: 0, width, height },
        visible: true,
        opacity: 0.9,
        blendMode: 'normal',
        isPhotoLayer: false,
        layerImage: this.generateLayerPreview(width, height, 'rgba(69, 178, 107, 0.3)', true)
      },
      {
        id: 'photo-placeholder',
        name: 'Player Photo',
        type: 'image',
        bounds: { 
          x: Math.round(width * 0.08), 
          y: Math.round(height * 0.08), 
          width: Math.round(width * 0.84), 
          height: Math.round(height * 0.55) 
        },
        visible: true,
        opacity: 0.7,
        blendMode: 'normal',
        isPhotoLayer: true,
        layerImage: this.generateLayerPreview(
          Math.round(width * 0.84), 
          Math.round(height * 0.55), 
          'rgba(55, 114, 255, 0.2)'
        )
      },
      {
        id: 'top-decorative',
        name: 'Header Design',
        type: 'shape',
        bounds: { 
          x: Math.round(width * 0.1), 
          y: Math.round(height * 0.02), 
          width: Math.round(width * 0.8), 
          height: Math.round(height * 0.06) 
        },
        visible: true,
        opacity: 0.8,
        blendMode: 'overlay',
        isPhotoLayer: false,
        layerImage: this.generateLayerPreview(
          Math.round(width * 0.8), 
          Math.round(height * 0.06), 
          'rgba(234, 110, 72, 0.6)'
        )
      },
      {
        id: 'stats-background',
        name: 'Stats Background',
        type: 'shape',
        bounds: { 
          x: Math.round(width * 0.08), 
          y: Math.round(height * 0.68), 
          width: Math.round(width * 0.84), 
          height: Math.round(height * 0.25) 
        },
        visible: true,
        opacity: 0.9,
        blendMode: 'normal',
        isPhotoLayer: false,
        layerImage: this.generateLayerPreview(
          Math.round(width * 0.84), 
          Math.round(height * 0.25), 
          'rgba(35, 38, 47, 0.9)'
        )
      },
      {
        id: 'player-name-text',
        name: 'Player Name Text',
        type: 'text',
        bounds: { 
          x: Math.round(width * 0.1), 
          y: Math.round(height * 0.85), 
          width: Math.round(width * 0.8), 
          height: Math.round(height * 0.06) 
        },
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        isPhotoLayer: false,
        textContent: 'PLAYER NAME',
        layerImage: this.generateTextLayerPreview(
          Math.round(width * 0.8), 
          Math.round(height * 0.06), 
          'PLAYER NAME'
        )
      },
      {
        id: 'team-logo-area',
        name: 'Team Logo Area',
        type: 'image',
        bounds: { 
          x: Math.round(width * 0.75), 
          y: Math.round(height * 0.12), 
          width: Math.round(width * 0.15), 
          height: Math.round(width * 0.15) 
        },
        visible: true,
        opacity: 0.6,
        blendMode: 'normal',
        isPhotoLayer: false,
        layerImage: this.generateLayerPreview(
          Math.round(width * 0.15), 
          Math.round(width * 0.15), 
          'rgba(151, 87, 215, 0.4)'
        )
      }
    ];
  }
  
  private static generateLayerPreview(width: number, height: number, color: string, hasBorder = false): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    if (hasBorder) {
      ctx.strokeStyle = color.replace('0.3', '0.8');
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    }
    
    return canvas.toDataURL('image/png');
  }
  
  private static generateTextLayerPreview(width: number, height: number, text: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    ctx.fillStyle = '#FCFCFD';
    ctx.font = `bold ${Math.min(height * 0.6, 24)}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
  }
  
  static async generateCompositePreview(
    layers: PSDLayer[], 
    dimensions: { width: number; height: number },
    visibleLayers: Set<string>,
    flattenedImage?: string
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Draw flattened background image if available (faint grayscale)
    if (flattenedImage) {
      const bgImg = new Image();
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = flattenedImage;
      });
      
      // Apply grayscale filter and low opacity
      ctx.filter = 'grayscale(100%) opacity(0.15)';
      ctx.drawImage(bgImg, 0, 0);
      ctx.filter = 'none';
    }
    
    // Draw visible layers with proper opacity and blending
    for (const layer of layers) {
      if (!visibleLayers.has(layer.id) || !layer.layerImage) continue;
      
      const layerImg = new Image();
      await new Promise((resolve, reject) => {
        layerImg.onload = resolve;
        layerImg.onerror = reject;
        layerImg.src = layer.layerImage!;
      });
      
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
      
      ctx.drawImage(
        layerImg, 
        layer.bounds.x, 
        layer.bounds.y, 
        layer.bounds.width, 
        layer.bounds.height
      );
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    
    return canvas.toDataURL('image/png');
  }
}
