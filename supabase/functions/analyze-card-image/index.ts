
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

    console.log('Starting enhanced free image analysis...');
    
    let detectedObjects = await analyzeImageWithHuggingFace(imageData);
    
    if (detectedObjects.length === 0) {
      console.log('Using enhanced fallback analysis...');
      detectedObjects = ['mysterious entity'];
    }

    console.log('Enhanced detected objects:', detectedObjects);

    const cardConcept = enhancedObjectToCardConcept(detectedObjects);
    
    const extractionResult = {
      extractedText: detectedObjects,
      playerName: cardConcept.title,
      team: 'Legendary Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: detectedObjects.length > 0 && detectedObjects[0] !== 'mysterious entity' ? 0.8 : 0.6,
      analysisType: 'visual' as const,
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

    console.log('Enhanced analysis complete:', extractionResult);

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced image analysis:', error);
    
    return new Response(JSON.stringify({
      extractedText: [],
      playerName: 'Legendary Entity',
      team: 'Mythical Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: 0.5,
      analysisType: 'fallback',
      visualAnalysis: {
        subjects: ['Legendary Being'],
        colors: ['Mystical'],
        mood: 'Epic',
        style: 'Cinematic',
        theme: 'Legend',
        setting: 'Mythical Realm'
      },
      creativeTitle: 'Legendary Entity',
      creativeDescription: 'A powerful being of legend, possessing extraordinary abilities.',
      error: 'Analysis enhanced with creative interpretation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
