
// Browser-compatible media path analyzer
export interface MediaAnalysisResult {
  format: string;
  capabilities: string[];
  recommendedPath: string;
  confidence: number;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export class MediaPathAnalyzer {
  static async analyzeFile(file: File): Promise<MediaAnalysisResult> {
    console.log('🔍 Analyzing media file:', file.name, 'Type:', file.type);
    
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    const fileSize = file.size;
    
    // Determine format based on file extension and MIME type
    let format = 'Unknown';
    let capabilities: string[] = [];
    let recommendedPath = 'standard-card';
    let confidence = 0.8;
    
    if (fileName.endsWith('.psd') || fileType.includes('photoshop')) {
      format = 'PSD (Photoshop Document)';
      capabilities = ['Layer extraction', 'Advanced editing', 'Professional workflow'];
      recommendedPath = 'psd-professional';
      confidence = 0.95;
    } else if (fileName.endsWith('.gif') || fileType.includes('gif')) {
      format = 'GIF (Graphics Interchange Format)';
      capabilities = ['Animation support', 'Frame extraction', 'Interactive effects'];
      recommendedPath = 'gif-animated';
      confidence = 0.9;
    } else if (fileType.includes('image/png') || fileName.endsWith('.png')) {
      format = 'PNG (Portable Network Graphics)';
      capabilities = ['Transparency support', 'High quality', 'Lossless compression'];
      recommendedPath = 'standard-card';
      confidence = 0.85;
    } else if (fileType.includes('image/jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      format = 'JPEG (Joint Photographic Experts Group)';
      capabilities = ['Photo optimization', 'Compact size', 'Wide compatibility'];
      recommendedPath = 'standard-card';
      confidence = 0.85;
    } else if (fileType.includes('image/webp') || fileName.endsWith('.webp')) {
      format = 'WebP (Modern Image Format)';
      capabilities = ['Advanced compression', 'Animation support', 'Modern format'];
      recommendedPath = 'standard-card';
      confidence = 0.8;
    } else if (fileType.includes('image/svg') || fileName.endsWith('.svg')) {
      format = 'SVG (Scalable Vector Graphics)';
      capabilities = ['Vector graphics', 'Scalable', 'Small file size'];
      recommendedPath = 'standard-card';
      confidence = 0.9;
    }
    
    // Try to get image dimensions if possible
    let dimensions: { width: number; height: number } | undefined;
    
    if (fileType.startsWith('image/')) {
      try {
        dimensions = await this.getImageDimensions(file);
      } catch (error) {
        console.warn('Could not get image dimensions:', error);
      }
    }
    
    return {
      format,
      capabilities,
      recommendedPath,
      confidence,
      fileSize,
      dimensions
    };
  }
  
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }
}
