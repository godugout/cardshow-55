
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple, direct OpenAI analysis focused on person/character identification
async function analyzeWithOpenAI(imageData: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
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
                text: `Look at this image and identify:
1. If there's a person, character, or recognizable figure - WHO IS IT? Give me their name if you can recognize them.
2. What are the main subjects/objects in the image?
3. What type of card would this be? (character, object, place, etc.)

Be direct and specific. If you see someone recognizable, tell me their name. Don't be overly cautious about face coverings or accessories - look at the overall appearance.

Respond in JSON format:
{
  "personName": "Name if you recognize them, null if not",
  "mainSubject": "Primary subject description",
  "cardType": "character/object/place/creature/etc",
  "confidence": 0.0-1.0,
  "description": "Brief description of what you see"
}`
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 400,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return null;
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content || '';
    
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      
      return {
        success: true,
        method: 'openai',
        confidence: analysis.confidence || 0.8,
        personName: analysis.personName,
        mainSubject: analysis.mainSubject || 'Unknown',
        cardType: analysis.cardType || 'character',
        description: analysis.description || '',
        isPersonDetected: !!analysis.personName || analysis.cardType === 'character'
      };
    } catch (parseError) {
      console.warn('Failed to parse OpenAI response:', parseError);
      return null;
    }
  } catch (error) {
    console.error('OpenAI analysis failed:', error);
    return null;
  }
}

// Fallback object detection
async function fallbackDetection(imageData: string) {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    return null;
  }

  try {
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
      return null;
    }

    const result = await hfResponse.json();
    
    if (Array.isArray(result) && result.length > 0) {
      const topResult = result[0];
      
      return {
        success: true,
        method: 'fallback',
        confidence: topResult.score || 0.5,
        mainSubject: topResult.label || 'Unknown',
        cardType: 'object',
        description: `Detected: ${topResult.label}`,
        isPersonDetected: false
      };
    }
    
    return null;
  } catch (error) {
    console.error('Fallback detection failed:', error);
    return null;
  }
}

// Main analysis function
async function analyzeImage(imageData: string) {
  console.log('🚀 Starting image analysis...');
  
  // Try OpenAI first (most capable)
  let result = await analyzeWithOpenAI(imageData);
  
  if (result && result.confidence >= 0.6) {
    console.log('✅ OpenAI analysis successful:', result);
    return result;
  }
  
  // Fallback to HuggingFace
  console.log('🔄 Trying fallback detection...');
  result = await fallbackDetection(imageData);
  
  if (result) {
    console.log('✅ Fallback analysis completed:', result);
    return result;
  }
  
  // Last resort
  console.log('❌ All analysis methods failed');
  return {
    success: false,
    method: 'failed',
    confidence: 0,
    mainSubject: 'Unknown',
    cardType: 'unknown',
    description: 'Could not analyze image',
    isPersonDetected: false,
    error: 'Analysis failed'
  };
}

// Generate card response
function generateCardResponse(analysisResult: any) {
  if (!analysisResult || !analysisResult.success) {
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
      analysisMethod: 'none',
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
      message: 'Image analysis failed. Please provide card details manually.'
    };
  }
  
  const isPersonCard = analysisResult.isPersonDetected || analysisResult.cardType === 'character';
  
  return {
    extractedText: [analysisResult.mainSubject],
    subjects: [analysisResult.mainSubject],
    playerName: analysisResult.personName,
    team: null,
    year: new Date().getFullYear().toString(),
    sport: null,
    cardNumber: '',
    confidence: analysisResult.confidence,
    analysisType: isPersonCard ? 'person' : 'object',
    analysisMethod: analysisResult.method,
    visualAnalysis: {
      subjects: [analysisResult.mainSubject],
      colors: ['Unknown'],
      mood: 'Unknown',
      style: 'Unknown',
      theme: isPersonCard ? 'Character' : 'General',
      setting: 'Unknown'
    },
    creativeTitle: analysisResult.personName || analysisResult.mainSubject,
    creativeDescription: analysisResult.description,
    rarity: isPersonCard ? 'rare' : 'common',
    requiresManualReview: analysisResult.confidence < 0.7,
    error: false
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    const analysisResult = await analyzeImage(imageData);
    const response = generateCardResponse(analysisResult);
    
    console.log('📋 Final result:', {
      method: analysisResult.method,
      confidence: response.confidence,
      personName: response.playerName,
      mainSubject: analysisResult.mainSubject,
      requiresManualReview: response.requiresManualReview
    });
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('❌ Analysis error:', error);
    
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
      message: 'Analysis system error. Please try again or enter details manually.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
