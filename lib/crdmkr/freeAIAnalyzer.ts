
import { pipeline, env } from '@huggingface/transformers';
import type { DetectedRegion, FontAnalysis } from '@/types/crdmkr';

// Configure transformers.js for browser usage
env.allowLocalModels = false;
env.useBrowserCache = true;

interface FreeAnalysisResult {
  regions: DetectedRegion[];
  colorPalette: string[];
  typography: FontAnalysis[];
  confidence: number;
  detectedText: string | null;
  suggestedRarity: string;
  contentType: string;
  tags: string[];
  quality: number;
  suggestedTemplate: string;
}

export class FreeAIAnalyzer {
  private models: any = {};
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🤖 Initializing Free AI Analyzer...');
    
    try {
      // Load models on-demand for better performance
      this.isInitialized = true;
      console.log('✅ Free AI Analyzer ready');
    } catch (error) {
      console.error('❌ Failed to initialize Free AI Analyzer:', error);
      throw error;
    }
  }

  async analyzeImage(imageElement: HTMLImageElement): Promise<FreeAnalysisResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log('🔍 Starting free AI analysis...');
    
    try {
      const [
        detectedText,
        colorPalette,
        classification,
        regions
      ] = await Promise.all([
        this.extractText(imageElement),
        this.extractColorPalette(imageElement),
        this.classifyImage(imageElement),
        this.detectRegions(imageElement)
      ]);

      const analysis = this.synthesizeResults({
        detectedText,
        colorPalette,
        classification,
        regions
      });

      return analysis;
    } catch (error) {
      console.error('❌ Free AI analysis failed:', error);
      throw error;
    }
  }

  private async extractText(imageElement: HTMLImageElement): Promise<string | null> {
    try {
      console.log('📝 Extracting text with OCR...');
      
      // Load OCR model
      if (!this.models.ocr) {
        this.models.ocr = await pipeline(
          'image-to-text',
          'microsoft/trocr-base-printed'
        );
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const result = await this.models.ocr(imageData);
      
      const extractedText = result?.[0]?.generated_text || null;
      console.log('📝 Extracted text:', extractedText);
      
      return extractedText;
    } catch (error) {
      console.warn('OCR failed:', error);
      return null;
    }
  }

  private async classifyImage(imageElement: HTMLImageElement): Promise<any> {
    try {
      console.log('🏷️ Classifying image...');
      
      // Load image classification model
      if (!this.models.classifier) {
        this.models.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224'
        );
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const results = await this.models.classifier(imageData);
      
      console.log('🏷️ Classification results:', results);
      return results;
    } catch (error) {
      console.warn('Classification failed:', error);
      return [];
    }
  }

  private async detectRegions(imageElement: HTMLImageElement): Promise<DetectedRegion[]> {
    try {
      console.log('🎯 Detecting regions...');
      
      // Load object detection model
      if (!this.models.detector) {
        this.models.detector = await pipeline(
          'object-detection',
          'facebook/detr-resnet-50'
        );
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      const detections = await this.models.detector(imageData);
      
      const regions: DetectedRegion[] = detections.map((detection: any, index: number) => ({
        id: `free-ai-${Date.now()}-${index}`,
        type: this.mapLabelToRegionType(detection.label),
        bounds: {
          x: detection.box.xmin * canvas.width,
          y: detection.box.ymin * canvas.height,
          width: (detection.box.xmax - detection.box.xmin) * canvas.width,
          height: (detection.box.ymax - detection.box.ymin) * canvas.height
        },
        confidence: detection.score,
        layerIds: []
      }));
      
      console.log('🎯 Detected regions:', regions);
      return regions;
    } catch (error) {
      console.warn('Region detection failed:', error);
      return [];
    }
  }

  private mapLabelToRegionType(label: string): DetectedRegion['type'] {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('person') || lowerLabel.includes('face')) {
      return 'photo';
    }
    if (lowerLabel.includes('text') || lowerLabel.includes('book')) {
      return 'text';
    }
    if (lowerLabel.includes('logo') || lowerLabel.includes('sign')) {
      return 'logo';
    }
    
    return 'decoration';
  }

  private extractColorPalette(imageElement: HTMLImageElement): string[] {
    try {
      console.log('🎨 Extracting color palette...');
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Scale down for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight);
      
      canvas.width = imageElement.naturalWidth * scale;
      canvas.height = imageElement.naturalHeight * scale;
      
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use k-means clustering to extract dominant colors
      const colors = this.kMeansColorClustering(imageData.data, 6);
      const hexColors = colors.map(color => 
        `#${color.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
      );
      
      console.log('🎨 Extracted colors:', hexColors);
      return hexColors;
    } catch (error) {
      console.warn('Color extraction failed:', error);
      return ['#FF6B6B', '#4ECDC4', '#45B7D1']; // Fallback colors
    }
  }

  private kMeansColorClustering(imageData: Uint8ClampedArray, k: number): number[][] {
    const pixels: number[][] = [];
    
    // Sample pixels (skip alpha channel)
    for (let i = 0; i < imageData.length; i += 16) {
      pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
    }
    
    // Initialize centroids randomly
    const centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }
    
    // K-means iterations
    for (let iter = 0; iter < 5; iter++) {
      const clusters: number[][][] = Array(k).fill(null).map(() => []);
      
      // Assign pixels to nearest centroid
      for (const pixel of pixels) {
        let minDistance = Infinity;
        let nearestCentroid = 0;
        
        for (let i = 0; i < k; i++) {
          const distance = Math.sqrt(
            Math.pow(pixel[0] - centroids[i][0], 2) +
            Math.pow(pixel[1] - centroids[i][1], 2) +
            Math.pow(pixel[2] - centroids[i][2], 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestCentroid = i;
          }
        }
        
        clusters[nearestCentroid].push(pixel);
      }
      
      // Update centroids
      for (let i = 0; i < k; i++) {
        if (clusters[i].length > 0) {
          centroids[i] = [
            clusters[i].reduce((sum, p) => sum + p[0], 0) / clusters[i].length,
            clusters[i].reduce((sum, p) => sum + p[1], 0) / clusters[i].length,
            clusters[i].reduce((sum, p) => sum + p[2], 0) / clusters[i].length
          ];
        }
      }
    }
    
    return centroids;
  }

  private synthesizeResults(data: any): FreeAnalysisResult {
    const { detectedText, colorPalette, classification, regions } = data;
    
    // Analyze classification results to determine card type
    const cardKeywords = ['card', 'baseball', 'basketball', 'football', 'hockey', 'sport'];
    const isLikelyCard = classification.some((result: any) => 
      cardKeywords.some(keyword => result.label.toLowerCase().includes(keyword))
    );
    
    // Determine rarity based on visual complexity and colors
    const rarityScore = (colorPalette.length * 0.3) + (regions.length * 0.2) + 
                       (detectedText ? 0.3 : 0) + (isLikelyCard ? 0.2 : 0);
    
    let suggestedRarity = 'Common';
    if (rarityScore > 0.8) suggestedRarity = 'Legendary';
    else if (rarityScore > 0.6) suggestedRarity = 'Rare';
    else if (rarityScore > 0.4) suggestedRarity = 'Uncommon';
    
    // Generate tags based on detected content
    const tags = [];
    if (isLikelyCard) tags.push('trading-card');
    if (detectedText) tags.push('text-heavy');
    if (regions.some(r => r.type === 'photo')) tags.push('portrait');
    if (colorPalette.length > 4) tags.push('colorful');
    
    // Determine content type
    let contentType = 'unknown';
    if (isLikelyCard) contentType = 'trading-card';
    else if (regions.some(r => r.type === 'photo')) contentType = 'photo';
    
    // Calculate overall confidence
    const confidence = Math.min(
      (regions.length > 0 ? 0.4 : 0) +
      (detectedText ? 0.3 : 0) +
      (isLikelyCard ? 0.3 : 0),
      1.0
    ) * 100;
    
    return {
      regions,
      colorPalette,
      typography: [], // Not implemented yet
      confidence,
      detectedText,
      suggestedRarity,
      contentType,
      tags,
      quality: Math.round(confidence * 0.8 + 20), // Quality score 20-100
      suggestedTemplate: isLikelyCard ? 'sports-card-pro' : 'photo-frame'
    };
  }

  async dispose() {
    this.models = {};
    this.isInitialized = false;
  }
}

// Singleton instance
export const freeAIAnalyzer = new FreeAIAnalyzer();
