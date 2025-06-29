
import { pipeline, env } from '@huggingface/transformers';
import type { CRDLayer, DetectedRegion, FontAnalysis } from '@/types/crdmkr';

// Configure transformers.js for browser usage
env.allowLocalModels = false;
env.useBrowserCache = true;

interface AnalysisResult {
  regions: DetectedRegion[];
  colorPalette: string[];
  typography: FontAnalysis[];
  confidence: number;
}

interface MLModels {
  objectDetector?: any;
  segmenter?: any;
  textDetector?: any;
}

export class AIAnalyzer {
  private models: MLModels = {};
  private modelCache = new Map<string, any>();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🤖 Initializing AI Analyzer...');
    
    try {
      // Load models on-demand
      await this.loadEssentialModels();
      this.isInitialized = true;
      console.log('✅ AI Analyzer initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AI Analyzer:', error);
      throw error;
    }
  }

  private async loadEssentialModels() {
    try {
      // Load object detection model for card region detection
      if (!this.models.objectDetector) {
        console.log('📦 Loading object detection model...');
        this.models.objectDetector = await pipeline(
          'object-detection',
          'Xenova/detr-resnet-50',
          { device: 'webgpu' }
        );
      }

      // Load segmentation model for precise boundaries
      if (!this.models.segmenter) {
        console.log('📦 Loading segmentation model...');
        this.models.segmenter = await pipeline(
          'image-segmentation',
          'Xenova/segformer-b0-finetuned-ade-512-512',
          { device: 'webgpu' }
        );
      }
    } catch (error) {
      console.warn('⚠️ WebGPU not available, falling back to CPU');
      // Fallback to CPU if WebGPU fails
      this.models.objectDetector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50'
      );
    }
  }

  async analyzeImage(imageElement: HTMLImageElement): Promise<AnalysisResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log('🔍 Starting AI analysis...');
    
    try {
      const [regions, colorPalette, typography] = await Promise.all([
        this.detectRegions(imageElement),
        this.extractColorPalette(imageElement),
        this.analyzeTypography(imageElement)
      ]);

      const confidence = this.calculateOverallConfidence(regions);

      return {
        regions,
        colorPalette,
        typography,
        confidence
      };
    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      throw error;
    }
  }

  private async detectRegions(imageElement: HTMLImageElement): Promise<DetectedRegion[]> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;
      ctx.drawImage(imageElement, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Use object detection model
      const detections = await this.models.objectDetector(imageData);
      
      const regions: DetectedRegion[] = [];
      
      for (const detection of detections) {
        const { box, label, score } = detection;
        
        // Convert normalized coordinates to pixel coordinates
        const x = box.xmin * canvas.width;
        const y = box.ymin * canvas.height;
        const width = (box.xmax - box.xmin) * canvas.width;
        const height = (box.ymax - box.ymin) * canvas.height;
        
        // Map detection labels to card regions
        const regionType = this.mapLabelToRegionType(label);
        
        if (regionType && score > 0.3) {
          regions.push({
            id: `ai-${Date.now()}-${Math.random()}`,
            type: regionType,
            bounds: { x, y, width, height },
            confidence: score,
            layerIds: []
          });
        }
      }
      
      return regions;
    } catch (error) {
      console.error('Region detection failed:', error);
      return [];
    }
  }

  private mapLabelToRegionType(label: string): DetectedRegion['type'] | null {
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
    if (lowerLabel.includes('frame') || lowerLabel.includes('border')) {
      return 'border';
    }
    
    return 'decoration';
  }

  private async extractColorPalette(imageElement: HTMLImageElement): Promise<string[]> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Scale down for faster processing
      const maxSize = 200;
      const scale = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight);
      
      canvas.width = imageElement.naturalWidth * scale;
      canvas.height = imageElement.naturalHeight * scale;
      
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use k-means clustering to extract dominant colors
      const colors = this.kMeansColorClustering(imageData.data, 8);
      
      return colors.map(color => 
        `#${color.map(c => Math.round(c).toString(16).padStart(2, '0')).join('')}`
      );
    } catch (error) {
      console.error('Color extraction failed:', error);
      return [];
    }
  }

  private kMeansColorClustering(imageData: Uint8ClampedArray, k: number): number[][] {
    const pixels: number[][] = [];
    
    // Sample pixels (skip alpha channel)
    for (let i = 0; i < imageData.length; i += 16) { // Sample every 4th pixel
      pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
    }
    
    // Initialize centroids randomly
    const centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }
    
    // K-means iterations
    for (let iter = 0; iter < 10; iter++) {
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

  private async analyzeTypography(imageElement: HTMLImageElement): Promise<FontAnalysis[]> {
    // For now, return basic typography analysis
    // This would be enhanced with OCR and font detection
    return [
      {
        family: 'Arial',
        size: 16,
        weight: 'bold',
        color: '#000000',
        usage: 'title'
      },
      {
        family: 'Arial',
        size: 12,
        weight: 'normal',
        color: '#333333',
        usage: 'body'
      }
    ];
  }

  private calculateOverallConfidence(regions: DetectedRegion[]): number {
    if (regions.length === 0) return 0;
    
    const avgConfidence = regions.reduce((sum, region) => sum + region.confidence, 0) / regions.length;
    const regionCount = regions.length;
    
    // Boost confidence based on number of detected regions
    const regionBonus = Math.min(regionCount / 5, 0.3);
    
    return Math.min(avgConfidence + regionBonus, 1.0);
  }

  async dispose() {
    this.models = {};
    this.modelCache.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const aiAnalyzer = new AIAnalyzer();
