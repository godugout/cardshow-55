
import { supabase } from '@/integrations/supabase/client';
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
      console.log('🚀 Starting real image analysis for:', imageUrl);
      
      // Call the Supabase edge function for image analysis
      const { data, error } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return this.getFallbackResult();
      }

      console.log('📊 Analysis response:', data);

      // Extract detected objects from the response
      const detectedObjects = data.extractedText || data.subjects || [];
      
      if (detectedObjects.length > 0) {
        // Use the first detected object to generate card concept
        const primaryObject = detectedObjects[0];
        console.log('🎯 Primary detected object:', primaryObject);
        
        // Use the keyword detector with the real detected object
        const keywordResult = simpleKeywordDetector.detectFromKeywords(primaryObject);
        
        console.log('✅ Real analysis complete:', {
          method: 'huggingface_resnet50',
          detected: primaryObject,
          result: keywordResult.title,
          confidence: keywordResult.confidence
        });
        
        return {
          title: keywordResult.title,
          description: keywordResult.description,
          rarity: keywordResult.rarity,
          tags: keywordResult.tags,
          confidence: Math.min(keywordResult.confidence + 0.2, 1.0), // Boost confidence for real detection
          objects: detectedObjects,
          detectionMethod: 'huggingface_resnet50',
          matchedKeywords: keywordResult.matchedKeywords
        };
      } else {
        console.log('⚠️ No objects detected, using creative fallback');
        return this.getCreativeFallback(data);
      }
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return this.getFallbackResult();
    }
  }
  
  private getCreativeFallback(analysisData: any): AnalysisResult {
    // Use creative title from the analysis if available
    const creativeTitle = analysisData?.creativeTitle || analysisData?.playerName;
    const creativeDescription = analysisData?.creativeDescription;
    
    if (creativeTitle) {
      return {
        title: creativeTitle,
        description: creativeDescription || 'A unique creation with extraordinary characteristics and hidden potential.',
        rarity: 'uncommon',
        tags: ['creative', 'unique', 'mysterious'],
        confidence: 0.7,
        objects: ['creative_entity'],
        detectionMethod: 'creative_analysis'
      };
    }
    
    return this.getFallbackResult();
  }
  
  private getFallbackResult(): AnalysisResult {
    const fallbackTypes = [
      {
        title: 'Mysterious Discovery',
        description: 'A unique finding with hidden potential and untold stories.',
        tags: ['mysterious', 'discovery', 'unique'],
        rarity: 'uncommon' as const
      },
      {
        title: 'Legendary Artifact',
        description: 'An ancient relic imbued with mystical powers and rich history.',
        tags: ['legendary', 'artifact', 'mystical'],
        rarity: 'rare' as const
      },
      {
        title: 'Enchanted Creation',
        description: 'A magical entity brought to life through creative energy.',
        tags: ['enchanted', 'magical', 'creative'],
        rarity: 'uncommon' as const
      }
    ];
    
    const selected = fallbackTypes[Math.floor(Math.random() * fallbackTypes.length)];
    
    return {
      title: selected.title,
      description: selected.description,
      rarity: selected.rarity,
      tags: selected.tags,
      confidence: 0.5,
      objects: ['unknown'],
      detectionMethod: 'fallback'
    };
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
