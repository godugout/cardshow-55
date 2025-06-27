
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced character database with confidence scoring
const CHARACTER_DATABASE = {
  'yoda': {
    patterns: ['green', 'small', 'ears', 'jedi', 'master', 'wise', 'old', 'force', 'staff', 'cane'],
    fallbackPatterns: ['mask', 'toy', 'figure', 'doll', 'puppet'],
    contextualPatterns: ['robe', 'cloak', 'lightsaber'],
    title: 'Master Yoda',
    description: 'Ancient Jedi Grand Master with 900 years of wisdom and unparalleled mastery of the Force.',
    rarity: 'legendary',
    category: 'star_wars',
    confidence: 0.9
  },
  'darth_vader': {
    patterns: ['mask', 'black', 'helmet', 'breathing', 'cape', 'armor', 'dark'],
    fallbackPatterns: ['suit', 'robot', 'machine'],
    contextualPatterns: ['lightsaber', 'empire', 'sith'],
    title: 'Darth Vader',
    description: 'Dark Lord of the Sith, fallen Jedi encased in black mechanical armor.',
    rarity: 'legendary',
    category: 'star_wars',
    confidence: 0.95
  },
  'chewbacca': {
    patterns: ['furry', 'hair', 'brown', 'tall', 'wookiee', 'hairy'],
    fallbackPatterns: ['bear', 'dog', 'beast', 'animal'],
    contextualPatterns: ['millennium', 'falcon', 'han', 'solo'],
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
  error?: string;
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
      
      const characterMatch = findCharacterMatch(detectedObjects);
      
      return {
        success: true,
        method: 'huggingface_resnet50',
        confidence: characterMatch ? characterMatch.confidence : Math.max(...result.map(r => r.score)),
        detectedObjects,
        characterMatch
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

// Secondary Analysis Method: OpenAI Vision (if available)
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
                text: 'Analyze this image and identify any characters, objects, or notable features. Return a comma-separated list of detected items.'
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
      .slice(0, 10);
    
    const characterMatch = findCharacterMatch(detectedObjects);
    
    return {
      success: true,
      method: 'openai_vision',
      confidence: characterMatch ? characterMatch.confidence : 0.7,
      detectedObjects,
      characterMatch
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

// Tertiary Analysis Method: Image Characteristics Analysis
async function tertiaryAnalysis(imageData: string): Promise<AnalysisResult> {
  try {
    console.log('🎯 Tertiary Analysis: Image characteristics starting...');
    
    // Basic image analysis based on data URL characteristics
    const detectedObjects: string[] = [];
    
    // Analyze image size and format
    if (imageData.includes('jpeg') || imageData.includes('jpg')) {
      detectedObjects.push('photograph');
    }
    if (imageData.includes('png')) {
      detectedObjects.push('digital_image');
    }
    
    // Simple base64 content analysis for common patterns
    const base64Content = imageData.split(',')[1] || '';
    const contentLength = base64Content.length;
    
    if (contentLength > 100000) {
      detectedObjects.push('high_resolution');
    }
    if (contentLength < 50000) {
      detectedObjects.push('small_image');
    }
    
    // Add generic descriptors
    detectedObjects.push('unknown_subject', 'digital_content');
    
    return {
      success: true,
      method: 'image_characteristics',
      confidence: 0.3,
      detectedObjects,
      characterMatch: null
    };
  } catch (error) {
    console.error('❌ Tertiary analysis failed:', error);
    return {
      success: false,
      method: 'image_characteristics',
      confidence: 0,
      detectedObjects: [],
      error: error.message
    };
  }
}

// Enhanced character matching with confidence scoring
function findCharacterMatch(detectedObjects: string[]): any | null {
  const searchText = detectedObjects.join(' ').toLowerCase();
  console.log('🔍 Searching for character matches in:', searchText);
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const [key, character] of Object.entries(CHARACTER_DATABASE)) {
    let score = 0;
    
    // Primary patterns (high weight)
    const primaryMatches = character.patterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length;
    score += primaryMatches * 3;
    
    // Fallback patterns (medium weight)
    const fallbackMatches = character.fallbackPatterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length;
    score += fallbackMatches * 2;
    
    // Contextual patterns (low weight)
    const contextualMatches = character.contextualPatterns?.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length || 0;
    score += contextualMatches * 1;
    
    console.log(`🎯 ${key}: primary=${primaryMatches}, fallback=${fallbackMatches}, contextual=${contextualMatches}, total_score=${score}`);
    
    if (score > bestScore && score >= 2) { // Minimum threshold
      bestScore = score;
      bestMatch = { 
        key, 
        ...character, 
        matchScore: score,
        confidence: Math.min(character.confidence * (score / 5), 0.95)
      };
    }
  }
  
  if (bestMatch) {
    console.log(`✅ Best character match: ${bestMatch.key} (score: ${bestScore}, confidence: ${bestMatch.confidence})`);
  } else {
    console.log('❌ No character match found');
  }
  
  return bestMatch;
}

// Robust analysis orchestrator with fallback chain
async function analyzeImageRobustly(imageData: string) {
  console.log('🚀 Starting robust multi-tier image analysis...');
  
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
  
  // If all methods fail or confidence is too low, return null result
  if (!result.success || result.confidence < 0.2) {
    console.log('❌ All analysis methods failed or confidence too low');
    return null;
  }
  
  console.log(`✅ Analysis complete using ${result.method} with confidence ${result.confidence}`);
  return result;
}

// Generate response based on analysis result
function generateCardResponse(analysisResult: AnalysisResult | null, detectedObjects: string[]) {
  if (!analysisResult || !analysisResult.characterMatch) {
    // Return null result instead of fake data when confidence is too low
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
        colors: ['Mixed'],
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
      colors: ['Mixed'],
      mood: character.category === 'star_wars' ? 'Epic' : 'Mysterious',
      style: 'Cinematic',
      theme: character.category || 'Adventure',
      setting: character.category === 'star_wars' ? 'Galaxy Far Far Away' : 'Fantasy Realm'
    },
    creativeTitle: character.title,
    creativeDescription: character.description,
    rarity: character.rarity,
    requiresManualReview: false
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting robust image analysis system...');
    
    // Perform robust analysis with fallback chain
    const analysisResult = await analyzeImageRobustly(imageData);
    const detectedObjects = analysisResult?.detectedObjects || ['unknown'];
    
    // Generate appropriate response
    const response = generateCardResponse(analysisResult, detectedObjects);
    
    console.log('✅ Final analysis result:', {
      method: analysisResult?.method || 'failed',
      confidence: response.confidence,
      requiresManualReview: response.requiresManualReview
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
