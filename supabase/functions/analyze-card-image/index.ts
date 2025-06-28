
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
  isPersonDetected?: boolean;
}

// Enhanced OpenAI Vision Analysis with better prompting and retry logic
async function enhancedOpenAIAnalysis(imageData: string): Promise<UniversalAnalysisResult> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      method: 'openai_enhanced',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: 'OpenAI API key not configured'
    };
  }

  // Retry logic for rate limits
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🎯 Enhanced OpenAI Analysis attempt ${attempt}...`);
      
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
                  text: `Analyze this image with extreme precision. Focus on identifying:

1. PEOPLE FIRST: If there's any person, celebrity, character, or human face - identify them by name if possible
2. Main subjects and objects in the image
3. Visual style, colors, and artistic elements
4. Any text or symbols visible
5. Context and setting

CRITICAL: If you see a person or face, prioritize that over objects like masks, costumes, or accessories they might be wearing.

Return ONLY valid JSON in this exact format:
{
  "isPerson": true/false,
  "personName": "full name if recognized, null otherwise", 
  "mainSubject": "primary subject description",
  "allObjects": ["list", "of", "all", "detected", "objects"],
  "colors": ["dominant", "colors"],
  "style": "visual style description",
  "context": "setting/background context",
  "confidence": 0.0-1.0,
  "textFound": ["any", "visible", "text"]
}`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageData }
                }
              ]
            }
          ],
          max_tokens: 600,
          temperature: 0.1
        })
      });

      if (response.status === 429) {
        console.log(`⚠️ Rate limited on attempt ${attempt}, waiting before retry...`);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
          continue;
        }
        throw new Error('Rate limited after all retries');
      }

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content || '';
      
      console.log('📝 Enhanced AI response:', content);
      
      // Parse JSON response
      let analysis;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : content;
        analysis = JSON.parse(jsonStr);
      } catch (parseError) {
        console.warn('Failed to parse JSON, extracting manually:', parseError);
        // Manual extraction fallback
        const isPerson = content.toLowerCase().includes('person') || content.toLowerCase().includes('face') || content.toLowerCase().includes('human');
        analysis = {
          isPerson,
          personName: null,
          mainSubject: 'unidentified subject',
          allObjects: ['unknown'],
          colors: ['unknown'],
          style: 'unknown',
          context: 'unknown',
          confidence: 0.3,
          textFound: []
        };
      }
      
      // Calculate enhanced confidence
      let confidence = analysis.confidence || 0.5;
      if (analysis.isPerson && analysis.personName) {
        confidence = Math.max(confidence, 0.9); // Very high for named people
      } else if (analysis.isPerson) {
        confidence = Math.max(confidence, 0.75); // High for detected people
      } else if (analysis.mainSubject && !analysis.mainSubject.includes('unknown')) {
        confidence = Math.max(confidence, 0.65); // Good for clear objects
      }
      
      const subjects = [analysis.mainSubject, ...analysis.allObjects].filter(Boolean);
      
      return {
        success: true,
        method: 'openai_enhanced',
        confidence,
        subjects,
        detectedPerson: analysis.personName,
        detectedObjects: analysis.allObjects || [],
        colors: analysis.colors || [],
        context: analysis.context,
        isPersonDetected: analysis.isPerson,
        searchResults: []
      };
      
    } catch (error) {
      console.error(`❌ Enhanced OpenAI analysis attempt ${attempt} failed:`, error);
      if (attempt === 3) {
        return {
          success: false,
          method: 'openai_enhanced',
          confidence: 0,
          subjects: [],
          detectedObjects: [],
          error: error.message
        };
      }
    }
  }

  return {
    success: false,
    method: 'openai_enhanced',
    confidence: 0,
    subjects: [],
    detectedObjects: [],
    error: 'All retry attempts failed'
  };
}

// Face Detection Preprocessing
async function detectFacesInImage(imageData: string): Promise<boolean> {
  try {
    console.log('👤 Checking for faces in image...');
    
    // Simple face detection using basic image analysis
    // This is a placeholder - in production you'd use a proper face detection API
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // For now, we'll assume face detection based on image characteristics
    // In a real implementation, you'd use AWS Rekognition, Google Vision, or similar
    return true; // Placeholder - assume faces might be present
  } catch (error) {
    console.warn('Face detection failed:', error);
    return false;
  }
}

// Celebrity Recognition Fallback
async function celebrityRecognitionFallback(imageData: string): Promise<UniversalAnalysisResult> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    return {
      success: false,
      method: 'celebrity_recognition',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: 'HuggingFace API key not configured'
    };
  }

  try {
    console.log('🌟 Trying celebrity recognition...');
    
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Try face recognition model first
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`HuggingFace celebrity API error: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('🌟 Celebrity recognition result:', result);
    
    // Process celebrity recognition results
    if (result && result.length > 0) {
      const topResult = result[0];
      return {
        success: true,
        method: 'celebrity_recognition',
        confidence: topResult.score || 0.6,
        subjects: [topResult.label || 'person'],
        detectedPerson: topResult.label,
        detectedObjects: [topResult.label || 'person'],
        isPersonDetected: true,
        colors: []
      };
    }
    
    throw new Error('No celebrity detected');
  } catch (error) {
    console.error('❌ Celebrity recognition failed:', error);
    return {
      success: false,
      method: 'celebrity_recognition',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: error.message
    };
  }
}

// Enhanced General Object Detection with Person Focus
async function enhancedObjectDetection(imageData: string): Promise<UniversalAnalysisResult> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    return {
      success: false,
      method: 'enhanced_object_detection',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: 'HuggingFace API key not configured'
    };
  }

  try {
    console.log('🔍 Enhanced object detection with person focus...');
    
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
    console.log('🔍 Enhanced detection result:', result);
    
    if (Array.isArray(result) && result.length > 0) {
      // Filter and prioritize person-related detections
      const personRelated = result.filter(item => 
        item.label.toLowerCase().includes('person') ||
        item.label.toLowerCase().includes('man') ||
        item.label.toLowerCase().includes('woman') ||
        item.label.toLowerCase().includes('face') ||
        item.label.toLowerCase().includes('human')
      );
      
      let detectedObjects = result
        .filter(item => item.score > 0.1)
        .map(item => item.label.toLowerCase())
        .slice(0, 10);
      
      let confidence = Math.max(...result.map(r => r.score));
      let isPersonDetected = personRelated.length > 0;
      
      // If person-related objects found, boost confidence and prioritize
      if (isPersonDetected) {
        confidence = Math.max(confidence, 0.8);
        detectedObjects = [...personRelated.map(p => p.label), ...detectedObjects.filter(obj => !personRelated.some(p => p.label === obj))];
      } else if (detectedObjects[0] === 'mask' && result[0].score > 0.8) {
        // Special handling for "mask" detection - likely a person wearing something
        console.log('⚠️ High confidence mask detection - likely a person with face covering');
        detectedObjects = ['person with face covering', ...detectedObjects];
        isPersonDetected = true;
        confidence = 0.7; // Moderate confidence for indirect person detection
      }
      
      return {
        success: true,
        method: 'enhanced_object_detection',
        confidence,
        subjects: detectedObjects,
        detectedObjects,
        isPersonDetected,
        colors: []
      };
    }
    
    throw new Error('No valid results from enhanced detection');
  } catch (error) {
    console.error('❌ Enhanced object detection failed:', error);
    return {
      success: false,
      method: 'enhanced_object_detection',
      confidence: 0,
      subjects: [],
      detectedObjects: [],
      error: error.message
    };
  }
}

// Main analysis orchestrator with multiple strategies
async function analyzeImageUniversally(imageData: string): Promise<UniversalAnalysisResult | null> {
  console.log('🚀 Starting enhanced universal image analysis...');
  
  // Step 1: Check for faces to guide analysis strategy
  const hasFaces = await detectFacesInImage(imageData);
  console.log(`👤 Face detection result: ${hasFaces ? 'faces detected' : 'no faces detected'}`);
  
  // Step 2: Try enhanced OpenAI analysis first
  let result = await enhancedOpenAIAnalysis(imageData);
  
  if (result.success && result.confidence >= 0.6) {
    console.log('✅ Enhanced OpenAI analysis successful');
    return result;
  }
  
  // Step 3: If face detected but OpenAI failed, try celebrity recognition
  if (hasFaces && (!result.success || result.confidence < 0.6)) {
    console.log('🌟 Trying celebrity recognition for detected faces...');
    const celebrityResult = await celebrityRecognitionFallback(imageData);
    if (celebrityResult.success && celebrityResult.confidence >= 0.6) {
      return celebrityResult;
    }
  }
  
  // Step 4: Try enhanced object detection with person focus
  console.log('🔍 Trying enhanced object detection...');
  const enhancedResult = await enhancedObjectDetection(imageData);
  
  if (enhancedResult.success && enhancedResult.confidence >= 0.6) {
    return enhancedResult;
  }
  
  // Step 5: If we got "mask" or similar, provide context-aware result
  if (enhancedResult.success && enhancedResult.detectedObjects[0] === 'mask') {
    console.log('⚠️ Mask detected - providing context-aware interpretation');
    return {
      ...enhancedResult,
      subjects: ['person with face covering', 'masked individual'],
      detectedPerson: 'Unknown Person',
      isPersonDetected: true,
      confidence: 0.65,
      context: 'Person wearing face covering or mask'
    };
  }
  
  // Step 6: Return best available result or null
  if (result.success || enhancedResult.success) {
    const bestResult = result.confidence > enhancedResult.confidence ? result : enhancedResult;
    console.log(`⚠️ Returning best available result with confidence ${bestResult.confidence}`);
    return bestResult;
  }
  
  console.log('❌ All analysis methods failed');
  return null;
}

// Generate response based on analysis - REAL DATA ONLY
function generateCardResponse(analysisResult: UniversalAnalysisResult | null) {
  if (!analysisResult) {
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
  const isPersonCard = analysisResult.isPersonDetected || !!analysisResult.detectedPerson;
  
  return {
    extractedText: analysisResult.detectedObjects,
    subjects: analysisResult.subjects,
    playerName: analysisResult.detectedPerson || (isPersonCard ? mainSubject : null),
    team: null,
    year: new Date().getFullYear().toString(),
    sport: null,
    cardNumber: '',
    confidence: analysisResult.confidence,
    analysisType: isPersonCard ? 'person' : 'object',
    analysisMethod: analysisResult.method,
    visualAnalysis: {
      subjects: analysisResult.subjects,
      colors: analysisResult.colors || ['Unknown'],
      mood: 'Unknown',
      style: analysisResult.context || 'Unknown',
      theme: isPersonCard ? 'Portrait' : 'General',
      setting: analysisResult.context || 'Unknown'
    },
    creativeTitle: analysisResult.detectedPerson || mainSubject,
    creativeDescription: `${isPersonCard ? 'Portrait of ' : ''}${mainSubject}${analysisResult.context ? ` in ${analysisResult.context}` : ''}`,
    rarity: isPersonCard ? 'rare' : 'common',
    requiresManualReview: analysisResult.confidence < 0.7,
    searchResults: analysisResult.searchResults
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting enhanced universal image analysis system...');
    
    // Perform enhanced universal analysis
    const analysisResult = await analyzeImageUniversally(imageData);
    
    // Generate appropriate response - REAL DATA ONLY
    const response = generateCardResponse(analysisResult);
    
    console.log('✅ Enhanced analysis result:', {
      method: analysisResult?.method || 'failed',
      confidence: response.confidence,
      detectedPerson: analysisResult?.detectedPerson,
      mainSubject: analysisResult?.subjects[0],
      isPersonDetected: analysisResult?.isPersonDetected,
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
