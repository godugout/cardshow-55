
import { visualFeatureAnalyzer } from '../visualFeatureAnalyzer';
import { modelPipeline } from './modelPipeline';
import { mapObjectsToCardConcept } from './conceptMapping';

export interface AnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
  objects: string[];
}

export class AnalysisOrchestrator {
  async analyzeImage(imageUrl: string): Promise<AnalysisResult> {
    try {
      console.log('Starting enhanced multi-model analysis...');
      
      // Run enhanced visual feature analysis
      const enhancedResults = await visualFeatureAnalyzer.analyzeImage(imageUrl);
      
      if (enhancedResults.confidence > 0.6) {
        console.log('Enhanced analysis successful:', enhancedResults);
        
        const cardConcept = mapObjectsToCardConcept(
          enhancedResults.primaryObjects,
          enhancedResults.visualFeatures,
          enhancedResults.characterArchetype
        );
        
        return {
          ...cardConcept,
          confidence: enhancedResults.confidence,
          objects: enhancedResults.primaryObjects
        };
      }
      
      // Fallback to original analysis
      console.log('Using fallback classification...');
      const results = await modelPipeline.classifyImage(imageUrl);
      const objects = results.map(r => r.label);
      const confidence = Math.max(results[0]?.score || 0.3, 0.4);

      const cardConcept = mapObjectsToCardConcept(objects);

      return {
        ...cardConcept,
        confidence,
        objects
      };
    } catch (error) {
      console.error('Enhanced browser analysis failed:', error);
      
      return {
        title: 'Enigmatic Discovery',
        description: 'A fascinating subject captured in this unique image, possessing mysterious qualities.',
        rarity: 'rare',
        tags: ['enigmatic', 'unique', 'mysterious', 'discovery', 'fascinating'],
        confidence: 0.5,
        objects: ['mysterious entity']
      };
    }
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
