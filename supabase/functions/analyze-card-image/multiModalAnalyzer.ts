
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
        
        // Enhanced logic: check if ResNet results match known character patterns
        const resnetText = resnetResults.join(' ');
        characterMatch = findCharacterMatch(resnetText);
        
        if (characterMatch) {
          console.log('🎭 Character identified via ResNet pattern matching:', characterMatch.key);
          const characterCard = generateCharacterCard(characterMatch);
          
          return {
            title: characterCard.title,
            description: characterCard.description,
            detectedObjects: [characterMatch.key],
            analysisMethod: 'resnet_character_pattern',
            confidence: 0.8,
            category: characterCard.category,
            rarity: characterCard.rarity
          };
        }
        
        analysisResults = resnetResults;
        analysisMethod = 'huggingface_resnet50';
        confidence = 0.6;
      }
    } catch (error) {
      console.log('⚠️ ResNet-50 failed:', error.message);
    }
  }
  
  // Enhanced fallback with better pattern matching
  if (!analysisResults.length) {
    console.log('🔄 Using intelligent fallback with enhanced patterns...');
    
    // Try to infer from image URL or context clues
    const urlContext = extractContextFromUrl(imageData);
    if (urlContext) {
      characterMatch = findCharacterMatch(urlContext);
      if (characterMatch) {
        console.log('🎭 Character identified via URL context:', characterMatch.key);
        const characterCard = generateCharacterCard(characterMatch);
        
        return {
          title: characterCard.title,
          description: characterCard.description,
          detectedObjects: [characterMatch.key],
          analysisMethod: 'url_context_character',
          confidence: 0.7,
          category: characterCard.category,
          rarity: characterCard.rarity
        };
      }
    }
    
    analysisResults = ['mysterious_figure'];
    analysisMethod = 'intelligent_fallback';
    confidence = 0.4;
  }
  
  // Generate card concept from results using enhanced mapping
  const cardConcept = enhancedObjectToCardConcept(analysisResults);
  
  return {
    title: cardConcept.title,
    description: cardConcept.description,
    detectedObjects: analysisResults,
    analysisMethod,
    confidence,
    category: 'general',
    rarity: cardConcept.rarity
  };
}

function extractKeywordsFromDescription(description: string): string[] {
  const text = description.toLowerCase();
  const keywords: string[] = [];
  
  // Enhanced pattern matching for characters and objects
  const patterns = [
    /(\w+) character/g,
    /(\w+) figure/g,
    /(\w+) person/g,
    /(\w+) creature/g,
    /(\w+) robot/g,
    /(\w+) warrior/g,
    /(\w+) hero/g,
    /(\w+) villain/g,
    /(\w+) jedi/g,
    /(\w+) sith/g,
    /(\w+) master/g,
    /small green/g,
    /green ears/g,
    /wise/g,
    /force/g,
    /lightsaber/g
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const keyword = match.replace(/ (character|figure|person|creature|robot|warrior|hero|villain|jedi|sith|master)/, '');
        if (keyword.length > 2) {
          keywords.push(keyword);
        }
      });
    }
  });
  
  // Special Star Wars character detection
  if (text.includes('green') && text.includes('small') || text.includes('yoda')) {
    keywords.push('yoda');
  }
  
  if (text.includes('mask') && text.includes('black') || text.includes('vader') || text.includes('darth')) {
    keywords.push('darth_vader');
  }
  
  if (text.includes('jedi') && text.includes('young') || text.includes('luke')) {
    keywords.push('luke_skywalker');
  }
  
  // If no specific patterns found, extract meaningful words
  if (keywords.length === 0) {
    const words = text.split(' ').filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'will', 'image', 'shows', 'appears'].includes(word)
    );
    keywords.push(...words.slice(0, 3));
  }
  
  return keywords.length > 0 ? keywords : ['mysterious_entity'];
}

function extractContextFromUrl(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname.toLowerCase();
    
    // Check for character names in URL
    if (pathname.includes('yoda')) return 'yoda green jedi master';
    if (pathname.includes('vader') || pathname.includes('darth')) return 'darth vader mask black sith';
    if (pathname.includes('luke')) return 'luke skywalker jedi young';
    if (pathname.includes('leia')) return 'princess leia rebel leader';
    if (pathname.includes('han') && pathname.includes('solo')) return 'han solo smuggler';
    if (pathname.includes('chewbacca') || pathname.includes('chewie')) return 'chewbacca wookiee furry';
    if (pathname.includes('r2d2') || pathname.includes('r2-d2')) return 'r2d2 droid blue white';
    if (pathname.includes('c3po') || pathname.includes('c-3po')) return 'c3po droid gold protocol';
    
    return null;
  } catch {
    return null;
  }
}
