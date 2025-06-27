
import { analyzeWithCLIP, analyzeWithBLIP, analyzeWithOpenAIVision } from './advancedAnalysis.ts';
import { analyzeImageWithHuggingFace } from './huggingFaceAnalysis.ts';
import { findCharacterMatch, generateCharacterCard } from './characterDatabase.ts';
import { enhancedObjectToCardConcept } from './creativeMapping.ts';

export interface AdvancedAnalysisResult {
  title: string;
  description: string;
  detectedObjects: string[];
  analysisMethod: string;
  confidence: number;
  category?: string;
  rarity?: string;
}

export async function runMultiModalAnalysis(imageData: string): Promise<AdvancedAnalysisResult> {
  console.log('🚀 Starting multi-modal image analysis...');
  
  let analysisResults: string[] = [];
  let analysisMethod = 'fallback';
  let confidence = 0.3;
  let characterMatch = null;
  
  // Try OpenAI Vision first (best for character recognition)
  try {
    console.log('🎯 Attempting OpenAI Vision analysis...');
    const visionDescription = await analyzeWithOpenAIVision(imageData);
    
    if (visionDescription) {
      console.log('✅ OpenAI Vision successful:', visionDescription);
      
      // Check for character matches in the description
      characterMatch = findCharacterMatch(visionDescription);
      
      if (characterMatch) {
        console.log('🎭 Character identified:', characterMatch.key);
        const characterCard = generateCharacterCard(characterMatch);
        
        return {
          title: characterCard.title,
          description: characterCard.description,
          detectedObjects: [characterMatch.key],
          analysisMethod: 'openai_vision_character',
          confidence: 0.95,
          category: characterCard.category,
          rarity: characterCard.rarity
        };
      }
      
      // Extract keywords from vision description
      analysisResults = extractKeywordsFromDescription(visionDescription);
      analysisMethod = 'openai_vision';
      confidence = 0.85;
    }
  } catch (error) {
    console.log('⚠️ OpenAI Vision failed:', error.message);
  }
  
  // Try BLIP image captioning if OpenAI failed or didn't find character
  if (!characterMatch) {
    try {
      console.log('📝 Attempting BLIP image captioning...');
      const caption = await analyzeWithBLIP(imageData);
      
      if (caption) {
        console.log('✅ BLIP successful:', caption);
        
        // Check for character matches in caption
        characterMatch = findCharacterMatch(caption);
        
        if (characterMatch) {
          console.log('🎭 Character identified via BLIP:', characterMatch.key);
          const characterCard = generateCharacterCard(characterMatch);
          
          return {
            title: characterCard.title,
            description: characterCard.description,
            detectedObjects: [characterMatch.key],
            analysisMethod: 'blip_character',
            confidence: 0.85,
            category: characterCard.category,
            rarity: characterCard.rarity
          };
        }
        
        if (!analysisResults.length) {
          analysisResults = extractKeywordsFromDescription(caption);
          analysisMethod = 'blip_caption';
          confidence = 0.75;
        }
      }
    } catch (error) {
      console.log('⚠️ BLIP failed:', error.message);
    }
  }
  
  // Try ResNet-50 as backup
  if (!analysisResults.length) {
    try {
      console.log('🔄 Attempting ResNet-50 analysis...');
      const resnetResults = await analyzeImageWithHuggingFace(imageData);
      
      if (resnetResults.length > 0) {
        console.log('✅ ResNet-50 successful:', resnetResults);
        analysisResults = resnetResults;
        analysisMethod = 'huggingface_resnet50';
        confidence = 0.6;
      }
    } catch (error) {
      console.log('⚠️ ResNet-50 failed:', error.message);
    }
  }
  
  // Final fallback
  if (!analysisResults.length) {
    console.log('🔄 Using intelligent fallback...');
    analysisResults = ['unique_creation'];
    analysisMethod = 'intelligent_fallback';
    confidence = 0.4;
  }
  
  // Generate card concept from results
  const cardConcept = enhancedObjectToCardConcept(analysisResults);
  
  return {
    title: cardConcept.title,
    description: cardConcept.description,
    detectedObjects: analysisResults,
    analysisMethod,
    confidence,
    category: 'general'
  };
}

function extractKeywordsFromDescription(description: string): string[] {
  const text = description.toLowerCase();
  const keywords: string[] = [];
  
  // Common objects and themes
  const patterns = [
    /(\w+) character/g,
    /(\w+) figure/g,
    /(\w+) person/g,
    /(\w+) creature/g,
    /(\w+) robot/g,
    /(\w+) warrior/g,
    /(\w+) hero/g,
    /(\w+) villain/g,
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const keyword = match.replace(/ (character|figure|person|creature|robot|warrior|hero|villain)/, '');
        if (keyword.length > 2) {
          keywords.push(keyword);
        }
      });
    }
  });
  
  // If no specific patterns found, extract meaningful words
  if (keywords.length === 0) {
    const words = text.split(' ').filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'will'].includes(word)
    );
    keywords.push(...words.slice(0, 3));
  }
  
  return keywords.length > 0 ? keywords : ['mysterious_entity'];
}
