
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
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' character creature')}&format=json&no_html=1&skip_disambig=1`;
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

// Enhanced AI generation with better creative prompts
async function generateEnhancedCardInfo(extractedData: any, searchResults: any) {
  if (!openAIApiKey) {
    console.log('No OpenAI key - using enhanced creative generation');
    return generateCreativeCardInfo(extractedData);
  }

  const isVisualAnalysis = extractedData.analysisType === 'visual' || extractedData.analysisType === 'fallback';
  
  let prompt;
  if (isVisualAnalysis) {
    const subjects = extractedData.visualAnalysis?.subjects || extractedData.extractedText || ['unknown'];
    const mainSubject = subjects[0] || 'mysterious being';
    
    prompt = `Create an epic trading card from this visual analysis:

Main Subject: ${mainSubject}
All Detected Elements: ${subjects.join(', ')}
Suggested Title: ${extractedData.creativeTitle || 'Unknown Entity'}
Current Description: ${extractedData.creativeDescription || 'A mysterious being'}
Analysis Type: ${extractedData.analysisType}
Mood: ${extractedData.visualAnalysis?.mood || 'Epic'}
Theme: ${extractedData.visualAnalysis?.theme || 'Adventure'}

Generate a JSON response with:
- title: Epic, engaging card title that captures the essence of the subject (consider Star Wars, fantasy, sci-fi themes if applicable)
- description: Rich, compelling description (2-3 sentences) that tells a story and creates intrigue
- rarity: Choose based on epicness and uniqueness [common, uncommon, rare, ultra-rare, legendary]
- tags: Array of relevant tags based on subjects, themes, and genre
- type: Card category (Character, Creature, Warrior, Guardian, Mystic, etc.)
- series: Creative series name that groups similar themed cards
- confidence: 0.7-0.9 for visual analysis

Make it sound like a premium collectible trading card with engaging lore and personality.`;
  } else {
    prompt = `Based on the following data, generate detailed trading card information:

Extracted Data: ${JSON.stringify(extractedData)}
Search Results: ${JSON.stringify(searchResults)}

Generate a JSON response with comprehensive card details focusing on creating an engaging, collectible card experience.`;
  }

  try {
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
              ? 'You are an expert trading card designer specializing in creating epic, engaging cards from any subject. You excel at recognizing pop culture references, fantasy themes, and sci-fi elements. Be creative and compelling.'
              : 'You are a trading card expert. Generate accurate, detailed card information based on available data.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: isVisualAnalysis ? 0.8 : 0.4
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI generation failed:', error);
    return generateCreativeCardInfo(extractedData);
  }
}

function generateCreativeCardInfo(extractedData: any) {
  const subjects = extractedData.visualAnalysis?.subjects || extractedData.extractedText || ['mysterious entity'];
  const mainSubject = subjects[0] || 'mysterious entity';
  const mood = extractedData.visualAnalysis?.mood || 'Epic';
  const theme = extractedData.visualAnalysis?.theme || 'Adventure';
  
  // Enhanced creative generation based on detected subjects
  let cardInfo;
  
  if (mainSubject.includes('wookiee') || mainSubject.includes('chewbacca')) {
    cardInfo = {
      title: 'Galactic Guardian',
      description: 'A legendary warrior from the forest moon, known throughout the galaxy for unwavering loyalty and incredible strength. This mighty being has stood alongside heroes in the greatest battles of all time.',
      rarity: 'legendary',
      tags: ['galactic', 'warrior', 'loyal', 'strength', 'legendary', 'star-wars'],
      type: 'Legendary Warrior',
      series: 'Galactic Heroes',
      confidence: 0.85
    };
  } else if (mainSubject.includes('bear') || mainSubject.includes('furry')) {
    cardInfo = {
      title: 'Primal Guardian',
      description: `A powerful ${mainSubject} creature with ancient wisdom and fierce protective instincts. This majestic being commands respect from all who encounter its mighty presence.`,
      rarity: 'rare',
      tags: ['primal', 'guardian', 'ancient', 'wisdom', 'powerful'],
      type: 'Beast Guardian',
      series: 'Primal Forces',
      confidence: 0.75
    };
  } else {
    // Generic but creative fallback
    const epicAdjectives = ['Legendary', 'Mythical', 'Ancient', 'Cosmic', 'Ethereal', 'Radiant'];
    const epicNouns = ['Guardian', 'Champion', 'Sentinel', 'Warrior', 'Keeper', 'Oracle'];
    
    const adjective = epicAdjectives[Math.floor(Math.random() * epicAdjectives.length)];
    const noun = epicNouns[Math.floor(Math.random() * epicNouns.length)];
    
    cardInfo = {
      title: `${adjective} ${noun}`,
      description: `A remarkable entity embodying the essence of ${subjects.join(' and ')}. With a ${mood.toLowerCase()} presence and ${theme.toLowerCase()} spirit, this being possesses extraordinary abilities that inspire awe and wonder.`,
      rarity: 'rare',
      tags: [...subjects.slice(0, 3), adjective.toLowerCase(), noun.toLowerCase(), 'extraordinary'],
      type: `${adjective} Being`,
      series: `${theme} Collection`,
      confidence: 0.7
    };
  }

  return JSON.stringify(cardInfo);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, extractedData } = await req.json();

    console.log('Enhanced search-card-info processing:', { query, extractedData });

    // Determine search strategy based on analysis type
    let searchResults = null;
    if (extractedData.analysisType === 'traditional' && query) {
      searchResults = await searchDuckDuckGo(query);
    }
    
    // Generate enhanced card information using AI or creative fallback
    const cardInfoResponse = await generateEnhancedCardInfo(extractedData, searchResults);
    
    let cardInfo;
    try {
      cardInfo = JSON.parse(cardInfoResponse);
    } catch (parseError) {
      console.log('JSON parse failed, using creative generation:', parseError);
      cardInfo = JSON.parse(generateCreativeCardInfo(extractedData));
    }

    // Ensure minimum confidence for visual analysis
    if (extractedData.analysisType === 'visual' && cardInfo.confidence < 0.6) {
      cardInfo.confidence = 0.7;
    }

    console.log('Enhanced card info generated:', cardInfo);

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
    console.error('Error in enhanced search-card-info function:', error);
    
    // Enhanced error fallback
    return new Response(JSON.stringify({
      success: true,
      cardInfo: {
        title: 'Epic Discovery',
        description: 'A fascinating entity that defies conventional understanding, possessing unique characteristics that make it truly one-of-a-kind. This remarkable being holds secrets waiting to be unlocked.',
        rarity: 'rare',
        tags: ['epic', 'discovery', 'unique', 'remarkable', 'mysterious'],
        type: 'Legendary Entity',
        series: 'Mysterious Origins',
        confidence: 0.6
      },
      analysisType: 'enhanced_fallback',
      searchResults: { hasResults: false },
      note: 'Generated enhanced creative interpretation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
