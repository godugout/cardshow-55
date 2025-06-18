
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
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify(getDefaultCardData()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!imageData) {
      throw new Error('No image data provided');
    }

    console.log('Analyzing card image with OpenAI GPT-4o-mini...');

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
            content: `You are an expert trading card analyzer. Analyze the uploaded image and provide detailed card metadata in JSON format.

Focus on identifying:
1. Main subject/character (person, creature, object, etc.)
2. Visual style and artistic elements (realistic, cartoon, anime, vintage, modern, etc.)
3. Colors, themes, and mood
4. Any text visible in the image
5. Quality and rarity assessment based on visual appeal
6. Appropriate categorization

Return ONLY valid JSON with these exact fields:
{
  "title": "Descriptive card title (max 60 chars)",
  "description": "Detailed description of what's shown (100-200 chars)",
  "rarity": "common|uncommon|rare|epic|legendary",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Character|Creature|Vehicle|Artifact|Scene|Sports|Entertainment",
  "type": "Trading Card type based on content",
  "series": "Suggested series name"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this trading card image and provide comprehensive metadata:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI');
    }

    const aiResponse = data.choices[0].message.content;
    console.log('OpenAI response:', aiResponse);
    
    // Try to parse JSON response
    let analysisResult;
    try {
      // Clean the response in case there's extra text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      analysisResult = JSON.parse(jsonString);
      
      // Validate and sanitize the response
      analysisResult = {
        title: String(analysisResult.title || 'Custom Trading Card').substring(0, 60),
        description: String(analysisResult.description || 'A unique collectible card with distinctive artwork and design.').substring(0, 200),
        rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(analysisResult.rarity) 
          ? analysisResult.rarity : 'common',
        tags: Array.isArray(analysisResult.tags) 
          ? analysisResult.tags.slice(0, 5).filter(tag => typeof tag === 'string')
          : ['custom', 'trading-card'],
        category: String(analysisResult.category || 'Character'),
        type: String(analysisResult.type || 'Character'),
        series: String(analysisResult.series || 'Custom Collection')
      };
      
      console.log('Parsed analysis result:', analysisResult);
      
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // Create structured response from text
      analysisResult = generateFallbackFromText(aiResponse);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Return enhanced default values on error
    const defaultResponse = getDefaultCardData();
    
    return new Response(JSON.stringify(defaultResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getDefaultCardData() {
  const variations = [
    {
      title: 'Legendary Trading Card',
      description: 'A premium collectible card featuring unique artwork and exceptional design elements that make it stand out.',
      rarity: 'rare',
      tags: ['legendary', 'premium', 'collectible'],
      series: 'Elite Collection'
    },
    {
      title: 'Custom Character Card',
      description: 'An original character card with distinctive visual appeal and artistic craftsmanship.',
      rarity: 'uncommon',
      tags: ['character', 'original', 'custom'],
      series: 'Custom Series'
    },
    {
      title: 'Unique Collectible',
      description: 'A special edition trading card with creative design and premium finishing.',
      rarity: 'rare',
      tags: ['unique', 'special-edition', 'premium'],
      series: 'Collector\'s Choice'
    }
  ];
  
  const selected = variations[Math.floor(Math.random() * variations.length)];
  
  return {
    ...selected,
    category: 'Character',
    type: 'Character'
  };
}

function generateFallbackFromText(text: string): any {
  // Extract information from unstructured AI response
  const lowerText = text.toLowerCase();
  
  // Determine rarity based on keywords
  let rarity = 'common';
  if (lowerText.includes('legendary') || lowerText.includes('epic')) rarity = 'legendary';
  else if (lowerText.includes('rare') || lowerText.includes('special')) rarity = 'rare';
  else if (lowerText.includes('uncommon') || lowerText.includes('unique')) rarity = 'uncommon';
  
  // Extract potential tags
  const potentialTags = [];
  const tagKeywords = ['character', 'creature', 'fantasy', 'realistic', 'anime', 'cartoon', 'vintage', 'modern', 'colorful', 'dark', 'bright'];
  tagKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) potentialTags.push(keyword);
  });
  
  // Ensure we have at least 2 tags
  if (potentialTags.length < 2) {
    potentialTags.push('custom', 'trading-card');
  }
  
  return {
    title: 'AI-Analyzed Trading Card',
    description: text.substring(0, 180) + (text.length > 180 ? '...' : ''),
    rarity,
    tags: potentialTags.slice(0, 4),
    category: 'Character',
    type: 'Character',
    series: 'AI Collection'
  };
}
