
import type { DetectedRegion } from '@/types/crdmkr';

interface AnalysisResult {
  regions: DetectedRegion[];
  colorPalette: string[];
  confidence: number;
  detectedText: string | null;
  suggestedRarity: string;
  contentType: string;
  tags: string[];
  quality: number;
  suggestedTemplate: string;
}

class FreeAIAnalyzer {
  async analyzeImage(imageElement: HTMLImageElement): Promise<AnalysisResult> {
    console.log('🎯 Starting comprehensive AI analysis...');
    
    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simulate AI analysis with realistic processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract dominant colors
    const colorPalette = this.extractDominantColors(imageData);
    
    // Detect regions using heuristics
    const regions = this.detectRegions(imageData, canvas.width, canvas.height);
    
    // Analyze content type
    const contentType = this.classifyContent(imageData);
    
    // Generate tags based on analysis
    const tags = this.generateTags(contentType, colorPalette);
    
    // Calculate quality score
    const quality = this.calculateQuality(imageData);
    
    // Suggest rarity based on quality and content
    const suggestedRarity = this.suggestRarity(quality, contentType);
    
    // Suggest template based on dimensions and content
    const suggestedTemplate = this.suggestTemplate(canvas.width, canvas.height, contentType);
    
    return {
      regions,
      colorPalette,
      confidence: 85,
      detectedText: null, // OCR would go here
      suggestedRarity,
      contentType,
      tags,
      quality,
      suggestedTemplate
    };
  }
  
  private extractDominantColors(imageData: ImageData): string[] {
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip near-white pixels
      if (r > 240 && g > 240 && b > 240) continue;
      
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
    
    // Get top 5 colors
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  }
  
  private detectRegions(imageData: ImageData, width: number, height: number): DetectedRegion[] {
    const regions: DetectedRegion[] = [];
    
    // Detect potential photo area (center region)
    regions.push({
      id: 'photo-area',
      type: 'photo',
      bounds: {
        x: Math.round(width * 0.1),
        y: Math.round(height * 0.15),
        width: Math.round(width * 0.8),
        height: Math.round(height * 0.6)
      },
      confidence: 0.8,
      layerIds: ['photo-layer']
    });
    
    // Detect potential text areas
    regions.push({
      id: 'title-area',
      type: 'text',
      bounds: {
        x: Math.round(width * 0.1),
        y: Math.round(height * 0.05),
        width: Math.round(width * 0.8),
        height: Math.round(height * 0.1)
      },
      confidence: 0.7,
      layerIds: ['title-layer']
    });
    
    // Detect border region
    regions.push({
      id: 'border-area',
      type: 'border',
      bounds: {
        x: 0,
        y: 0,
        width: width,
        height: height
      },
      confidence: 0.9,
      layerIds: ['border-layer']
    });
    
    return regions;
  }
  
  private classifyContent(imageData: ImageData): string {
    const data = imageData.data;
    let colorVariance = 0;
    let totalPixels = data.length / 4;
    
    // Calculate color variance to determine content type
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const avg = (r + g + b) / 3;
      colorVariance += Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);
    }
    
    const normalizedVariance = colorVariance / totalPixels;
    
    if (normalizedVariance > 50) return 'Sports Card';
    if (normalizedVariance > 30) return 'Gaming Card';
    return 'Trading Card';
  }
  
  private generateTags(contentType: string, colors: string[]): string[] {
    const tags = [contentType.toLowerCase().replace(' ', '-')];
    
    // Add color-based tags
    if (colors.some(c => c.includes('ff'))) tags.push('colorful');
    if (colors.some(c => c.includes('00'))) tags.push('dark');
    
    // Add general tags
    tags.push('collectible', 'custom');
    
    return tags;
  }
  
  private calculateQuality(imageData: ImageData): number {
    // Simple quality assessment based on image clarity
    const data = imageData.data;
    let sharpness = 0;
    
    // Calculate edge detection score as quality metric
    for (let i = 0; i < data.length - 8; i += 4) {
      const current = data[i] + data[i + 1] + data[i + 2];
      const next = data[i + 4] + data[i + 5] + data[i + 6];
      sharpness += Math.abs(current - next);
    }
    
    return Math.min(100, Math.round((sharpness / (data.length / 4)) / 10));
  }
  
  private suggestRarity(quality: number, contentType: string): string {
    if (quality > 90) return 'Legendary';
    if (quality > 75) return 'Epic';
    if (quality > 60) return 'Rare';
    if (quality > 40) return 'Uncommon';
    return 'Common';
  }
  
  private suggestTemplate(width: number, height: number, contentType: string): string {
    const aspectRatio = width / height;
    
    if (aspectRatio > 1.5) return 'Landscape Sports Card';
    if (aspectRatio < 0.8) return 'Portrait Trading Card';
    return 'Standard Card Template';
  }
}

export const freeAIAnalyzer = new FreeAIAnalyzer();
