
import { analysisOrchestrator } from './imageAnalysis/analysisOrchestrator';

export interface ImageAnalysisResult {
  objects: string[];
  confidence: number;
  analysisType: 'browser' | 'fallback';
  detectionMethod?: string;
  matchedKeywords?: string[];
}

class BrowserImageAnalyzer {
  async analyzeImage(imageUrl: string) {
    console.log('🔍 Browser analyzer using simplified Step 1 approach');
    const result = await analysisOrchestrator.analyzeImage(imageUrl);
    
    return {
      objects: result.objects,
      confidence: result.confidence,
      analysisType: 'browser' as const,
      detectionMethod: result.detectionMethod,
      matchedKeywords: result.matchedKeywords,
      // Include full result for debugging
      fullResult: result
    };
  }
}

export const browserImageAnalyzer = new BrowserImageAnalyzer();
