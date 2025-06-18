
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.15.0";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

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

    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return new Response(JSON.stringify(getDefaultCardData()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!imageData) {
      throw new Error('No image data provided');
    }

    console.log('Analyzing card image with Google Gemini Flash 1.5...');

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Extract base64 data from data URL
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    };

    const prompt = `You are an expert trading card analyzer. Analyze this image and provide detailed card metadata in JSON format.

Examine the image for:
1. Main subject/character (person, creature, object, vehicle, etc.)
2. Art style (realistic, cartoon, anime, vintage, modern, fantasy, sci-fi, etc.)
3. Colors, lighting, and visual appeal
4. Any visible text or logos
5. Overall quality and rarity impression
6. Theme or category (sports, entertainment, fantasy, etc.)

Return ONLY valid JSON with these exact fields:
{
  "title": "Creative, descriptive card title (max 60 chars)",
  "description": "Detailed description of image content and style (100-200 chars)",
  "rarity": "common|uncommon|rare|epic|legendary",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "category": "Character|Creature|Vehicle|Artifact|Scene|Sports|Entertainment|Fantasy",
  "type": "Specific card type based on content",
  "series": "Suggested series or collection name"
}

Guidelines:
- Title should be creative and appealing, not just descriptive
- Description should highlight what makes this card special
- Rarity based on visual complexity, appeal, and uniqueness
- Tags should be relevant and searchable (4-5 max)
- Be specific and engaging in your analysis`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response:', text);
    
    // Parse JSON response
    let analysisResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      analysisResult = JSON.parse(jsonString);
      
      // Validate and sanitize
      analysisResult = {
        title: String(analysisResult.title || 'Epic Trading Card').substring(0, 60),
        description: String(analysisResult.description || 'A stunning collectible card with exceptional artwork and unique design elements.').substring(0, 200),
        rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(analysisResult.rarity) 
          ? analysisResult.rarity : 'uncommon',
        tags: Array.isArray(analysisResult.tags) 
          ? analysisResult.tags.slice(0, 5).filter(tag => typeof tag === 'string')
          : ['trading-card', 'collectible'],
        category: String(analysisResult.category || 'Character'),
        type: String(analysisResult.type || 'Character'),
        series: String(analysisResult.series || 'Premium Collection')
      };
      
      console.log('Processed analysis result:', analysisResult);
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.log('Raw Gemini response:', text);
      
      analysisResult = generateFallbackFromText(text);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    
    const defaultResponse = getDefaultCardData();
    
    return new Response(JSON.stringify(defaultResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getDefaultCardData() {
  const variations = [
    {
      title: 'Masterpiece Trading Card',
      description: 'An extraordinary collectible featuring stunning artwork and premium design elements that captivate collectors.',
      rarity: 'rare',
      tags: ['masterpiece', 'premium', 'collectible', 'artwork'],
      series: 'Masterpiece Collection'
    },
    {
      title: 'Legendary Character Card',
      description: 'A powerful character card showcasing exceptional detail and artistic craftsmanship.',
      rarity: 'legendary',
      tags: ['character', 'legendary', 'powerful', 'detailed'],
      series: 'Legend Series'
    },
    {
      title: 'Epic Fantasy Card',
      description: 'A mystical card featuring enchanting imagery and otherworldly design elements.',
      rarity: 'epic',
      tags: ['fantasy', 'mystical', 'enchanting', 'magical'],
      series: 'Fantasy Realm'
    },
    {
      title: 'Unique Collectible',
      description: 'A distinctive trading card with creative design and exceptional visual appeal.',
      rarity: 'uncommon',
      tags: ['unique', 'creative', 'distinctive', 'visual'],
      series: 'Collector\'s Edition'
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
  const lowerText = text.toLowerCase();
  
  // Determine rarity based on keywords
  let rarity = 'uncommon';
  if (lowerText.includes('legendary') || lowerText.includes('epic')) rarity = 'legendary';
  else if (lowerText.includes('rare') || lowerText.includes('special')) rarity = 'rare';
  else if (lowerText.includes('unique') || lowerText.includes('premium')) rarity = 'epic';
  
  // Extract potential tags
  const potentialTags = [];
  const tagKeywords = ['character', 'creature', 'fantasy', 'realistic', 'anime', 'cartoon', 'vintage', 'modern', 'colorful', 'dark', 'bright', 'magical', 'powerful'];
  tagKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) potentialTags.push(keyword);
  });
  
  if (potentialTags.length < 2) {
    potentialTags.push('trading-card', 'collectible');
  }
  
  return {
    title: 'AI-Enhanced Trading Card',
    description: text.substring(0, 180) + (text.length > 180 ? '...' : ''),
    rarity,
    tags: potentialTags.slice(0, 4),
    category: 'Character',
    type: 'Character',
    series: 'AI Collection'
  };
}
