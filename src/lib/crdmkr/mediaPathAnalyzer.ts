
interface MediaDetectionResult {
  format: string;
  isPSD: boolean;
  isAnimated: boolean;
  hasLayers: boolean;
  dimensions: { width: number; height: number } | null;
  recommendedPath: string;
  confidence: number;
}

export class MediaPathAnalyzer {
  static async analyzeFile(file: File): Promise<MediaDetectionResult> {
    console.log('🔍 Analyzing media file:', file.name, file.type);
    
    const format = this.detectFormat(file);
    const isPSD = format.includes('PSD');
    const isAnimated = this.isAnimatedFile(file);
    const hasLayers = isPSD; // Could be enhanced to detect other layered formats
    
    let dimensions = null;
    try {
      dimensions = await this.getDimensions(file);
    } catch (error) {
      console.warn('Failed to get dimensions:', error);
    }
    
    const recommendedPath = this.getRecommendedPath(format, file);
    
    return {
      format,
      isPSD,
      isAnimated,
      hasLayers,
      dimensions,
      recommendedPath,
      confidence: 0.9
    };
  }
  
  private static detectFormat(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.includes('photoshop') || extension === 'psd') {
      return 'Adobe Photoshop (PSD)';
    }
    
    if (mimeType.includes('gif') || extension === 'gif') {
      return 'Animated GIF';
    }
    
    if (mimeType.includes('png') || extension === 'png') {
      return 'PNG Image';
    }
    
    if (mimeType.includes('jpeg') || mimeType.includes('jpg') || extension === 'jpg' || extension === 'jpeg') {
      return 'JPEG Image';
    }
    
    if (mimeType.includes('webp') || extension === 'webp') {
      return 'WebP Image';
    }
    
    return 'Unknown Format';
  }
  
  private static isAnimatedFile(file: File): boolean {
    return file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif');
  }
  
  private static async getDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  
  private static getRecommendedPath(format: string, file: File): string {
    if (format.includes('PSD')) {
      return file.size > 50 * 1024 * 1024 ? 'psd-professional' : 'psd-simple'; // 50MB threshold
    }
    
    if (format.includes('GIF')) {
      return 'gif-animated';
    }
    
    // For standard images, recommend based on size and likely use case
    if (file.size > 5 * 1024 * 1024) { // 5MB threshold
      return 'interactive-card';
    }
    
    return 'standard-card';
  }
}
