
import { simpleKeywordDetector } from './simpleKeywordDetector';

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
      console.log('🚀 Starting simple image analysis for:', imageUrl);
      
      // Step 1: Extract filename and use it for detection
      const filename = this.extractFilenameFromUrl(imageUrl);
      console.log('📁 Analyzing filename:', filename);
      
      const fileKeywords = this.analyzeFilename(filename);
      let detectionMethod = 'filename_analysis';
      let inputForKeywords = '';
      
      if (fileKeywords.length > 0) {
        inputForKeywords = fileKeywords.join(' ');
        console.log('📁 Found keywords from filename:', fileKeywords);
      } else {
        // Use random creative input for variety
        inputForKeywords = this.getRandomCreativeInput();
        detectionMethod = 'creative_fallback';
        console.log('🎨 Using creative fallback input:', inputForKeywords);
      }
      
      const keywordResult = simpleKeywordDetector.detectFromKeywords(inputForKeywords);
      
      console.log('✅ Analysis complete:', {
        method: detectionMethod,
        input: inputForKeywords,
        result: keywordResult.title,
        confidence: keywordResult.confidence
      });
      
      return {
        title: keywordResult.title,
        description: keywordResult.description,
        rarity: keywordResult.rarity,
        tags: keywordResult.tags,
        confidence: keywordResult.confidence,
        objects: fileKeywords.length > 0 ? fileKeywords : ['creative input'],
        detectionMethod,
        matchedKeywords: keywordResult.matchedKeywords
      };
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
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
      const cleanFilename = filename.split('?')[0].split('.')[0] || 'unknown';
      return cleanFilename;
    } catch {
      return 'unknown';
    }
  }
  
  private analyzeFilename(filename: string): string[] {
    const lowerFilename = filename.toLowerCase();
    const keywords: string[] = [];
    
    const patterns = {
      'cat': ['cat', 'kitten', 'feline', 'kitty', 'tabby', 'persian', 'siamese'],
      'dog': ['dog', 'puppy', 'canine', 'pup', 'retriever', 'bulldog', 'poodle'],
      'car': ['car', 'auto', 'vehicle', 'truck', 'sedan', 'suv'],
      'flower': ['flower', 'bloom', 'rose', 'daisy', 'tulip', 'lily'],
      'person': ['person', 'man', 'woman', 'people', 'human', 'portrait'],
      'bird': ['bird', 'eagle', 'owl', 'robin', 'parrot', 'hawk'],
      'nature': ['tree', 'forest', 'mountain', 'landscape', 'sunset'],
      'bear': ['bear', 'grizzly', 'polar', 'teddy']
    };
    
    for (const [category, terms] of Object.entries(patterns)) {
      const matches = terms.filter(term => lowerFilename.includes(term));
      if (matches.length > 0) {
        keywords.push(category);
        console.log(`📁 Found ${category} from filename`);
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
      'ancient dragon breathing fire'
    ];
    
    const randomIndex = Math.floor(Math.random() * creativeInputs.length);
    return creativeInputs[randomIndex];
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
