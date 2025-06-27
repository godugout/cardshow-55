
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { runMultiModalAnalysis } from './multiModalAnalyzer.ts';

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
    console.log('🚀 Starting advanced multi-modal image analysis...');
    
    // Run the advanced analysis
    const analysisResult = await runMultiModalAnalysis(imageData);
    
    console.log('🎯 Final analysis result:', analysisResult);
    
    // Format response for compatibility with existing code
    const extractionResult = {
      extractedText: analysisResult.detectedObjects,
      subjects: analysisResult.detectedObjects,
      playerName: analysisResult.title,
      team: analysisResult.category === 'star_wars' ? 'Galactic Empire' : 
            analysisResult.category === 'marvel' ? 'Marvel Universe' :
            analysisResult.category === 'dc' ? 'DC Universe' : 'Legendary Collection',
      year: new Date().getFullYear().toString(),
      sport: analysisResult.category === 'star_wars' ? 'Star Wars' :
             analysisResult.category === 'marvel' ? 'Marvel' :
             analysisResult.category === 'dc' ? 'DC Comics' : 'Fantasy',
      cardNumber: '',
      confidence: analysisResult.confidence,
      analysisType: 'visual' as const,
      analysisMethod: analysisResult.analysisMethod,
      visualAnalysis: {
        subjects: analysisResult.detectedObjects,
        colors: ['Mixed'],
        mood: analysisResult.category === 'star_wars' ? 'Epic' : 'Heroic',
        style: 'Cinematic',
        theme: analysisResult.category || 'Adventure',
        setting: analysisResult.category === 'star_wars' ? 'Galaxy Far Far Away' :
                analysisResult.category === 'marvel' ? 'Marvel Universe' : 'Fantasy Realm'
      },
      creativeTitle: analysisResult.title,
      creativeDescription: analysisResult.description,
      rarity: analysisResult.rarity || 'uncommon'
    };

    console.log('✅ Advanced analysis complete:', extractionResult);

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in advanced image analysis:', error);
    
    return new Response(JSON.stringify({
      extractedText: ['mysterious_entity'],
      subjects: ['mysterious_entity'],
      playerName: 'Mysterious Entity',
      team: 'Unknown Realm',
      year: new Date().getFullYear().toString(),
      sport: 'Fantasy',
      cardNumber: '',
      confidence: 0.3,
      analysisType: 'fallback',
      analysisMethod: 'error_fallback',
      visualAnalysis: {
        subjects: ['Mysterious Entity'],
        colors: ['Unknown'],
        mood: 'Mysterious',
        style: 'Enigmatic',
        theme: 'Mystery',
        setting: 'Unknown Realm'
      },
      creativeTitle: 'Mysterious Entity',
      creativeDescription: 'An enigmatic presence with unknown origins and hidden powers.',
      error: 'Analysis failed, using creative interpretation',
      rarity: 'common'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
