
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced prompt for both text extraction and visual analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert image analyzer that can identify both traditional trading cards AND create trading card concepts from any image. 

            For traditional trading cards: Extract text, player names, teams, years, etc.
            For any other image: Analyze visual content including subjects, colors, mood, style, theme.

            ALWAYS return a JSON object with these fields:
            - extractedText: array of visible text
            - playerName: extracted or inferred subject name
            - team: team/group/category
            - year: year or era if determinable
            - sport: sport/category/theme
            - cardNumber: number if visible
            - confidence: 0-1 for text extraction accuracy
            - analysisType: "traditional" or "visual"
            - visualAnalysis: {
                subjects: array of main subjects/people/objects,
                colors: dominant colors,
                mood: emotional tone,
                style: artistic/photographic style,
                theme: overall theme/concept,
                setting: location/environment
              }
            - creativeTitle: suggested card title
            - creativeDescription: suggested card description`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image for trading card creation. If it\'s a traditional trading card, extract the text. If not, analyze the visual content and suggest creative card concepts:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.4
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from AI');
    }

    const aiResponse = data.choices[0].message.content;
    
    let extractionResult;
    try {
      extractionResult = JSON.parse(aiResponse);
    } catch {
      // Fallback parsing if JSON fails
      extractionResult = {
        extractedText: [aiResponse.substring(0, 50)],
        playerName: 'Unknown Subject',
        team: 'Creative Collection',
        year: new Date().getFullYear().toString(),
        sport: 'Artistic',
        cardNumber: '',
        confidence: 0.3,
        analysisType: 'visual',
        visualAnalysis: {
          subjects: ['Unknown'],
          colors: ['Mixed'],
          mood: 'Neutral',
          style: 'Photographic',
          theme: 'General',
          setting: 'Unknown'
        },
        creativeTitle: 'Unique Card',
        creativeDescription: 'A unique trading card with interesting visual elements'
      };
    }

    // Ensure we always have the required fields
    extractionResult.extractedText = extractionResult.extractedText || [];
    extractionResult.playerName = extractionResult.playerName || extractionResult.visualAnalysis?.subjects?.[0] || 'Unknown Subject';
    extractionResult.confidence = Math.max(extractionResult.confidence || 0, 0.3); // Minimum 30% confidence

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Always return a usable result, never completely fail
    return new Response(JSON.stringify({
      extractedText: [],
      playerName: 'Mystery Card',
      team: 'Unknown Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Creative',
      cardNumber: '',
      confidence: 0.2,
      analysisType: 'fallback',
      visualAnalysis: {
        subjects: ['Unknown'],
        colors: ['Mixed'],
        mood: 'Mysterious',
        style: 'Unknown',
        theme: 'Mystery',
        setting: 'Unknown'
      },
      creativeTitle: 'Mystery Card',
      creativeDescription: 'A unique card with mysterious qualities waiting to be discovered',
      error: 'Analysis failed, using creative fallback'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
