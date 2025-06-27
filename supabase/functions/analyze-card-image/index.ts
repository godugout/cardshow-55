
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Character database with enhanced pattern matching
const CHARACTER_DATABASE = {
  'yoda': {
    patterns: ['green', 'small', 'ears', 'jedi', 'master', 'wise', 'old', 'force', 'staff', 'cane'],
    fallbackPatterns: ['mask', 'toy', 'figure', 'doll', 'puppet'],
    title: 'Master Yoda',
    description: 'Ancient Jedi Grand Master with 900 years of wisdom and unparalleled mastery of the Force.',
    rarity: 'legendary',
    category: 'star_wars'
  },
  'darth_vader': {
    patterns: ['mask', 'black', 'helmet', 'breathing', 'cape', 'armor', 'dark'],
    fallbackPatterns: ['suit', 'robot'],
    title: 'Darth Vader',
    description: 'Dark Lord of the Sith, fallen Jedi encased in black mechanical armor.',
    rarity: 'legendary',
    category: 'star_wars'
  },
  'chewbacca': {
    patterns: ['furry', 'hair', 'brown', 'tall', 'wookiee'],
    fallbackPatterns: ['bear', 'dog', 'beast'],
    title: 'Chewbacca',
    description: 'Loyal Wookiee warrior and co-pilot of the Millennium Falcon.',
    rarity: 'rare',
    category: 'star_wars'
  }
};

async function analyzeWithHuggingFace(imageData: string): Promise<string[]> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    console.log('⚠️ HuggingFace API key not configured');
    return ['unknown'];
  }

  try {
    console.log('🤖 Starting HuggingFace ResNet-50 analysis...');
    
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
      console.error(`❌ HuggingFace API error: ${hfResponse.status}`);
      return ['unknown'];
    }

    const result = await hfResponse.json();
    console.log('🔍 HuggingFace result:', result);
    
    if (Array.isArray(result) && result.length > 0) {
      return result
        .filter(item => item.score > 0.05) // Lower threshold for more detections
        .map(item => item.label.toLowerCase())
        .slice(0, 15); // More results for better matching
    }
    
    return ['unknown'];
  } catch (error) {
    console.error('❌ HuggingFace analysis failed:', error);
    return ['unknown'];
  }
}

function findCharacterMatch(detectedObjects: string[]): any | null {
  const searchText = detectedObjects.join(' ').toLowerCase();
  console.log('🔍 Searching for character matches in:', searchText);
  
  for (const [key, character] of Object.entries(CHARACTER_DATABASE)) {
    // Check primary patterns
    const primaryMatches = character.patterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length;
    
    // Check fallback patterns
    const fallbackMatches = character.fallbackPatterns.filter(pattern => 
      searchText.includes(pattern.toLowerCase())
    ).length;
    
    console.log(`🎯 ${key}: primary=${primaryMatches}, fallback=${fallbackMatches}`);
    
    // If we have primary matches or multiple fallback matches
    if (primaryMatches >= 1 || fallbackMatches >= 2) {
      console.log(`✅ Character match found: ${key}`);
      return { key, ...character };
    }
    
    // Special case for single strong fallback indicators
    if (fallbackMatches >= 1) {
      // Additional context checks
      if (key === 'yoda' && (searchText.includes('mask') || searchText.includes('toy'))) {
        console.log(`✅ Special Yoda detection via fallback pattern`);
        return { key, ...character };
      }
      if (key === 'darth_vader' && searchText.includes('mask')) {
        console.log(`✅ Special Vader detection via mask pattern`);
        return { key, ...character };
      }
    }
  }
  
  console.log('❌ No character match found');
  return null;
}

function generateFallbackCard(detectedObjects: string[]) {
  const primary = detectedObjects[0] || 'unknown';
  
  const fallbackOptions = [
    {
      title: 'Mysterious Guardian',
      description: 'A powerful entity whose true nature remains hidden behind ancient mysteries.',
      rarity: 'rare'
    },
    {
      title: 'Enigmatic Warrior',
      description: 'A legendary figure whose strength and wisdom echo through the ages.',
      rarity: 'uncommon'
    },
    {
      title: 'Ancient Protector',
      description: 'A timeless guardian watching over secrets from a forgotten era.',
      rarity: 'rare'
    }
  ];
  
  const selected = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
  return {
    title: selected.title,
    description: selected.description,
    rarity: selected.rarity,
    category: 'mystery'
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting enhanced character detection analysis...');
    
    // Analyze with HuggingFace
    const detectedObjects = await analyzeWithHuggingFace(imageData);
    console.log('📊 Detected objects:', detectedObjects);
    
    // Try to find character match
    const characterMatch = findCharacterMatch(detectedObjects);
    
    let result;
    if (characterMatch) {
      console.log('🎭 Character identified:', characterMatch.key);
      result = {
        title: characterMatch.title,
        description: characterMatch.description,
        rarity: characterMatch.rarity,
        category: characterMatch.category,
        detectedObjects,
        confidence: 0.85,
        analysisMethod: 'enhanced_character_detection'
      };
    } else {
      console.log('🎲 Using fallback card generation');
      const fallback = generateFallbackCard(detectedObjects);
      result = {
        title: fallback.title,
        description: fallback.description,
        rarity: fallback.rarity,
        category: fallback.category,
        detectedObjects,
        confidence: 0.5,
        analysisMethod: 'fallback_generation'
      };
    }
    
    // Format response for compatibility
    const response = {
      extractedText: detectedObjects,
      subjects: detectedObjects,
      playerName: result.title,
      team: result.category === 'star_wars' ? 'Galactic Empire' : 'Legendary Collection',
      year: new Date().getFullYear().toString(),
      sport: result.category === 'star_wars' ? 'Star Wars' : 'Fantasy',
      cardNumber: '',
      confidence: result.confidence,
      analysisType: 'visual',
      analysisMethod: result.analysisMethod,
      visualAnalysis: {
        subjects: detectedObjects,
        colors: ['Mixed'],
        mood: result.category === 'star_wars' ? 'Epic' : 'Mysterious',
        style: 'Cinematic',
        theme: result.category || 'Adventure',
        setting: result.category === 'star_wars' ? 'Galaxy Far Far Away' : 'Fantasy Realm'
      },
      creativeTitle: result.title,
      creativeDescription: result.description,
      rarity: result.rarity
    };

    console.log('✅ Analysis complete:', response);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    
    return new Response(JSON.stringify({
      extractedText: ['unknown'],
      subjects: ['unknown'],
      playerName: 'Mysterious Entity',
      team: 'Unknown Realm',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: 0.3,
      analysisType: 'fallback',
      analysisMethod: 'error_fallback',
      visualAnalysis: {
        subjects: ['Unknown'],
        colors: ['Unknown'],
        mood: 'Mysterious',
        style: 'Enigmatic',
        theme: 'Mystery',
        setting: 'Unknown Realm'
      },
      creativeTitle: 'Mysterious Entity',
      creativeDescription: 'An enigmatic presence with unknown origins.',
      rarity: 'common'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
