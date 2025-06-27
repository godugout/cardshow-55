
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
      console.log('🚀 Starting SIMPLIFIED analysis (Step 1: Keywords only)');
      
      // For Step 1, we'll just use a simple test input
      // In a real scenario, this would come from image analysis
      const testInput = 'furry humanoid creature with brown fur standing tall';
      
      console.log('📝 Test input for keyword detection:', testInput);
      
      const result = simpleKeywordDetector.detectFromKeywords(testInput);
      
      console.log('✅ Keyword detection result:', result);
      
      return {
        title: result.title,
        description: result.description,
        rarity: result.rarity,
        tags: result.tags,
        confidence: result.confidence,
        objects: result.matchedKeywords || ['test input'],
        detectionMethod: result.detectionMethod,
        matchedKeywords: result.matchedKeywords
      };
      
    } catch (error) {
      console.error('❌ Simplified analysis failed:', error);
      
      return {
        title: 'Analysis Error',
        description: 'Simple keyword detection failed.',
        rarity: 'common',
        tags: ['error', 'step1'],
        confidence: 0.1,
        objects: ['error'],
        detectionMethod: 'error_fallback'
      };
    }
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
