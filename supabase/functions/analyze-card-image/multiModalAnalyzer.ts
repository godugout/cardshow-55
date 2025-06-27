
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
  let fullDescription = '';
  
  // Try OpenAI Vision first (best for character recognition)
  try {
    console.log('🎯 Attempting OpenAI Vision analysis...');
    const visionDescription = await analyzeWithOpenAIVision(imageData);
    
    if (visionDescription) {
      console.log('✅ OpenAI Vision successful:', visionDescription);
      fullDescription = visionDescription;
      
      // Check for character matches in the description
      characterMatch = findCharacterMatch(visionDescription);
      
      if (characterMatch) {
        console.log('🎭 Character identified via OpenAI Vision:', characterMatch.key);
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
        if (!fullDescription) fullDescription = caption;
        
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
        
        // ENHANCED LOGIC: Use ResNet results with full description for better matching
        const combinedContext = (fullDescription + ' ' + resnetResults.join(' ')).toLowerCase();
        console.log('🔍 Combined context for character matching:', combinedContext);
        
        // Try character matching with enhanced context
        characterMatch = findCharacterMatch(combinedContext);
        
        if (characterMatch) {
          console.log('🎭 Character identified via enhanced ResNet pattern matching:', characterMatch.key);
          const characterCard = generateCharacterCard(characterMatch);
          
          return {
            title: characterCard.title,
            description: characterCard.description,
            detectedObjects: [characterMatch.key],
            analysisMethod: 'resnet_enhanced_character_detection',
            confidence: 0.8,
            category: characterCard.category,
            rarity: characterCard.rarity
          };
        }
        
        // Enhanced fallback: Apply intelligent character detection rules
        characterMatch = applyIntelligentCharacterDetection(resnetResults, fullDescription);
        
        if (characterMatch) {
          console.log('🧠 Character identified via intelligent detection:', characterMatch.key);
          const characterCard = generateCharacterCard(characterMatch);
          
          return {
            title: characterCard.title,
            description: characterCard.description,
            detectedObjects: [characterMatch.key],
            analysisMethod: 'intelligent_character_detection',
            confidence: 0.75,
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

function applyIntelligentCharacterDetection(detectedObjects: string[], fullDescription: string): any | null {
  const allContext = (detectedObjects.join(' ') + ' ' + fullDescription).toLowerCase();
  console.log('🧠 Applying intelligent character detection to:', allContext);
  
  // Smart detection rules based on common misclassifications
  const intelligentRules = [
    {
      // Yoda often gets detected as mask, toy, or figure
      conditions: ['mask', 'toy', 'figure', 'doll', 'puppet'],
      indicators: ['green', 'small', 'ears', 'old', 'wise', 'jedi', 'star wars'],
      character: 'yoda',
      confidence: 0.9
    },
    {
      // Darth Vader often gets detected as mask or helmet
      conditions: ['mask', 'helmet', 'armor', 'black'],
      indicators: ['dark', 'breathing', 'cape', 'sith', 'vader', 'star wars'],
      character: 'darth vader',
      confidence: 0.9
    },
    {
      // Chewbacca often gets detected as bear, dog, or furry creature
      conditions: ['bear', 'dog', 'furry', 'hair', 'brown'],
      indicators: ['tall', 'wookiee', 'chewbacca', 'chewie', 'star wars'],
      character: 'chewbacca',
      confidence: 0.85
    },
    {
      // R2-D2 often gets detected as robot or cylinder
      conditions: ['robot', 'cylinder', 'blue', 'white'],
      indicators: ['r2d2', 'r2-d2', 'droid', 'astromech', 'star wars'],
      character: 'r2d2',
      confidence: 0.85
    }
  ];
  
  for (const rule of intelligentRules) {
    const hasCondition = rule.conditions.some(condition => allContext.includes(condition));
    const hasIndicators = rule.indicators.filter(indicator => allContext.includes(indicator)).length;
    
    if (hasCondition && hasIndicators >= 1) {
      console.log(`🎯 Intelligent detection match: ${rule.character} (condition: ${hasCondition}, indicators: ${hasIndicators})`);
      
      // Import character data
      const { CHARACTER_DATABASE } = await import('./characterDatabase.ts');
      const character = CHARACTER_DATABASE[rule.character];
      
      if (character) {
        return { key: rule.character, ...character };
      }
    }
  }
  
  return null;
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
  if (text.includes('green') && (text.includes('small') || text.includes('ears')) || text.includes('yoda')) {
    keywords.push('yoda');
  }
  
  if ((text.includes('mask') && text.includes('black')) || text.includes('vader') || text.includes('darth')) {
    keywords.push('darth_vader');
  }
  
  if ((text.includes('jedi') && text.includes('young')) || text.includes('luke')) {
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
    if (pathname.includes('yoda')) return 'yoda green jedi master small';
    if (pathname.includes('vader') || pathname.includes('darth')) return 'darth vader mask black sith dark';
    if (pathname.includes('luke')) return 'luke skywalker jedi young blonde';
    if (pathname.includes('leia')) return 'princess leia rebel leader white';
    if (pathname.includes('han') && pathname.includes('solo')) return 'han solo smuggler pilot';
    if (pathname.includes('chewbacca') || pathname.includes('chewie')) return 'chewbacca wookiee furry tall brown';
    if (pathname.includes('r2d2') || pathname.includes('r2-d2')) return 'r2d2 droid blue white astromech';
    if (pathname.includes('c3po') || pathname.includes('c-3po')) return 'c3po droid gold protocol';
    
    return null;
  } catch {
    return null;
  }
}
