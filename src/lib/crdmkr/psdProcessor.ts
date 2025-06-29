
// Browser-compatible PSD processor using File API and Canvas
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
      // For now, we'll create a mock layer structure and use the file as a flattened image
      // This is a simplified approach that can be enhanced with a proper PSD parser later
      
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      // Create canvas to work with the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 400;
      canvas.height = img.height || 600;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw the image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Create mock layers based on common card design patterns
      const layers: PSDLayer[] = [
        {
          id: 'background',
          name: 'Background',
          type: 'shape',
          bounds: { x: 0, y: 0, width: canvas.width, height: canvas.height },
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          isPhotoLayer: false,
          imageUrl: canvas.toDataURL('image/png')
        },
        {
          id: 'photo-area',
          name: 'Photo Area',
          type: 'image',
          bounds: { 
            x: Math.round(canvas.width * 0.1), 
            y: Math.round(canvas.height * 0.1), 
            width: Math.round(canvas.width * 0.8), 
            height: Math.round(canvas.height * 0.6) 
          },
          visible: true,
          opacity: 0.3,
          blendMode: 'normal',
          isPhotoLayer: true,
          imageUrl: undefined // This will be replaced by user's photo
        },
        {
          id: 'frame-overlay',
          name: 'Frame Overlay',
          type: 'shape',
          bounds: { x: 0, y: 0, width: canvas.width, height: canvas.height },
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          isPhotoLayer: false,
          imageUrl: canvas.toDataURL('image/png')
        }
      ];
      
      const previewUrl = canvas.toDataURL('image/png');
      
      return {
        layers,
        dimensions: {
          width: canvas.width,
          height: canvas.height
        },
        previewUrl,
        originalFile: file
      };
    } catch (error) {
      console.error('❌ Error processing PSD:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    
    // Clear canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each visible layer
    for (const layer of layers) {
      if (visibleLayers.has(layer.id) && layer.imageUrl && !layer.isPhotoLayer) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = layer.imageUrl!;
          });
          
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(img, layer.bounds.x, layer.bounds.y, layer.bounds.width, layer.bounds.height);
          ctx.globalAlpha = 1;
        } catch (error) {
          console.warn('⚠️ Failed to draw layer:', layer.name, error);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  }
}
