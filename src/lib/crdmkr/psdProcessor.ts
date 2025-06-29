
import PSD from 'psd';

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
      // Read the PSD file
      const arrayBuffer = await file.arrayBuffer();
      const psd = PSD.fromDroppedFile({ 
        buffer: arrayBuffer,
        name: file.name 
      });
      
      psd.parse();
      
      const layers: PSDLayer[] = [];
      const canvas = document.createElement('canvas');
      canvas.width = psd.tree().width;
      canvas.height = psd.tree().height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Process each layer
      await this.processLayers(psd.tree(), layers, ctx);
      
      // Generate preview
      const previewUrl = canvas.toDataURL('image/png');
      
      return {
        layers,
        dimensions: {
          width: psd.tree().width,
          height: psd.tree().height
        },
        previewUrl,
        originalFile: file
      };
    } catch (error) {
      console.error('❌ Error processing PSD:', error);
      throw new Error(`Failed to process PSD file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private static async processLayers(
    node: any, 
    layers: PSDLayer[], 
    ctx: CanvasRenderingContext2D,
    parentBounds?: { x: number; y: number }
  ): Promise<void> {
    const offsetX = parentBounds?.x || 0;
    const offsetY = parentBounds?.y || 0;
    
    if (node.type === 'layer' && node.layer) {
      const layer = node.layer;
      
      // Determine if this might be a photo layer
      const isPhotoLayer = this.isLikelyPhotoLayer(layer);
      
      // Extract layer as PNG
      let imageUrl: string | undefined;
      try {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = layer.width;
        layerCanvas.height = layer.height;
        const layerCtx = layerCanvas.getContext('2d');
        
        if (layerCtx && layer.image) {
          const imageData = layerCtx.createImageData(layer.width, layer.height);
          const pixelData = layer.image.pixelData;
          
          // Convert PSD pixel data to ImageData
          for (let i = 0; i < pixelData.length; i += 4) {
            imageData.data[i] = pixelData[i + 2];     // R
            imageData.data[i + 1] = pixelData[i + 1]; // G
            imageData.data[i + 2] = pixelData[i];     // B
            imageData.data[i + 3] = pixelData[i + 3]; // A
          }
          
          layerCtx.putImageData(imageData, 0, 0);
          imageUrl = layerCanvas.toDataURL('image/png');
          
          // Draw to composite canvas if layer is visible
          if (layer.visible) {
            ctx.globalAlpha = layer.opacity / 255;
            ctx.drawImage(layerCanvas, offsetX + layer.left, offsetY + layer.top);
            ctx.globalAlpha = 1;
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to extract layer image:', layer.name, error);
      }
      
      const psdLayer: PSDLayer = {
        id: `layer_${layers.length}`,
        name: layer.name || `Layer ${layers.length + 1}`,
        type: this.getLayerType(layer),
        bounds: {
          x: offsetX + layer.left,
          y: offsetY + layer.top,
          width: layer.width,
          height: layer.height
        },
        visible: layer.visible,
        opacity: layer.opacity / 255,
        blendMode: layer.blendMode?.mode || 'normal',
        isPhotoLayer,
        imageUrl,
        textContent: layer.text?.textData?.text
      };
      
      layers.push(psdLayer);
    }
    
    // Process child layers
    if (node.children) {
      for (const child of node.children) {
        await this.processLayers(child, layers, ctx, {
          x: offsetX + (node.left || 0),
          y: offsetY + (node.top || 0)
        });
      }
    }
  }
  
  private static isLikelyPhotoLayer(layer: any): boolean {
    const name = (layer.name || '').toLowerCase();
    const photoKeywords = ['photo', 'image', 'picture', 'player', 'portrait', 'face'];
    
    // Check if layer name contains photo-related keywords
    if (photoKeywords.some(keyword => name.includes(keyword))) {
      return true;
    }
    
    // Check if it's a large image layer (likely main photo)
    if (layer.width > 200 && layer.height > 200) {
      return true;
    }
    
    return false;
  }
  
  private static getLayerType(layer: any): 'image' | 'text' | 'shape' | 'group' {
    if (layer.text) return 'text';
    if (layer.image) return 'image';
    return 'shape';
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
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw each visible layer
    for (const layer of layers) {
      if (visibleLayers.has(layer.id) && layer.imageUrl) {
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
