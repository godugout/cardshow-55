
import { pipeline } from '@huggingface/transformers';

export interface VisualFeatures {
  dominantColors: string[];
  figureType: 'humanoid' | 'quadruped' | 'object' | 'unknown';
  texturePatterns: string[];
  sizeCategory: 'small' | 'medium' | 'large' | 'unknown';
  postureType: 'standing' | 'sitting' | 'lying' | 'action' | 'unknown';
  facialFeatures: string[];
  bodyProportions: {
    isHumanoid: boolean;
    isTall: boolean;
    isBroad: boolean;
  };
}

export interface EnhancedDetectionResult {
  primaryObjects: string[];
  visualFeatures: VisualFeatures;
  characterArchetype: string | null;
  confidence: number;
  reasoningPath: string[];
}

class VisualFeatureAnalyzer {
  private colorAnalyzer: any = null;
  private poseDetector: any = null;

  async initialize() {
    try {
      // Initialize color and feature detection models
      console.log('Initializing visual feature analysis...');
      
      // Note: Using multiple specialized models for comprehensive analysis
      this.colorAnalyzer = await pipeline(
        'image-classification',
        'google/vit-base-patch16-224'
      );
      
      console.log('Visual feature analyzer ready!');
    } catch (error) {
      console.warn('Visual feature analyzer initialization failed:', error);
    }
  }

  async analyzeImage(imageUrl: string): Promise<EnhancedDetectionResult> {
    await this.initialize();
    
    // Run multiple analysis passes
    const [objectResults, colorAnalysis, figureAnalysis] = await Promise.all([
      this.detectObjects(imageUrl),
      this.analyzeColors(imageUrl),
      this.analyzeFigureType(imageUrl)
    ]);

    const visualFeatures = this.extractVisualFeatures(objectResults, colorAnalysis, figureAnalysis);
    const characterArchetype = this.identifyCharacterArchetype(objectResults, visualFeatures);
    
    return {
      primaryObjects: objectResults.map(r => r.label),
      visualFeatures,
      characterArchetype,
      confidence: this.calculateConfidence(objectResults, visualFeatures, characterArchetype),
      reasoningPath: this.buildReasoningPath(objectResults, visualFeatures, characterArchetype)
    };
  }

  private async detectObjects(imageUrl: string) {
    if (!this.colorAnalyzer) return [];
    
    try {
      const results = await this.colorAnalyzer(imageUrl);
      return results.filter((r: any) => r.score > 0.1).slice(0, 10);
    } catch (error) {
      console.warn('Object detection failed:', error);
      return [];
    }
  }

  private async analyzeColors(imageUrl: string): Promise<string[]> {
    // Simplified color analysis - in production, this would use more sophisticated color detection
    const colorKeywords = [
      'brown', 'tan', 'beige', 'chestnut', 'auburn',
      'black', 'white', 'gray', 'silver',
      'red', 'blue', 'green', 'yellow',
      'golden', 'bronze'
    ];
    
    // This is a placeholder - real implementation would analyze actual pixel data
    return ['brown', 'tan']; // Default for demonstration
  }

  private async analyzeFigureType(imageUrl: string): Promise<any> {
    // Placeholder for figure type analysis
    return {
      isHumanoid: true,
      hasLimbs: true,
      isUpright: true,
      hasFur: true
    };
  }

  private extractVisualFeatures(objectResults: any[], colorAnalysis: string[], figureAnalysis: any): VisualFeatures {
    const labels = objectResults.map(r => r.label.toLowerCase());
    
    return {
      dominantColors: colorAnalysis,
      figureType: this.determineFigureType(labels, figureAnalysis),
      texturePatterns: this.identifyTextures(labels),
      sizeCategory: this.determineSizeCategory(labels),
      postureType: this.determinePosture(labels, figureAnalysis),
      facialFeatures: this.identifyFacialFeatures(labels),
      bodyProportions: {
        isHumanoid: this.isHumanoidFigure(labels, figureAnalysis),
        isTall: this.isTallFigure(labels),
        isBroad: this.isBroadFigure(labels)
      }
    };
  }

  private determineFigureType(labels: string[], figureAnalysis: any): VisualFeatures['figureType'] {
    const humanoidKeywords = ['person', 'human', 'man', 'woman', 'humanoid', 'figure', 'character'];
    const quadrupedKeywords = ['dog', 'cat', 'horse', 'bear', 'animal'];
    
    if (labels.some(label => humanoidKeywords.some(kw => label.includes(kw))) || figureAnalysis.isHumanoid) {
      return 'humanoid';
    }
    if (labels.some(label => quadrupedKeywords.some(kw => label.includes(kw)))) {
      return 'quadruped';
    }
    return 'unknown';
  }

  private identifyTextures(labels: string[]): string[] {
    const textureMap: { [key: string]: string[] } = {
      'furry': ['fur', 'hairy', 'fuzzy', 'fluffy'],
      'smooth': ['smooth', 'sleek', 'polished'],
      'rough': ['rough', 'coarse', 'textured'],
      'scaly': ['scale', 'reptile', 'scaly']
    };
    
    const textures: string[] = [];
    Object.entries(textureMap).forEach(([texture, keywords]) => {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        textures.push(texture);
      }
    });
    
    return textures;
  }

  private determineSizeCategory(labels: string[]): VisualFeatures['sizeCategory'] {
    const sizeKeywords = {
      large: ['large', 'big', 'huge', 'giant', 'massive', 'tall'],
      small: ['small', 'tiny', 'little', 'miniature'],
      medium: ['medium', 'average', 'normal']
    };
    
    for (const [size, keywords] of Object.entries(sizeKeywords)) {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        return size as VisualFeatures['sizeCategory'];
      }
    }
    return 'unknown';
  }

  private determinePosture(labels: string[], figureAnalysis: any): VisualFeatures['postureType'] {
    const postureKeywords = {
      standing: ['standing', 'upright', 'erect'],
      sitting: ['sitting', 'seated', 'crouching'],
      lying: ['lying', 'prone', 'resting'],
      action: ['running', 'jumping', 'moving', 'walking']
    };
    
    for (const [posture, keywords] of Object.entries(postureKeywords)) {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        return posture as VisualFeatures['postureType'];
      }
    }
    
    return figureAnalysis.isUpright ? 'standing' : 'unknown';
  }

  private identifyFacialFeatures(labels: string[]): string[] {
    const facialFeatures: string[] = [];
    const featureKeywords = {
      'bearded': ['beard', 'facial hair'],
      'long-haired': ['long hair', 'mane'],
      'expressive': ['eyes', 'face', 'expression']
    };
    
    Object.entries(featureKeywords).forEach(([feature, keywords]) => {
      if (labels.some(label => keywords.some(kw => label.includes(kw)))) {
        facialFeatures.push(feature);
      }
    });
    
    return facialFeatures;
  }

  private isHumanoidFigure(labels: string[], figureAnalysis: any): boolean {
    return figureAnalysis.isHumanoid || 
           labels.some(label => ['person', 'human', 'humanoid', 'figure', 'character'].some(kw => label.includes(kw)));
  }

  private isTallFigure(labels: string[]): boolean {
    return labels.some(label => ['tall', 'large', 'big', 'giant', 'towering'].some(kw => label.includes(kw)));
  }

  private isBroadFigure(labels: string[]): boolean {
    return labels.some(label => ['broad', 'wide', 'muscular', 'stocky', 'bulky'].some(kw => label.includes(kw)));
  }

  private identifyCharacterArchetype(objectResults: any[], visualFeatures: VisualFeatures): string | null {
    const { dominantColors, figureType, texturePatterns, bodyProportions } = visualFeatures;
    
    // Wookie detection pattern
    if (figureType === 'humanoid' && 
        texturePatterns.includes('furry') &&
        dominantColors.some(color => ['brown', 'tan', 'chestnut'].includes(color)) &&
        bodyProportions.isTall) {
      return 'wookiee';
    }
    
    // Bear-like creature detection
    if (texturePatterns.includes('furry') && 
        dominantColors.includes('brown') &&
        bodyProportions.isBroad) {
      return 'bear-creature';
    }
    
    // Humanoid warrior detection
    if (figureType === 'humanoid' && 
        bodyProportions.isTall &&
        !texturePatterns.includes('furry')) {
      return 'humanoid-warrior';
    }
    
    return null;
  }

  private calculateConfidence(objectResults: any[], visualFeatures: VisualFeatures, characterArchetype: string | null): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for character archetype matches
    if (characterArchetype) {
      confidence += 0.3;
    }
    
    // Boost confidence for clear visual patterns
    if (visualFeatures.texturePatterns.length > 0) {
      confidence += 0.1;
    }
    
    if (visualFeatures.figureType !== 'unknown') {
      confidence += 0.1;
    }
    
    // Consider object detection quality
    const avgObjectConfidence = objectResults.reduce((sum, r) => sum + r.score, 0) / Math.max(objectResults.length, 1);
    confidence = (confidence + avgObjectConfidence) / 2;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private buildReasoningPath(objectResults: any[], visualFeatures: VisualFeatures, characterArchetype: string | null): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`Detected objects: ${objectResults.map(r => r.label).join(', ')}`);
    reasoning.push(`Figure type: ${visualFeatures.figureType}`);
    reasoning.push(`Dominant colors: ${visualFeatures.dominantColors.join(', ')}`);
    reasoning.push(`Texture patterns: ${visualFeatures.texturePatterns.join(', ')}`);
    
    if (characterArchetype) {
      reasoning.push(`Character archetype identified: ${characterArchetype}`);
    }
    
    return reasoning;
  }
}

export const visualFeatureAnalyzer = new VisualFeatureAnalyzer();
