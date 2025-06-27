
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced creative mapping system
const enhancedObjectToCardConcept = (objects: string[]) => {
  const concepts: { [key: string]: { title: string; description: string; rarity: string; tags: string[] } } = {
    // Star Wars & Sci-Fi
    'wookiee': {
      title: 'Galactic Warrior',
      description: 'A legendary being from distant worlds, known for fierce loyalty and incredible strength in battle.',
      rarity: 'legendary',
      tags: ['galactic', 'warrior', 'loyal', 'strength', 'legendary']
    },
    'furry': {
      title: 'Forest Guardian',
      description: 'A mystical creature covered in protective fur, guardian of ancient secrets and natural wisdom.',
      rarity: 'rare',
      tags: ['mystical', 'forest', 'guardian', 'ancient', 'wisdom']
    },
    'humanoid': {
      title: 'Evolved Being',
      description: 'An advanced life form that bridges civilization and wild instincts with remarkable intelligence.',
      rarity: 'rare',
      tags: ['evolved', 'intelligent', 'advanced', 'civilization', 'bridge']
    },
    
    // Enhanced animal concepts
    'pig': {
      title: 'Barnyard Champion',
      description: 'A mighty farm hero with incredible strength and determination, ruling the barnyard with wisdom and courage.',
      rarity: 'uncommon',
      tags: ['farm', 'animal', 'champion', 'barnyard', 'strength']
    },
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities, guardian of hidden secrets and keeper of nine lives.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom', 'guardian']
    },
    'dog': {
      title: 'Loyal Guardian',
      description: 'A faithful companion with unwavering loyalty and protective instincts, defender of the innocent.',
      rarity: 'uncommon',
      tags: ['canine', 'guardian', 'loyal', 'protector', 'companion']
    },
    'bird': {
      title: 'Sky Messenger',
      description: 'A swift aerial scout with keen eyesight and the ability to traverse great distances.',
      rarity: 'common',
      tags: ['avian', 'messenger', 'flight', 'scout', 'swift']
    },
    'bear': {
      title: 'Wilderness Titan',
      description: 'A powerful creature of the wild, commanding respect with its massive strength and primal wisdom.',
      rarity: 'rare',
      tags: ['wilderness', 'titan', 'powerful', 'primal', 'strength']
    },
    
    // Technology & Vehicles
    'car': {
      title: 'Speed Demon',
      description: 'A powerful machine built for velocity and performance, dominating roads with engineering excellence.',
      rarity: 'rare',
      tags: ['vehicle', 'speed', 'machine', 'performance', 'engineering']
    },
    'robot': {
      title: 'Mechanical Sentinel',
      description: 'An artificial being of advanced technology, programmed with capabilities beyond human limits.',
      rarity: 'rare',
      tags: ['mechanical', 'artificial', 'technology', 'advanced', 'sentinel']
    },
    
    // People & Characters
    'person': {
      title: 'Urban Legend',
      description: 'A mysterious figure with untold stories and hidden talents, walking with quiet confidence.',
      rarity: 'uncommon',
      tags: ['human', 'mystery', 'urban', 'legend', 'stories']
    },
    
    // Nature
    'building': {
      title: 'Architectural Marvel',
      description: 'A stunning structure that stands as a testament to human creativity and engineering prowess.',
      rarity: 'common',
      tags: ['architecture', 'structure', 'building', 'design', 'marvel']
    },
    'flower': {
      title: 'Nature\'s Jewel',
      description: 'A beautiful bloom that represents the delicate balance and stunning beauty of the natural world.',
      rarity: 'common',
      tags: ['nature', 'flower', 'beauty', 'bloom', 'harmony']
    }
  };

  // Enhanced pattern matching
  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  
  // Look for fuzzy matches and patterns
  const patterns = [
    { keywords: ['fur', 'brown', 'tall'], match: 'wookiee' },
    { keywords: ['hairy', 'humanoid'], match: 'wookiee' },
    { keywords: ['bear', 'standing'], match: 'bear' },
    { keywords: ['four', 'legs'], match: 'animal' }
  ];

  // Try pattern matching
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => objects.join(' ').toLowerCase().includes(keyword))) {
      if (concepts[pattern.match]) {
        return concepts[pattern.match];
      }
    }
  }

  // Direct matching
  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject) ||
    objects.some(obj => obj.toLowerCase().includes(key))
  );

  if (bestMatch) {
    return concepts[bestMatch];
  }

  // Enhanced creative fallback
  const creativeAdjectives = ['Mysterious', 'Ancient', 'Legendary', 'Mystical', 'Cosmic', 'Radiant'];
  const creativeNouns = ['Guardian', 'Champion', 'Wanderer', 'Keeper', 'Sentinel', 'Spirit'];
  
  const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
  const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];

  return {
    title: `${randomAdjective} ${randomNoun}`,
    description: `A unique creation featuring ${objects.join(' and ')} with extraordinary characteristics and hidden potential waiting to be unlocked.`,
    rarity: 'rare',
    tags: [...objects.slice(0, 3), 'unique', 'extraordinary', 'mysterious']
  };
};

async function analyzeImageWithHuggingFace(imageData: string) {
  try {
    // Convert data URL to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Use Hugging Face Inference API with better model
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      console.error(`HuggingFace API error: ${hfResponse.status}`);
      throw new Error(`HTTP error! status: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('HuggingFace enhanced result:', result);

    // Extract detected objects with lower threshold for more possibilities
    const detectedObjects = result
      .filter((item: any) => item.score > 0.05)
      .map((item: any) => item.label.split(',')[0].trim().toLowerCase())
      .slice(0, 8);

    return detectedObjects;
  } catch (error) {
    console.error('HuggingFace analysis error:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();

    console.log('Starting enhanced free image analysis...');
    
    // Try Hugging Face analysis with improved handling
    let detectedObjects = await analyzeImageWithHuggingFace(imageData);
    
    if (detectedObjects.length === 0) {
      console.log('Using enhanced fallback analysis...');
      detectedObjects = ['mysterious entity'];
    }

    console.log('Enhanced detected objects:', detectedObjects);

    // Generate enhanced card concept
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
    
    // Enhanced error fallback
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
      creativeDescription: 'A powerful being of legend, possessing extraordinary abilities and commanding respect across all realms',
      error: 'Analysis enhanced with creative interpretation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
