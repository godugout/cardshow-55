
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary';
  tags: string[];
  confidence: number;
  objects: string[];
  detectionMethod?: string;
  matchedKeywords?: string[];
  category?: string;
}

export class AnalysisOrchestrator {
  async analyzeImage(imageUrl: string): Promise<AnalysisResult> {
    try {
      console.log('🚀 Starting advanced multi-modal image analysis for:', imageUrl);
      
      // Call the enhanced Supabase edge function for image analysis
      const { data, error } = await supabase.functions.invoke('analyze-card-image', {
        body: { imageData: imageUrl }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return this.getFallbackResult();
      }

      console.log('📊 Advanced analysis response:', data);

      // Extract data from the enhanced response
      const detectedObjects = data.extractedText || data.subjects || [];
      const rarity = this.mapRarityFromResponse(data.rarity || 'uncommon');
      const category = data.visualAnalysis?.theme?.toLowerCase() || 'general';
      
      console.log('✅ Advanced analysis complete:', {
        method: data.analysisMethod,
        detected: detectedObjects,
        title: data.creativeTitle || data.playerName,
        confidence: data.confidence,
        category: category
      });
      
      return {
        title: data.creativeTitle || data.playerName || 'Unknown Entity',
        description: data.creativeDescription || 'A mysterious entity with unknown powers.',
        rarity: rarity,
        tags: this.generateTagsFromAnalysis(data, detectedObjects),
        confidence: data.confidence || 0.5,
        objects: detectedObjects,
        detectionMethod: data.analysisMethod || 'advanced_analysis',
        category: category
      };
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      return this.getFallbackResult();
    }
  }
  
  private mapRarityFromResponse(rarity: string): 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' {
    const rarityMap: { [key: string]: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' } = {
      'common': 'common',
      'uncommon': 'uncommon', 
      'rare': 'rare',
      'epic': 'ultra-rare',
      'legendary': 'legendary',
      'mythic': 'legendary'
    };
    
    return rarityMap[rarity.toLowerCase()] || 'uncommon';
  }
  
  private generateTagsFromAnalysis(data: any, objects: string[]): string[] {
    const tags = new Set<string>();
    
    // Add category-based tags
    if (data.sport && data.sport !== 'Fantasy') {
      tags.add(data.sport.toLowerCase());
    }
    
    // Add theme-based tags
    if (data.visualAnalysis?.theme) {
      tags.add(data.visualAnalysis.theme.toLowerCase());
    }
    
    // Add detected objects as tags
    objects.forEach(obj => {
      if (obj && obj !== 'mysterious_entity' && obj !== 'unique_creation') {
        tags.add(obj.toLowerCase().replace(/_/g, ' '));
      }
    });
    
    // Add mood and style tags
    if (data.visualAnalysis?.mood) {
      tags.add(data.visualAnalysis.mood.toLowerCase());
    }
    
    // Ensure we have at least some basic tags
    if (tags.size === 0) {
      tags.add('unique');
      tags.add('mysterious');
      tags.add('collectible');
    }
    
    return Array.from(tags).slice(0, 8); // Limit to 8 tags
  }
  
  private getFallbackResult(): AnalysisResult {
    const fallbackTypes = [
      {
        title: 'Enigmatic Entity',
        description: 'A mysterious being with untold powers and hidden secrets.',
        tags: ['mysterious', 'enigmatic', 'powerful'],
        rarity: 'uncommon' as const
      },
      {
        title: 'Legendary Artifact',
        description: 'An ancient relic imbued with mystical energies and rich history.',
        tags: ['legendary', 'artifact', 'ancient', 'mystical'],
        rarity: 'rare' as const
      },
      {
        title: 'Unknown Hero',
        description: 'A heroic figure whose true identity remains shrouded in mystery.',
        tags: ['hero', 'unknown', 'mysterious', 'brave'],
        rarity: 'uncommon' as const
      }
    ];
    
    const selected = fallbackTypes[Math.floor(Math.random() * fallbackTypes.length)];
    
    return {
      title: selected.title,
      description: selected.description,
      rarity: selected.rarity,
      tags: selected.tags,
      confidence: 0.4,
      objects: ['unknown_entity'],
      detectionMethod: 'fallback',
      category: 'mystery'
    };
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
