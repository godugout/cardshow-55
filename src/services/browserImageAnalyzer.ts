
import { pipeline } from '@huggingface/transformers';

// Configure transformers.js for browser use
import { env } from '@huggingface/transformers';
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ImageAnalysisResult {
  objects: string[];
  confidence: number;
  analysisType: 'browser' | 'fallback';
}

// Creative mapping from detected objects to card concepts
const objectToCardConcept = (objects: string[]): {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
} => {
  const concepts: { [key: string]: any } = {
    'pig': {
      title: 'Barnyard Champion',
      description: 'A mighty farm hero with incredible strength and determination, ruling the barnyard with wisdom and courage.',
      rarity: 'uncommon',
      tags: ['farm', 'animal', 'champion', 'barnyard']
    },
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities, guardian of hidden secrets.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom']
    },
    'dog': {
      title: 'Loyal Guardian',
      description: 'A faithful companion with unwavering loyalty and protective instincts, defender of the innocent.',
      rarity: 'uncommon',
      tags: ['canine', 'guardian', 'loyal', 'protector']
    },
    'bird': {
      title: 'Sky Messenger',
      description: 'A swift aerial scout with keen eyesight and the ability to traverse great distances.',
      rarity: 'common',
      tags: ['avian', 'messenger', 'flight', 'scout']
    },
    'car': {
      title: 'Speed Demon',
      description: 'A powerful machine built for velocity and performance, dominating roads with style.',
      rarity: 'rare',
      tags: ['vehicle', 'speed', 'machine', 'performance']
    },
    'person': {
      title: 'Urban Legend',
      description: 'A mysterious figure with untold stories and hidden talents, walking with quiet confidence.',
      rarity: 'uncommon',
      tags: ['human', 'mystery', 'urban', 'legend']
    }
  };

  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject)
  );

  if (bestMatch) {
    return concepts[bestMatch];
  }

  return {
    title: 'Mysterious Discovery',
    description: `A unique creation featuring ${objects.join(' and ')} with distinctive characteristics.`,
    rarity: 'uncommon' as const,
    tags: [...objects.slice(0, 3), 'unique', 'discovery']
  };
};

class BrowserImageAnalyzer {
  private classifier: any = null;
  private isInitializing = false;

  async initialize() {
    if (this.classifier || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      console.log('Initializing image classifier...');
      this.classifier = await pipeline(
        'image-classification',
        'google/vit-base-patch16-224',
        { device: 'webgpu' }
      );
      console.log('Image classifier ready!');
    } catch (error) {
      console.warn('WebGPU failed, falling back to CPU:', error);
      try {
        this.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224'
        );
        console.log('Image classifier ready on CPU!');
      } catch (cpuError) {
        console.error('Failed to initialize classifier:', cpuError);
        this.classifier = null;
      }
    }
    this.isInitializing = false;
  }

  async analyzeImage(imageUrl: string): Promise<{
    title: string;
    description: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
    tags: string[];
    confidence: number;
    objects: string[];
  }> {
    try {
      await this.initialize();
      
      if (!this.classifier) {
        throw new Error('Classifier not available');
      }

      console.log('Analyzing image with browser AI...');
      const results = await this.classifier(imageUrl);
      
      // Extract top predictions
      const objects = results
        .filter((result: any) => result.score > 0.1)
        .map((result: any) => result.label.split(',')[0].trim().toLowerCase())
        .slice(0, 3);

      console.log('Detected objects:', objects);

      const cardConcept = objectToCardConcept(objects);
      const confidence = objects.length > 0 ? Math.max(results[0]?.score || 0.5, 0.6) : 0.4;

      return {
        ...cardConcept,
        confidence,
        objects
      };
    } catch (error) {
      console.error('Browser analysis failed:', error);
      
      // Fallback creative generation
      return {
        title: 'Creative Discovery',
        description: 'A unique card created from your image with artistic interpretation.',
        rarity: 'uncommon',
        tags: ['creative', 'unique', 'discovery'],
        confidence: 0.4,
        objects: ['unknown']
      };
    }
  }
}

export const browserImageAnalyzer = new BrowserImageAnalyzer();
