
import { simpleKeywordDetector } from './simpleKeywordDetector';
import { modelPipeline } from './modelPipeline';

export interface AnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
  objects: string[];
  detectionMethod?: string;
  matchedKeywords?: string[];
}

export class AnalysisOrchestrator {
  async analyzeImage(imageUrl: string): Promise<AnalysisResult> {
    try {
      console.log('🚀 Starting image analysis for:', imageUrl);
      
      // Step 1: Try to classify the actual image
      let detectedObjects: string[] = [];
      let detectionMethod = 'basic_fallback';
      
      try {
        console.log('🔍 Attempting image classification...');
        const classificationResults = await modelPipeline.classifyImage(imageUrl);
        
        if (classificationResults && classificationResults.length > 0) {
          detectedObjects = classificationResults.map(result => result.label);
          detectionMethod = 'image_classification';
          console.log('✅ Image classification successful:', detectedObjects);
        } else {
          console.log('⚠️ No classification results, using filename analysis...');
        }
      } catch (classificationError) {
        console.warn('❌ Image classification failed:', classificationError);
        console.log('🔄 Trying filename analysis...');
      }
      
      // Step 2: If no classification results, try filename analysis
      if (detectedObjects.length === 0) {
        const filename = this.extractFilenameFromUrl(imageUrl);
        const fileKeywords = this.analyzeFilename(filename);
        
        if (fileKeywords.length > 0) {
          detectedObjects = fileKeywords;
          detectionMethod = 'filename_analysis';
          console.log('📁 Filename analysis found:', fileKeywords);
        }
      }
      
      // Step 3: Use keyword detection with available information
      let inputForKeywords: string;
      
      if (detectedObjects.length > 0) {
        // Use actual detection results
        inputForKeywords = detectedObjects.join(' ');
        console.log('📝 Using detected objects for keywords:', inputForKeywords);
      } else {
        // Use random creative input instead of always the same test
        inputForKeywords = this.getRandomCreativeInput();
        detectionMethod = 'creative_fallback';
        console.log('🎨 Using creative fallback input:', inputForKeywords);
      }
      
      const keywordResult = simpleKeywordDetector.detectFromKeywords(inputForKeywords);
      
      console.log('✅ Final analysis result:', {
        method: detectionMethod,
        objects: detectedObjects.length > 0 ? detectedObjects : ['creative input'],
        keywordResult: keywordResult.title
      });
      
      return {
        title: keywordResult.title,
        description: keywordResult.description,
        rarity: keywordResult.rarity,
        tags: keywordResult.tags,
        confidence: keywordResult.confidence,
        objects: detectedObjects.length > 0 ? detectedObjects : ['creative input'],
        detectionMethod,
        matchedKeywords: keywordResult.matchedKeywords
      };
      
    } catch (error) {
      console.error('❌ Analysis orchestrator failed:', error);
      
      return {
        title: 'Mysterious Discovery',
        description: 'A unique finding with hidden potential and untold stories.',
        rarity: 'uncommon',
        tags: ['mysterious', 'discovery', 'unique'],
        confidence: 0.5,
        objects: ['unknown'],
        detectionMethod: 'error_fallback'
      };
    }
  }
  
  private extractFilenameFromUrl(url: string): string {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename.split('.')[0] || 'unknown';
    } catch {
      return 'unknown';
    }
  }
  
  private analyzeFilename(filename: string): string[] {
    const lowerFilename = filename.toLowerCase();
    const keywords: string[] = [];
    
    // Common image filename patterns
    const patterns = {
      'cat': ['cat', 'kitten', 'feline', 'kitty'],
      'dog': ['dog', 'puppy', 'canine', 'pup'],
      'car': ['car', 'auto', 'vehicle', 'truck'],
      'flower': ['flower', 'bloom', 'rose', 'daisy'],
      'person': ['person', 'man', 'woman', 'people', 'human'],
      'bird': ['bird', 'eagle', 'owl', 'robin'],
      'nature': ['tree', 'forest', 'mountain', 'landscape']
    };
    
    for (const [category, terms] of Object.entries(patterns)) {
      if (terms.some(term => lowerFilename.includes(term))) {
        keywords.push(category);
      }
    }
    
    return keywords;
  }
  
  private getRandomCreativeInput(): string {
    const creativeInputs = [
      'beautiful cat sitting peacefully',
      'loyal dog playing happily',
      'colorful flower blooming brightly',
      'powerful car racing fast',
      'majestic bird soaring high',
      'wise person standing proud',
      'gentle bear in forest',
      'mysterious creature with magic',
      'elegant horse running free',
      'ancient tree with wisdom'
    ];
    
    const randomIndex = Math.floor(Math.random() * creativeInputs.length);
    return creativeInputs[randomIndex];
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
