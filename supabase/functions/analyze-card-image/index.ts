
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { enhancedObjectToCardConcept } from './creativeMapping.ts';
import { analyzeImageWithHuggingFace } from './huggingFaceAnalysis.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    console.log('🚀 Starting enhanced image analysis...');
    
    let detectedObjects: string[] = [];
    let analysisMethod = 'fallback';
    let confidence = 0.3;
    
    // Try HuggingFace analysis
    try {
      detectedObjects = await analyzeImageWithHuggingFace(imageData);
      
      if (detectedObjects.length > 0) {
        analysisMethod = 'huggingface_resnet50';
        confidence = 0.8;
        console.log('✅ HuggingFace analysis successful');
      } else {
        console.log('⚠️ HuggingFace returned no objects');
      }
    } catch (error) {
      console.error('❌ HuggingFace analysis failed:', error.message);
      // Continue with fallback
    }
    
    // Fallback if no objects detected
    if (detectedObjects.length === 0) {
      console.log('🔄 Using intelligent fallback...');
      detectedObjects = ['unique_creation'];
      analysisMethod = 'intelligent_fallback';
      confidence = 0.4;
    }

    console.log('🎯 Using detected objects for card generation:', detectedObjects);

    // Generate card concept from the detected objects
    const cardConcept = enhancedObjectToCardConcept(detectedObjects);
    
    const extractionResult = {
      extractedText: detectedObjects,
      subjects: detectedObjects,
      playerName: cardConcept.title,
      team: 'Legendary Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: confidence,
      analysisType: 'visual' as const,
      analysisMethod: analysisMethod,
      visualAnalysis: {
        subjects: detectedObjects,
        colors: ['Mixed'],
        mood: 'Epic',
        style: 'Cinematic',
        theme: 'Adventure',
        setting: 'Fantasy Realm'
      },
      creativeTitle: cardConcept.title,
      creativeDescription: cardConcept.description
    };

    console.log('✅ Enhanced analysis complete:', extractionResult);

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in enhanced image analysis:', error);
    
    return new Response(JSON.stringify({
      extractedText: ['artistic_creation'],
      subjects: ['artistic_creation'],
      playerName: 'Artistic Creation',
      team: 'Creative Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: 0.3,
      analysisType: 'fallback',
      analysisMethod: 'error_fallback',
      visualAnalysis: {
        subjects: ['Artistic Creation'],
        colors: ['Vibrant'],
        mood: 'Creative',
        style: 'Artistic',
        theme: 'Creativity',
        setting: 'Studio'
      },
      creativeTitle: 'Artistic Creation',
      creativeDescription: 'A unique artistic creation with distinctive characteristics.',
      error: 'Analysis failed, using creative interpretation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
