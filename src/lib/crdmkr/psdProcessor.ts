
// Browser-compatible PSD processor using mock layers for immediate functionality
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
}

export interface PSDProcessingResult {
  layers: PSDLayer[];
  dimensions: {
    width: number;
    height: number;
  };
  previewUrl: string;
  originalFile: File;
}

export class PSDProcessor {
  static async processPSDFile(file: File): Promise<PSDProcessingResult> {
    console.log('🎨 Processing PSD file:', file.name);
    
    try {
      // Standard trading card dimensions (assuming 300 DPI)
      const width = 750;  // 2.5" × 300 DPI
      const height = 1050; // 3.5" × 300 DPI
      
      // Generate a placeholder preview image
      const previewUrl = await this.generatePlaceholderPreview(width, height, file.name);
      
      // Create realistic mock layers based on common card design patterns
      const layers: PSDLayer[] = this.generateMockLayers(width, height, file.name);
      
      console.log('✅ PSD processing complete with mock layers:', layers.length);
      
      return {
        layers,
        dimensions: { width, height },
        previewUrl,
        originalFile: file
      };
    } catch (error) {
      console.error('❌ Error processing PSD:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static generateMockLayers(width: number, height: number, fileName: string): PSDLayer[] {
    const baseName = fileName.replace(/\.(psd|psb)$/i, '');
    
    return [
      {
        id: 'background',
        name: 'Background',
        type: 'shape',
        bounds: { x: 0, y: 0, width, height },
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        isPhotoLayer: false
      },
      {
        id: 'frame-border',
        name: 'Frame Border',
        type: 'shape',
        bounds: { x: 0, y: 0, width, height },
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        isPhotoLayer: false
      },
      {
        id: 'photo-placeholder',
        name: 'Photo Area',
        type: 'image',
        bounds: { 
          x: Math.round(width * 0.08), 
          y: Math.round(height * 0.08), 
          width: Math.round(width * 0.84), 
          height: Math.round(height * 0.55) 
        },
        visible: true,
        opacity: 0.3,
        blendMode: 'normal',
        isPhotoLayer: true
      },
      {
        id: 'top-decorative',
        name: 'Top Decoration',
        type: 'shape',
        bounds: { 
          x: Math.round(width * 0.1), 
          y: Math.round(height * 0.02), 
          width: Math.round(width * 0.8), 
          height: Math.round(height * 0.06) 
        },
        visible: true,
        opacity: 0.9,
        blendMode: 'normal',
        isPhotoLayer: false
      },
      {
        id: 'bottom-stats-area',
        name: 'Stats Area',
        type: 'shape',
        bounds: { 
          x: Math.round(width * 0.08), 
          y: Math.round(height * 0.68), 
          width: Math.round(width * 0.84), 
          height: Math.round(height * 0.25) 
        },
        visible: true,
        opacity: 0.8,
        blendMode: 'normal',
        isPhotoLayer: false
      },
      {
        id: 'player-name-text',
        name: 'Player Name',
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
        textContent: 'PLAYER NAME'
      },
      {
        id: 'team-logo-area',
        name: 'Team Logo',
        type: 'image',
        bounds: { 
          x: Math.round(width * 0.75), 
          y: Math.round(height * 0.12), 
          width: Math.round(width * 0.15), 
          height: Math.round(width * 0.15) 
        },
        visible: true,
        opacity: 0.7,
        blendMode: 'normal',
        isPhotoLayer: false
      },
      {
        id: 'corner-effects',
        name: 'Corner Effects',
        type: 'shape',
        bounds: { x: 0, y: 0, width, height },
        visible: true,
        opacity: 0.6,
        blendMode: 'overlay',
        isPhotoLayer: false
      }
    ];
  }
  
  private static async generatePlaceholderPreview(width: number, height: number, fileName: string): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(0.5, '#1a1a1a');
    gradient.addColorStop(1, '#0a0a0a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add border
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Add "PSD" text indicator
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PSD', width / 2, height / 2 - 20);
    
    // Add filename
    ctx.fillStyle = '#999999';
    ctx.font = '20px Arial';
    const displayName = fileName.length > 20 ? fileName.substring(0, 17) + '...' : fileName;
    ctx.fillText(displayName, width / 2, height / 2 + 30);
    
    // Add photo placeholder area
    const photoX = Math.round(width * 0.08);
    const photoY = Math.round(height * 0.08);
    const photoWidth = Math.round(width * 0.84);
    const photoHeight = Math.round(height * 0.55);
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = '16px Arial';
    ctx.fillText('Photo Area', photoX + photoWidth / 2, photoY + photoHeight / 2);
    
    return canvas.toDataURL('image/png');
  }
  
  static async generateCompositePreview(
    layers: PSDLayer[], 
    dimensions: { width: number; height: number },
    visibleLayers: Set<string>
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Create background
    const gradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(0.5, '#1a1a1a');
    gradient.addColorStop(1, '#0a0a0a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each visible layer
    for (const layer of layers) {
      if (!visibleLayers.has(layer.id)) continue;
      
      ctx.globalAlpha = layer.opacity;
      
      if (layer.isPhotoLayer) {
        // Draw photo placeholder
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(layer.bounds.x, layer.bounds.y, layer.bounds.width, layer.bounds.height);
        
        ctx.fillStyle = 'rgba(0, 255, 136, 0.1)';
        ctx.fillRect(layer.bounds.x, layer.bounds.y, layer.bounds.width, layer.bounds.height);
      } else if (layer.type === 'text' && layer.textContent) {
        // Draw text layer
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          layer.textContent, 
          layer.bounds.x + layer.bounds.width / 2, 
          layer.bounds.y + layer.bounds.height / 2
        );
      } else if (layer.type === 'shape') {
        // Draw shape layer
        const alpha = layer.name.includes('Background') ? 0.3 : 0.1;
        ctx.fillStyle = `rgba(128, 128, 128, ${alpha})`;
        ctx.fillRect(layer.bounds.x, layer.bounds.y, layer.bounds.width, layer.bounds.height);
        
        if (layer.name.includes('Border') || layer.name.includes('Frame')) {
          ctx.strokeStyle = '#404040';
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          ctx.strokeRect(layer.bounds.x, layer.bounds.y, layer.bounds.width, layer.bounds.height);
        }
      }
      
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    }
    
    return canvas.toDataURL('image/png');
  }
}
