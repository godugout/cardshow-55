
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
      console.log('🚀 Starting Step 2: Real image analysis');
      
      // Step 1: Try to classify the actual image
      let detectedObjects: string[] = [];
      let detectionMethod = 'fallback';
      
      try {
        console.log('🔍 Attempting image classification...');
        const classificationResults = await modelPipeline.classifyImage(imageUrl);
        
        if (classificationResults && classificationResults.length > 0) {
          detectedObjects = classificationResults.map(result => result.label);
          detectionMethod = 'image_classification';
          console.log('✅ Image classification successful:', detectedObjects);
        } else {
          console.log('⚠️ No classification results, using fallback');
        }
      } catch (classificationError) {
        console.warn('❌ Image classification failed:', classificationError);
        console.log('🔄 Falling back to keyword detection...');
      }
      
      // Step 2: Use keyword detection (either on classified objects or fallback)
      let inputForKeywords: string;
      
      if (detectedObjects.length > 0) {
        // Use actual classification results
        inputForKeywords = detectedObjects.join(' ');
        console.log('📝 Using classified objects for keywords:', inputForKeywords);
      } else {
        // Fallback to test input for now
        inputForKeywords = 'furry humanoid creature with brown fur standing tall';
        console.log('📝 Using fallback test input for keywords:', inputForKeywords);
        detectionMethod = 'fallback_keywords';
      }
      
      const keywordResult = simpleKeywordDetector.detectFromKeywords(inputForKeywords);
      
      console.log('✅ Final analysis result:', {
        method: detectionMethod,
        objects: detectedObjects.length > 0 ? detectedObjects : ['test input'],
        keywordResult: keywordResult.title
      });
      
      return {
        title: keywordResult.title,
        description: keywordResult.description,
        rarity: keywordResult.rarity,
        tags: keywordResult.tags,
        confidence: keywordResult.confidence,
        objects: detectedObjects.length > 0 ? detectedObjects : ['test input'],
        detectionMethod,
        matchedKeywords: keywordResult.matchedKeywords
      };
      
    } catch (error) {
      console.error('❌ Analysis orchestrator failed:', error);
      
      return {
        title: 'Analysis Error',
        description: 'Image analysis encountered an error.',
        rarity: 'common',
        tags: ['error', 'step2'],
        confidence: 0.1,
        objects: ['error'],
        detectionMethod: 'error_fallback'
      };
    }
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
