
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Enhanced OpenAI analysis with retry logic
async function analyzeWithOpenAI(imageData: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    return { success: false, error: 'No OpenAI API key configured' };
  }

  try {
    return await retryWithBackoff(async () => {
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
                  text: `Analyze this image and identify WHO this person is. I need you to:

1. Look past any masks, face coverings, helmets, or accessories
2. Focus on identifying the actual person by their overall appearance, build, context, uniform, etc.
3. If you recognize them, tell me their name specifically
4. Don't be overly cautious - if you think you know who it is, say so

Respond in JSON format:
{
  "personName": "Actual person's name if you recognize them, null if you don't",
  "confidence": 0.0-1.0,
  "description": "What you see in the image",
  "reasoning": "Why you think this is that person",
  "cardType": "character/sports/entertainment/etc"
}`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageData }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        
        if (response.status === 429) {
          throw new Error('Rate limit - will retry');
        }
        
        return { success: false, error: `OpenAI API error: ${response.status}` };
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
          mainSubject: analysis.personName || 'Person',
          cardType: analysis.cardType || 'character',
          description: analysis.description || '',
          reasoning: analysis.reasoning || '',
          isPersonDetected: true
        };
      } catch (parseError) {
        console.warn('Failed to parse OpenAI response:', parseError);
        return { success: false, error: 'Failed to parse response' };
      }
    });
  } catch (error) {
    console.error('OpenAI analysis failed after retries:', error);
    return { success: false, error: error.message };
  }
}

// Face detection fallback using HuggingFace
async function detectPersonWithHuggingFace(imageData: string) {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    console.log('❌ No HuggingFace API key found');
    return null;
  }

  try {
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Use a proper face detection model instead of ResNet
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      console.error('HuggingFace API error:', hfResponse.status);
      return null;
    }

    const result = await hfResponse.json();
    
    // Look for person detection in results
    if (Array.isArray(result)) {
      const personDetection = result.find(item => 
        item.label && item.label.toLowerCase().includes('person')
      );
      
      if (personDetection && personDetection.score > 0.5) {
        return {
          success: true,
          method: 'huggingface-person-detection',
          confidence: personDetection.score,
          mainSubject: 'Person Detected',
          cardType: 'character',
          description: `Detected person with ${Math.round(personDetection.score * 100)}% confidence`,
          isPersonDetected: true
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('HuggingFace person detection failed:', error);
    return null;
  }
}

// Generic visual analysis fallback
async function genericVisualAnalysisFallback() {
  return {
    success: true,
    method: 'generic-fallback',
    confidence: 0.3,
    mainSubject: 'Unknown Person',
    cardType: 'character',
    description: 'Image contains a person but automatic identification failed',
    isPersonDetected: true,
    requiresManualInput: true
  };
}

// Main analysis orchestrator
async function analyzeImage(imageData: string) {
  console.log('🚀 Starting enhanced image analysis...');
  
  // Try OpenAI first (most capable)
  console.log('🔍 Attempting OpenAI analysis...');
  const openaiResult = await analyzeWithOpenAI(imageData);
  
  if (openaiResult.success && openaiResult.confidence >= 0.5) {
    console.log('✅ OpenAI analysis successful:', openaiResult);
    return openaiResult;
  } else {
    console.log('❌ OpenAI failed:', openaiResult.error);
  }
  
  // Try HuggingFace person detection
  console.log('🔍 Attempting HuggingFace person detection...');
  const hfResult = await detectPersonWithHuggingFace(imageData);
  
  if (hfResult && hfResult.confidence >= 0.5) {
    console.log('✅ HuggingFace person detection successful:', hfResult);
    return hfResult;
  } else {
    console.log('❌ HuggingFace person detection failed');
  }
  
  // Final fallback - assume it's a person but needs manual input
  console.log('🔄 Using generic fallback...');
  const fallbackResult = genericVisualAnalysisFallback();
  console.log('✅ Generic fallback applied:', fallbackResult);
  
  return fallbackResult;
}

// Generate enhanced card response with debugging info
function generateCardResponse(analysisResult: any) {
  const debugInfo = {
    detectionMethod: analysisResult.method || 'unknown',
    confidence: analysisResult.confidence || 0,
    success: analysisResult.success || false,
    timestamp: new Date().toISOString()
  };

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
      message: analysisResult?.requiresManualInput 
        ? 'Person detected, but automatic identification failed. Please enter details manually.'
        : 'Image analysis failed. Please provide card details manually.',
      debugInfo
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
    requiresManualReview: analysisResult.confidence < 0.7 || analysisResult.requiresManualInput,
    error: false,
    reasoning: analysisResult.reasoning || '',
    debugInfo
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }
    
    const analysisResult = await analyzeImage(imageData);
    const response = generateCardResponse(analysisResult);
    
    console.log('📋 Final analysis result:', {
      method: analysisResult.method,
      confidence: response.confidence,
      personName: response.playerName,
      mainSubject: analysisResult.mainSubject,
      requiresManualReview: response.requiresManualReview,
      debugInfo: response.debugInfo
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
      message: 'Critical system error. Please try again or enter details manually.',
      debugInfo: {
        detectionMethod: 'error',
        confidence: 0,
        success: false,
        timestamp: new Date().toISOString(),
        error: error.message
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
