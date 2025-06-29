
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
      // Create a URL for the file to use as image source
      const imageUrl = URL.createObjectURL(file);
      
      // Create image element and load the file
      const img = await this.loadImageFromFile(imageUrl);
      
      // Get dimensions from the loaded image
      const width = img.naturalWidth || 400;
      const height = img.naturalHeight || 600;
      
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw the image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Generate composite image URL
      const previewUrl = canvas.toDataURL('image/png');
      
      // Create mock layers based on common card design patterns
      const layers: PSDLayer[] = [
        {
          id: 'background',
          name: 'Background',
          type: 'shape',
          bounds: { x: 0, y: 0, width, height },
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          isPhotoLayer: false,
          imageUrl: previewUrl
        },
        {
          id: 'photo-area',
          name: 'Photo Area',
          type: 'image',
          bounds: { 
            x: Math.round(width * 0.1), 
            y: Math.round(height * 0.1), 
            width: Math.round(width * 0.8), 
            height: Math.round(height * 0.6) 
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
          bounds: { x: 0, y: 0, width, height },
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          isPhotoLayer: false,
          imageUrl: previewUrl
        }
      ];
      
      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);
      
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
  
  private static loadImageFromFile(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(new Error('Failed to load image'));
      img.src = url;
    });
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
          const img = await this.loadImageFromFile(layer.imageUrl);
          
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
