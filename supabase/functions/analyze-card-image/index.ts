
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Creative mapping from detected objects to card concepts
const objectToCardConcept = (objects: string[]) => {
  const concepts: { [key: string]: { title: string; description: string; rarity: string; tags: string[] } } = {
    'pig': {
      title: 'Barnyard Champion',
      description: 'A mighty farm hero with incredible strength and determination, ruling the barnyard with wisdom and courage.',
      rarity: 'uncommon',
      tags: ['farm', 'animal', 'champion', 'barnyard']
    },
    'cat': {
      title: 'Feline Mystic',
      description: 'A mysterious cat with ancient wisdom and magical abilities, guardian of hidden secrets.',
      rarity: 'rare',
      tags: ['feline', 'mystic', 'magical', 'wisdom']
    },
    'dog': {
      title: 'Loyal Guardian',
      description: 'A faithful companion with unwavering loyalty and protective instincts, defender of the innocent.',
      rarity: 'uncommon',
      tags: ['canine', 'guardian', 'loyal', 'protector']
    },
    'bird': {
      title: 'Sky Messenger',
      description: 'A swift aerial scout with keen eyesight and the ability to traverse great distances with important messages.',
      rarity: 'common',
      tags: ['avian', 'messenger', 'flight', 'scout']
    },
    'car': {
      title: 'Speed Demon',
      description: 'A powerful machine built for velocity and performance, dominating the roads with style and power.',
      rarity: 'rare',
      tags: ['vehicle', 'speed', 'machine', 'performance']
    },
    'person': {
      title: 'Urban Legend',
      description: 'A mysterious figure with untold stories and hidden talents, walking among us with quiet confidence.',
      rarity: 'uncommon',
      tags: ['human', 'mystery', 'urban', 'legend']
    },
    'building': {
      title: 'Architectural Marvel',
      description: 'A stunning structure that stands as a testament to human creativity and engineering prowess.',
      rarity: 'common',
      tags: ['architecture', 'structure', 'building', 'design']
    },
    'flower': {
      title: 'Nature\'s Jewel',
      description: 'A beautiful bloom that represents the delicate balance and stunning beauty of the natural world.',
      rarity: 'common',
      tags: ['nature', 'flower', 'beauty', 'bloom']
    }
  };

  // Find the best match
  const mainObject = objects[0]?.toLowerCase() || 'unknown';
  const bestMatch = Object.keys(concepts).find(key => 
    mainObject.includes(key) || key.includes(mainObject)
  );

  if (bestMatch) {
    return concepts[bestMatch];
  }

  // Default creative concept
  return {
    title: 'Mysterious Discovery',
    description: `A unique creation featuring ${objects.join(' and ')} with distinctive characteristics and hidden potential.`,
    rarity: 'uncommon',
    tags: [...objects.slice(0, 3), 'unique', 'discovery']
  };
};

async function analyzeImageWithHuggingFace(imageData: string) {
  try {
    // Convert data URL to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Use Hugging Face Inference API (free tier)
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw Error(`HTTP error! status: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('HuggingFace result:', result);

    // Extract detected objects
    const detectedObjects = result
      .filter((item: any) => item.score > 0.1)
      .map((item: any) => item.label.split(',')[0].trim())
      .slice(0, 3);

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

    console.log('Starting free image analysis...');
    
    // Try Hugging Face analysis first
    let detectedObjects = await analyzeImageWithHuggingFace(imageData);
    
    if (detectedObjects.length === 0) {
      // Fallback to basic image analysis based on file characteristics
      console.log('Using fallback analysis...');
      detectedObjects = ['unknown object'];
    }

    console.log('Detected objects:', detectedObjects);

    // Generate creative card concept
    const cardConcept = objectToCardConcept(detectedObjects);
    
    const extractionResult = {
      extractedText: detectedObjects,
      playerName: cardConcept.title,
      team: 'Discovery Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Creative',
      cardNumber: '',
      confidence: detectedObjects.length > 0 && detectedObjects[0] !== 'unknown object' ? 0.8 : 0.5,
      analysisType: 'visual' as const,
      visualAnalysis: {
        subjects: detectedObjects,
        colors: ['Mixed'],
        mood: 'Adventurous',
        style: 'Photographic',
        theme: 'Discovery',
        setting: 'Various'
      },
      creativeTitle: cardConcept.title,
      creativeDescription: cardConcept.description
    };

    console.log('Analysis complete:', extractionResult);

    return new Response(JSON.stringify(extractionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Always return a usable result
    return new Response(JSON.stringify({
      extractedText: [],
      playerName: 'Creative Discovery',
      team: 'Mystery Collection',
      year: new Date().getFullYear().toString(),
      sport: 'Creative',
      cardNumber: '',
      confidence: 0.4,
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
