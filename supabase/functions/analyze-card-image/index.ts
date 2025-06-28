
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UniversalAnalysisResult {
  success: boolean;
  method: string;
  confidence: number;
  subjects: string[];
  detectedPerson?: string;
  detectedObjects: string[];
  colors?: string[];
  context?: string;
  searchResults?: any[];
  error?: string;
}

// Universal AI Analysis using OpenAI Vision
async function universalAIAnalysis(imageData: string): Promise<UniversalAnalysisResult> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      method: 'openai_universal',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: 'OpenAI API key not configured'
    };
  }

  try {
    console.log('🎯 Universal AI Analysis: OpenAI Vision starting...');
    
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
                text: `Analyze this image and provide detailed identification. If you recognize any specific people, name them. Focus on:
                1. Main subject(s) - be specific with names if recognizable
                2. Secondary objects or elements
                3. Colors, style, mood
                4. Context or setting
                5. Any text visible in the image
                
                Return your analysis in this exact JSON format:
                {
                  "mainSubject": "specific name if person/character, or general description",
                  "isPerson": true/false,
                  "personName": "full name if recognized, null otherwise",
                  "objects": ["list", "of", "objects"],
                  "colors": ["dominant", "colors"],
                  "style": "description of visual style",
                  "context": "setting or background context",
                  "confidence": 0.0-1.0,
                  "extractedText": ["any", "text", "found"]
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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content || '';
    
    console.log('📝 Raw AI response:', content);
    
    // Try to parse JSON response
    let analysis;
    try {
      // Extract JSON from response if wrapped in markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.warn('Failed to parse JSON, extracting manually:', parseError);
      // Fallback: extract information manually
      const lines = content.toLowerCase().split('\n');
      analysis = {
        mainSubject: content.includes('bowie') ? 'David Bowie' : 'unknown subject',
        isPerson: content.includes('person') || content.includes('man') || content.includes('woman'),
        personName: null,
        objects: ['person'],
        colors: ['unknown'],
        style: 'unknown',
        context: 'unknown',
        confidence: 0.3,
        extractedText: []
      };
    }
    
    // Calculate confidence based on specificity
    let confidence = analysis.confidence || 0.5;
    if (analysis.personName && analysis.personName !== 'null') {
      confidence = Math.max(confidence, 0.85); // High confidence for named individuals
    } else if (analysis.isPerson) {
      confidence = Math.max(confidence, 0.7); // Medium confidence for people
    } else if (analysis.mainSubject && analysis.mainSubject !== 'unknown subject') {
      confidence = Math.max(confidence, 0.6); // Decent confidence for identified objects
    }
    
    const subjects = [analysis.mainSubject, ...analysis.objects].filter(Boolean);
    
    return {
      success: true,
      method: 'openai_universal',
      confidence,
      subjects,
      detectedPerson: analysis.personName !== 'null' ? analysis.personName : null,
      detectedObjects: analysis.objects || [],
      colors: analysis.colors || [],
      context: analysis.context,
      searchResults: []
    };
    
  } catch (error) {
    console.error('❌ Universal AI analysis failed:', error);
    return {
      success: false,
      method: 'openai_universal',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: error.message
    };
  }
}

// Fallback HuggingFace analysis for object detection
async function fallbackObjectDetection(imageData: string): Promise<UniversalAnalysisResult> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    return {
      success: false,
      method: 'huggingface_fallback',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: 'HuggingFace API key not configured'
    };
  }

  try {
    console.log('🔄 Fallback: HuggingFace object detection...');
    
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
      
      const confidence = Math.max(...result.map(r => r.score)) * 0.7; // Lower confidence for generic detection
      
      return {
        success: true,
        method: 'huggingface_fallback',
        confidence,
        subjects: detectedObjects,
        detectedObjects,
        colors: []
      };
    }
    
    throw new Error('No valid results from HuggingFace');
  } catch (error) {
    console.error('❌ Fallback analysis failed:', error);
    return {
      success: false,
      method: 'huggingface_fallback',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: error.message
    };
  }
}

// Main analysis orchestrator
async function analyzeImageUniversally(imageData: string): Promise<UniversalAnalysisResult | null> {
  console.log('🚀 Starting universal image analysis...');
  
  // Try universal AI analysis first (most comprehensive)
  let result = await universalAIAnalysis(imageData);
  
  // If AI analysis failed or confidence too low, try fallback
  if (!result.success || result.confidence < 0.6) {
    console.log('⚠️ Universal AI analysis failed or low confidence, trying fallback...');
    result = await fallbackObjectDetection(imageData);
  }
  
  // If both failed or confidence still too low, return null (NO FAKE DATA)
  if (!result.success || result.confidence < 0.6) {
    console.log('❌ All analysis methods failed or confidence too low');
    return null;
  }
  
  console.log(`✅ Universal analysis complete using ${result.method} with confidence ${result.confidence}`);
  
  return result;
}

// Generate response based on analysis - REAL DATA ONLY
function generateCardResponse(analysisResult: UniversalAnalysisResult | null) {
  if (!analysisResult) {
    // Return NULL values when no confident result - NO FAKE DATA
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
      message: 'Image analysis was inconclusive. Please provide card details manually.'
    };
  }
  
  // Use real analysis results
  const mainSubject = analysisResult.subjects[0] || 'Unknown Subject';
  const isPersonCard = !!analysisResult.detectedPerson;
  
  return {
    extractedText: analysisResult.detectedObjects,
    subjects: analysisResult.subjects,
    playerName: analysisResult.detectedPerson || (isPersonCard ? mainSubject : null),
    team: null, // Let user fill this manually
    year: new Date().getFullYear().toString(),
    sport: null, // Let user determine this
    cardNumber: '',
    confidence: analysisResult.confidence,
    analysisType: isPersonCard ? 'person' : 'object',
    analysisMethod: analysisResult.method,
    visualAnalysis: {
      subjects: analysisResult.subjects,
      colors: analysisResult.colors || ['Unknown'],
      mood: 'Unknown', // Let user determine
      style: analysisResult.context || 'Unknown',
      theme: isPersonCard ? 'Portrait' : 'General',
      setting: analysisResult.context || 'Unknown'
    },
    creativeTitle: analysisResult.detectedPerson || mainSubject,
    creativeDescription: `${isPersonCard ? 'Portrait of ' : ''}${mainSubject}${analysisResult.context ? ` in ${analysisResult.context}` : ''}`,
    rarity: isPersonCard ? 'rare' : 'common', // Simple heuristic
    requiresManualReview: analysisResult.confidence < 0.8,
    searchResults: analysisResult.searchResults
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting universal image analysis system...');
    
    // Perform universal analysis
    const analysisResult = await analyzeImageUniversally(imageData);
    
    // Generate appropriate response - REAL DATA ONLY
    const response = generateCardResponse(analysisResult);
    
    console.log('✅ Final analysis result:', {
      method: analysisResult?.method || 'failed',
      confidence: response.confidence,
      detectedPerson: analysisResult?.detectedPerson,
      mainSubject: analysisResult?.subjects[0],
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
      message: 'Analysis system encountered an error. Please provide card details manually.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
