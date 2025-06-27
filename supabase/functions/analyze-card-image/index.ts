
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced character database with disambiguation rules
const CHARACTER_DATABASE = {
  'yoda': {
    id: 'yoda',
    patterns: ['green', 'small', 'ears', 'jedi', 'master', 'wise', 'old', 'force', 'staff', 'cane'],
    fallbackPatterns: ['mask', 'toy', 'figure', 'doll', 'puppet'],
    contextualPatterns: ['robe', 'cloak', 'lightsaber'],
    visualContext: {
      dominantColors: ['green', 'brown', 'beige'],
      size: 'small',
      proportions: 'short_wide',
      distinctiveFeatures: ['large_ears', 'wrinkled_skin']
    },
    exclusionRules: ['black', 'tall', 'armor', 'helmet', 'cape'],
    disambiguationScore: 0.9,
    title: 'Master Yoda',
    description: 'Ancient Jedi Grand Master with 900 years of wisdom and unparalleled mastery of the Force.',
    rarity: 'legendary',
    category: 'star_wars',
    confidence: 0.9
  },
  'darth_vader': {
    id: 'darth_vader',
    patterns: ['black', 'helmet', 'breathing', 'cape', 'armor', 'dark', 'tall'],
    fallbackPatterns: ['mask', 'suit', 'robot', 'machine'],
    contextualPatterns: ['lightsaber', 'empire', 'sith'],
    visualContext: {
      dominantColors: ['black', 'grey', 'silver'],
      size: 'large',
      proportions: 'tall_imposing',
      distinctiveFeatures: ['mask_helmet', 'chest_panel', 'cape']
    },
    exclusionRules: ['green', 'small', 'ears', 'wise'],
    disambiguationScore: 0.95,
    title: 'Darth Vader',
    description: 'Dark Lord of the Sith, fallen Jedi encased in black mechanical armor.',
    rarity: 'legendary',
    category: 'star_wars',
    confidence: 0.95
  },
  'chewbacca': {
    id: 'chewbacca',
    patterns: ['furry', 'hair', 'brown', 'tall', 'wookiee', 'hairy'],
    fallbackPatterns: ['bear', 'dog', 'beast', 'animal'],
    contextualPatterns: ['millennium', 'falcon', 'han', 'solo'],
    visualContext: {
      dominantColors: ['brown', 'tan', 'russet'],
      size: 'large',
      proportions: 'tall_furry',
      distinctiveFeatures: ['full_body_fur', 'bandolier', 'height']
    },
    exclusionRules: ['mask', 'helmet', 'armor'],
    disambiguationScore: 0.85,
    title: 'Chewbacca',
    description: 'Loyal Wookiee warrior and co-pilot of the Millennium Falcon.',
    rarity: 'rare',
    category: 'star_wars',
    confidence: 0.85
  }
};

interface AnalysisResult {
  success: boolean;
  method: string;
  confidence: number;
  detectedObjects: string[];
  characterMatch?: any;
  visualContext?: any;
  disambiguationLog?: string[];
  error?: string;
}

// Enhanced visual context analysis
function analyzeVisualContext(imageData: string): any {
  try {
    console.log('🎨 Analyzing visual context from image data...');
    
    // Basic analysis from data URL characteristics
    const context = {
      dominantColors: [],
      brightness: 'unknown',
      contrast: 'unknown',
      imageSize: 'unknown'
    };
    
    // Analyze image format and size hints
    if (imageData.includes('jpeg') || imageData.includes('jpg')) {
      context.imageSize = 'photograph';
    }
    
    const base64Content = imageData.split(',')[1] || '';
    const contentLength = base64Content.length;
    
    if (contentLength > 100000) {
      context.imageSize = 'high_resolution';
    } else if (contentLength < 50000) {
      context.imageSize = 'low_resolution';
    }
    
    // Simple color analysis from base64 patterns (basic heuristic)
    const base64Sample = base64Content.substring(0, 1000);
    if (base64Sample.includes('AA') || base64Sample.includes('BB')) {
      context.dominantColors.push('dark');
    }
    if (base64Sample.includes('//') || base64Sample.includes('++')) {
      context.dominantColors.push('light');
    }
    
    console.log('🎨 Visual context analysis:', context);
    return context;
  } catch (error) {
    console.error('❌ Visual context analysis failed:', error);
    return { dominantColors: [], brightness: 'unknown', contrast: 'unknown' };
  }
}

// Enhanced character matching with disambiguation
function findCharacterMatch(detectedObjects: string[], visualContext?: any): any | null {
  const searchText = detectedObjects.join(' ').toLowerCase();
  console.log('🔍 Enhanced character matching for:', searchText);
  console.log('🎨 Visual context:', visualContext);
  
  const matches = [];
  const disambiguationLog = [];
  
  // Score all characters
  for (const [key, character] of Object.entries(CHARACTER_DATABASE)) {
    let score = 0;
    let exclusionTriggered = false;
    const matchDetails = [];
    
    // Check exclusion rules first
    for (const exclusionRule of character.exclusionRules) {
      if (searchText.includes(exclusionRule.toLowerCase())) {
        exclusionTriggered = true;
        disambiguationLog.push(`❌ ${key}: Excluded by rule '${exclusionRule}'`);
        break;
      }
    }
    
    if (exclusionTriggered) continue;
    
    // Primary patterns (high weight)
    const primaryMatches = character.patterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    );
    score += primaryMatches.length * 3;
    if (primaryMatches.length > 0) {
      matchDetails.push(`primary: ${primaryMatches.join(', ')}`);
    }
    
    // Fallback patterns (medium weight)
    const fallbackMatches = character.fallbackPatterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    );
    score += fallbackMatches.length * 2;
    if (fallbackMatches.length > 0) {
      matchDetails.push(`fallback: ${fallbackMatches.join(', ')}`);
    }
    
    // Contextual patterns (low weight)
    const contextualMatches = character.contextualPatterns?.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length || 0;
    score += contextualMatches * 1;
    if (contextualMatches > 0) {
      matchDetails.push(`contextual: ${contextualMatches} matches`);
    }
    
    // Visual context bonus
    let visualBonus = 0;
    if (visualContext && character.visualContext) {
      // Color matching bonus
      const colorMatches = character.visualContext.dominantColors.filter(color =>
        visualContext.dominantColors?.includes(color) || 
        searchText.includes(color.toLowerCase())
      ).length;
      visualBonus += colorMatches * 1.5;
      
      if (colorMatches > 0) {
        matchDetails.push(`visual_colors: ${colorMatches} matches`);
      }
    }
    
    const totalScore = score + visualBonus;
    
    if (totalScore >= 2) { // Minimum threshold
      matches.push({
        key,
        character,
        score: totalScore,
        matchDetails,
        confidence: Math.min(character.confidence * (totalScore / 6), 0.95)
      });
      
      disambiguationLog.push(`✅ ${key}: score=${totalScore.toFixed(1)} (${matchDetails.join(', ')})`);
    } else {
      disambiguationLog.push(`⚪ ${key}: score=${totalScore.toFixed(1)} - below threshold`);
    }
  }
  
  // Sort by score and apply disambiguation
  matches.sort((a, b) => b.score - a.score);
  
  console.log('🎯 Disambiguation log:');
  disambiguationLog.forEach(log => console.log(log));
  
  if (matches.length === 0) {
    console.log('❌ No character matches found');
    return null;
  }
  
  // Handle ambiguous matches
  if (matches.length > 1 && matches[0].score === matches[1].score) {
    console.log('⚠️ Ambiguous match detected, using disambiguation score');
    matches.sort((a, b) => b.character.disambiguationScore - a.character.disambiguationScore);
  }
  
  const bestMatch = matches[0];
  console.log(`🏆 Best match: ${bestMatch.key} (score: ${bestMatch.score}, confidence: ${bestMatch.confidence})`);
  
  return {
    ...bestMatch.character,
    matchScore: bestMatch.score,
    confidence: bestMatch.confidence,
    disambiguationLog
  };
}

// Primary Analysis Method: HuggingFace ResNet-50
async function primaryAnalysis(imageData: string): Promise<AnalysisResult> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    return {
      success: false,
      method: 'huggingface_resnet50',
      confidence: 0,
      detectedObjects: [],
      error: 'HuggingFace API key not configured'
    };
  }

  try {
    console.log('🎯 Primary Analysis: HuggingFace ResNet-50 starting...');
    
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`HuggingFace API error: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('🔍 HuggingFace result:', result);
    
    if (Array.isArray(result) && result.length > 0) {
      const detectedObjects = result
        .filter(item => item.score > 0.1)
        .map(item => item.label.toLowerCase())
        .slice(0, 10);
      
      const visualContext = analyzeVisualContext(imageData);
      const characterMatch = findCharacterMatch(detectedObjects, visualContext);
      
      return {
        success: true,
        method: 'huggingface_resnet50',
        confidence: characterMatch ? characterMatch.confidence : Math.max(...result.map(r => r.score)),
        detectedObjects,
        characterMatch,
        visualContext,
        disambiguationLog: characterMatch?.disambiguationLog
      };
    }
    
    throw new Error('No valid results from HuggingFace');
  } catch (error) {
    console.error('❌ Primary analysis failed:', error);
    return {
      success: false,
      method: 'huggingface_resnet50',
      confidence: 0,
      detectedObjects: [],
      error: error.message
    };
  }
}

// Secondary Analysis Method: OpenAI Vision
async function secondaryAnalysis(imageData: string): Promise<AnalysisResult> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      method: 'openai_vision',
      confidence: 0,
      detectedObjects: [],
      error: 'OpenAI API key not configured'
    };
  }

  try {
    console.log('🎯 Secondary Analysis: OpenAI Vision starting...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify any characters, objects, colors, and notable features. Focus on distinguishing characteristics. Return a detailed comma-separated list.'
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content || '';
    
    const detectedObjects = content
      .toLowerCase()
      .split(/[,\n]/)
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0)
      .slice(0, 15);
    
    const visualContext = analyzeVisualContext(imageData);
    const characterMatch = findCharacterMatch(detectedObjects, visualContext);
    
    return {
      success: true,
      method: 'openai_vision',
      confidence: characterMatch ? characterMatch.confidence : 0.7,
      detectedObjects,
      characterMatch,
      visualContext,
      disambiguationLog: characterMatch?.disambiguationLog
    };
  } catch (error) {
    console.error('❌ Secondary analysis failed:', error);
    return {
      success: false,
      method: 'openai_vision',
      confidence: 0,
      detectedObjects: [],
      error: error.message
    };
  }
}

// Tertiary Analysis Method: Basic heuristics
async function tertiaryAnalysis(imageData: string): Promise<AnalysisResult> {
  try {
    console.log('🎯 Tertiary Analysis: Basic heuristics starting...');
    
    const detectedObjects = ['unknown_subject', 'digital_content'];
    const visualContext = analyzeVisualContext(imageData);
    
    // Add basic descriptors based on image characteristics
    if (visualContext.dominantColors.includes('dark')) {
      detectedObjects.push('dark_figure');
    }
    if (visualContext.dominantColors.includes('light')) {
      detectedObjects.push('light_figure');
    }
    
    return {
      success: true,
      method: 'basic_heuristics',
      confidence: 0.2,
      detectedObjects,
      visualContext,
      disambiguationLog: ['Basic analysis - minimal confidence']
    };
  } catch (error) {
    console.error('❌ Tertiary analysis failed:', error);
    return {
      success: false,
      method: 'basic_heuristics',
      confidence: 0,
      detectedObjects: [],
      error: error.message
    };
  }
}

// Robust analysis orchestrator with enhanced fallback chain
async function analyzeImageRobustly(imageData: string) {
  console.log('🚀 Starting enhanced multi-tier image analysis...');
  
  // Try primary analysis
  let result = await primaryAnalysis(imageData);
  
  if (!result.success || result.confidence < 0.5) {
    console.log('⚠️ Primary analysis failed or low confidence, trying secondary...');
    result = await secondaryAnalysis(imageData);
  }
  
  if (!result.success || result.confidence < 0.3) {
    console.log('⚠️ Secondary analysis failed or low confidence, trying tertiary...');
    result = await tertiaryAnalysis(imageData);
  }
  
  // Enhanced confidence check with disambiguation
  if (!result.success || result.confidence < 0.2) {
    console.log('❌ All analysis methods failed or confidence too low');
    return null;
  }
  
  console.log(`✅ Enhanced analysis complete using ${result.method} with confidence ${result.confidence}`);
  console.log('🎯 Final disambiguation log:', result.disambiguationLog);
  
  return result;
}

// Generate response based on enhanced analysis
function generateCardResponse(analysisResult: AnalysisResult | null, detectedObjects: string[]) {
  if (!analysisResult || !analysisResult.characterMatch) {
    // Return null result when confidence is too low
    if (!analysisResult || analysisResult.confidence < 0.2) {
      return {
        extractedText: ['unknown'],
        subjects: ['unknown'],
        playerName: null,
        team: null,
        year: new Date().getFullYear().toString(),
        sport: null,
        cardNumber: '',
        confidence: 0,
        analysisType: 'failed',
        analysisMethod: analysisResult?.method || 'none',
        visualAnalysis: {
          subjects: ['Unknown'],
          colors: ['Unknown'],
          mood: 'Unknown',
          style: 'Unknown',
          theme: 'Unknown',
          setting: 'Unknown'
        },
        creativeTitle: null,
        creativeDescription: null,
        rarity: null,
        requiresManualReview: true,
        error: true,
        message: 'Image analysis was inconclusive. Please try a different image or provide manual details.'
      };
    }
    
    // Low confidence generic result
    return {
      extractedText: detectedObjects,
      subjects: detectedObjects,
      playerName: 'Unknown Subject',
      team: 'Unidentified',
      year: new Date().getFullYear().toString(),
      sport: 'General',
      cardNumber: '',
      confidence: analysisResult.confidence,
      analysisType: 'generic',
      analysisMethod: analysisResult.method,
      visualAnalysis: {
        subjects: detectedObjects,
        colors: analysisResult.visualContext?.dominantColors || ['Mixed'],
        mood: 'Neutral',
        style: 'Unknown',
        theme: 'General',
        setting: 'Unknown'
      },
      creativeTitle: 'Mysterious Subject',
      creativeDescription: 'An unidentified subject with unclear characteristics.',
      rarity: 'common',
      requiresManualReview: true
    };
  }
  
  // High confidence character match
  const character = analysisResult.characterMatch;
  return {
    extractedText: detectedObjects,
    subjects: detectedObjects,
    playerName: character.title,
    team: character.category === 'star_wars' ? 'Galactic Empire' : 'Legendary Collection',
    year: new Date().getFullYear().toString(),
    sport: character.category === 'star_wars' ? 'Star Wars' : 'Fantasy',
    cardNumber: '',
    confidence: character.confidence,
    analysisType: character.category === 'star_wars' ? 'character' : 'generic',
    analysisMethod: analysisResult.method,
    visualAnalysis: {
      subjects: detectedObjects,
      colors: analysisResult.visualContext?.dominantColors || ['Mixed'],
      mood: character.category === 'star_wars' ? 'Epic' : 'Mysterious',
      style: 'Cinematic',
      theme: character.category || 'Adventure',
      setting: character.category === 'star_wars' ? 'Galaxy Far Far Away' : 'Fantasy Realm'
    },
    creativeTitle: character.title,
    creativeDescription: character.description,
    rarity: character.rarity,
    requiresManualReview: false,
    disambiguationLog: character.disambiguationLog
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting enhanced robust image analysis system...');
    
    // Perform enhanced analysis with improved disambiguation
    const analysisResult = await analyzeImageRobustly(imageData);
    const detectedObjects = analysisResult?.detectedObjects || ['unknown'];
    
    // Generate appropriate response
    const response = generateCardResponse(analysisResult, detectedObjects);
    
    console.log('✅ Final enhanced analysis result:', {
      method: analysisResult?.method || 'failed',
      confidence: response.confidence,
      requiresManualReview: response.requiresManualReview,
      character: response.creativeTitle
    });
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Critical analysis error:', error);
    
    return new Response(JSON.stringify({
      extractedText: ['error'],
      subjects: ['error'],
      playerName: null,
      team: null,
      year: new Date().getFullYear().toString(),
      sport: null,
      cardNumber: '',
      confidence: 0,
      analysisType: 'error',
      analysisMethod: 'none',
      visualAnalysis: {
        subjects: ['Error'],
        colors: ['Unknown'],
        mood: 'Error',
        style: 'Unknown',
        theme: 'Error',
        setting: 'Unknown'
      },
      creativeTitle: null,
      creativeDescription: null,
      rarity: null,
      requiresManualReview: true,
      error: true,
      message: 'Analysis system encountered an error. Please try again or provide manual details.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
