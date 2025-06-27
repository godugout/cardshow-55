
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced web search using DuckDuckGo
async function searchDuckDuckGo(query: string) {
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' trading card')}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    return {
      abstract: data.Abstract || '',
      abstractText: data.AbstractText || '',
      infobox: data.Infobox || {},
      relatedTopics: data.RelatedTopics || []
    };
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return null;
  }
}

// Enhanced AI generation that works with both traditional and visual analysis
async function generateEnhancedCardInfo(extractedData: any, searchResults: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const isVisualAnalysis = extractedData.analysisType === 'visual' || extractedData.analysisType === 'fallback';
  
  let prompt;
  if (isVisualAnalysis) {
    prompt = `Create an engaging trading card from this visual analysis:

Visual Analysis: ${JSON.stringify(extractedData.visualAnalysis)}
Suggested Title: ${extractedData.creativeTitle}
Suggested Description: ${extractedData.creativeDescription}
Analysis Type: ${extractedData.analysisType}

Generate a JSON response with:
- title: Creative, engaging card title based on visual content
- description: Rich description (2-3 sentences) highlighting the visual elements and creating intrigue
- rarity: Choose based on visual appeal and uniqueness [common, uncommon, rare, ultra-rare, legendary]
- tags: Array of relevant tags based on subjects, colors, mood, and theme
- type: Card category (Character, Landscape, Abstract, Object, Portrait, etc.)
- series: Creative series name that groups similar visual themes
- confidence: 0.7-0.9 for visual analysis (we're being creative)

Make it sound like a real, collectible trading card with engaging flavor text.`;
  } else {
    prompt = `Based on the following extracted card data and web search results, generate detailed trading card information:

Extracted Data: ${JSON.stringify(extractedData)}
Search Results: ${JSON.stringify(searchResults)}

Generate a JSON response with:
- title: Descriptive card title
- description: Detailed card description
- rarity: one of [common, uncommon, rare, ultra-rare, legendary]
- tags: array of relevant tags
- type: card type/category
- series: series or set name
- confidence: confidence score (0-1)

Focus on creating realistic, specific information based on the available data.`;
  }

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
          content: isVisualAnalysis 
            ? 'You are a creative trading card designer who turns any image into an engaging collectible card concept. Be imaginative and create compelling narratives.'
            : 'You are a trading card expert. Generate accurate, detailed card information based on available data.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: isVisualAnalysis ? 0.7 : 0.4
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, extractedData } = await req.json();

    // Determine search strategy based on analysis type
    let searchResults = null;
    if (extractedData.analysisType === 'traditional' && query) {
      searchResults = await searchDuckDuckGo(query);
    }
    
    // Generate enhanced card information using AI
    const cardInfoResponse = await generateEnhancedCardInfo(extractedData, searchResults);
    
    let cardInfo;
    try {
      cardInfo = JSON.parse(cardInfoResponse);
    } catch {
      // Enhanced fallback that creates engaging content
      const subjects = extractedData.visualAnalysis?.subjects || ['Unknown'];
      const mood = extractedData.visualAnalysis?.mood || 'Mysterious';
      const theme = extractedData.visualAnalysis?.theme || 'General';
      
      cardInfo = {
        title: `${subjects[0]} - ${mood} ${theme}`,
        description: `A captivating card featuring ${subjects.join(' and ')} with a ${mood.toLowerCase()} atmosphere. This unique piece captures the essence of ${theme.toLowerCase()} imagery in trading card form.`,
        rarity: extractedData.confidence > 0.7 ? 'rare' : 'uncommon',
        tags: [...subjects, mood.toLowerCase(), theme.toLowerCase(), 'creative', 'unique'],
        type: extractedData.visualAnalysis?.style || 'Creative',
        series: `${theme} Collection`,
        confidence: Math.max(extractedData.confidence, 0.6)
      };
    }

    // Ensure minimum confidence for visual analysis
    if (extractedData.analysisType === 'visual' && cardInfo.confidence < 0.6) {
      cardInfo.confidence = 0.6;
    }

    return new Response(JSON.stringify({
      success: true,
      cardInfo,
      analysisType: extractedData.analysisType,
      searchResults: searchResults ? {
        hasResults: true,
        abstract: searchResults.abstract,
        relatedTopics: searchResults.relatedTopics.slice(0, 3)
      } : { hasResults: false }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-card-info function:', error);
    
    // Even in error cases, return something creative and usable
    return new Response(JSON.stringify({
      success: true,
      cardInfo: {
        title: 'Mysterious Discovery',
        description: 'An enigmatic card that captures the essence of the unknown. Sometimes the most interesting cards are those that leave room for imagination.',
        rarity: 'uncommon',
        tags: ['mystery', 'discovery', 'unique', 'creative'],
        type: 'Mystery',
        series: 'Unknown Origins',
        confidence: 0.5
      },
      analysisType: 'fallback',
      searchResults: { hasResults: false },
      note: 'Generated creative fallback due to processing error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
