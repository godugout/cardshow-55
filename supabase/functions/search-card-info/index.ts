
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple web search using DuckDuckGo Instant Answer API (free)
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

// Use AI to generate card information based on extracted data and search results
async function generateCardInfo(extractedData: any, searchResults: any) {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Based on the following extracted card data and web search results, generate detailed trading card information:

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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a trading card expert. Generate accurate, detailed card information based on available data.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.4
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

    // Perform web search
    const searchResults = await searchDuckDuckGo(query);
    
    // Generate enhanced card information using AI
    const cardInfoResponse = await generateCardInfo(extractedData, searchResults);
    
    let cardInfo;
    try {
      cardInfo = JSON.parse(cardInfoResponse);
    } catch {
      // Fallback if JSON parsing fails
      cardInfo = {
        title: `${query} Trading Card`,
        description: `Trading card featuring ${query}`,
        rarity: 'common',
        tags: [query.toLowerCase(), 'trading-card'],
        type: 'Sports',
        series: 'Unknown Series',
        confidence: 0.6
      };
    }

    return new Response(JSON.stringify({
      success: true,
      cardInfo,
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
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      cardInfo: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
