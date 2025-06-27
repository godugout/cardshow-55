
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

    // Use OpenAI Vision to analyze the trading card image
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
            content: `You are an expert trading card analyzer. Analyze the image and extract information about the trading card. Look for:
            - Player/character name
            - Team/franchise
            - Year/set
            - Card number
            - Sport/category
            - Any visible text or logos
            
            Respond with a JSON object containing: extractedText (array of all visible text), playerName, team, year, sport, cardNumber, confidence (0-1).`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this trading card image and extract all relevant information:'
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
        max_tokens: 500,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from AI');
    }

    const aiResponse = data.choices[0].message.content;
    
    // Try to parse JSON response
    let extractionResult;
    try {
      extractionResult = JSON.parse(aiResponse);
    } catch {
      // If JSON parsing fails, create structured response from text
      extractionResult = {
        extractedText: [aiResponse.substring(0, 100)],
        playerName: '',
        team: '',
        year: '',
        sport: '',
        cardNumber: '',
        confidence: 0.5
      };
    }

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to analyze image',
      extractedText: [],
      playerName: '',
      team: '',
      year: '',
      sport: '',
      cardNumber: '',
      confidence: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
