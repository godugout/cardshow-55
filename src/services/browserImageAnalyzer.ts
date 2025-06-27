
import { pipeline } from '@huggingface/transformers';
import { analysisOrchestrator } from './imageAnalysis/analysisOrchestrator';

// Configure transformers.js for browser use
import { env } from '@huggingface/transformers';
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface ImageAnalysisResult {
  objects: string[];
  confidence: number;
  analysisType: 'browser' | 'fallback';
}

class BrowserImageAnalyzer {
  async analyzeImage(imageUrl: string) {
    return await analysisOrchestrator.analyzeImage(imageUrl);
  }
}

export const browserImageAnalyzer = new BrowserImageAnalyzer();
