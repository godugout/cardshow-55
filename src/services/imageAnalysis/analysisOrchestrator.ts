
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
      console.log('🚀 Starting simplified image analysis for:', imageUrl);
      
      // Generate random card type for variety
      const randomCardType = this.getRandomCardType();
      console.log('🎲 Generated random card type:', randomCardType);
      
      const keywordResult = simpleKeywordDetector.detectFromKeywords(randomCardType);
      
      console.log('✅ Analysis complete:', {
        method: 'random_card_type',
        input: randomCardType,
        result: keywordResult.title,
        confidence: keywordResult.confidence
      });
      
      return {
        title: keywordResult.title,
        description: keywordResult.description,
        rarity: keywordResult.rarity,
        tags: keywordResult.tags,
        confidence: keywordResult.confidence,
        objects: [randomCardType],
        detectionMethod: 'random_card_type',
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
  
  private getRandomCardType(): string {
    const cardTypes = [
      // Cute Animals
      'adorable cat',
      'playful kitten',
      'loyal dog',
      'fluffy puppy',
      'wise owl',
      'graceful swan',
      'curious rabbit',
      'gentle deer',
      
      // Mystical Creatures
      'ancient dragon',
      'magical unicorn',
      'phoenix rising',
      'forest spirit',
      'water nymph',
      'mountain guardian',
      'star wolf',
      'crystal fox',
      
      // Fantasy Heroes
      'brave knight',
      'wise wizard',
      'skilled archer',
      'noble paladin',
      'shadow assassin',
      'fire mage',
      'ice sorceress',
      'storm caller',
      
      // Nature Elements
      'blooming flower',
      'ancient tree',
      'flowing river',
      'majestic mountain',
      'golden sunset',
      'starry night',
      'ocean waves',
      'rainbow bridge',
      
      // Legendary Beings
      'galactic guardian wookiee',
      'cosmic protector',
      'time keeper',
      'dimension walker',
      'soul guardian',
      'dream weaver',
      'light bringer',
      'shadow master',
      
      // Vehicles & Objects
      'speed machine car',
      'flying vehicle',
      'mystical artifact',
      'power crystal',
      'enchanted sword',
      'magic shield',
      'golden treasure',
      'ancient relic'
    ];
    
    const randomIndex = Math.floor(Math.random() * cardTypes.length);
    return cardTypes[randomIndex];
  }
}

export const analysisOrchestrator = new AnalysisOrchestrator();
