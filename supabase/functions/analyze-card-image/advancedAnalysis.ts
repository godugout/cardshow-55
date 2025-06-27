
export async function analyzeWithCLIP(imageData: string) {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    throw new Error('HuggingFace API key not configured');
  }

  try {
    console.log('🎯 Running CLIP analysis for scene understanding...');
    
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/openai/clip-vit-large-patch14",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`CLIP API error: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('🎯 CLIP raw result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ CLIP analysis error:', error);
    throw error;
  }
}

export async function analyzeWithBLIP(imageData: string) {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    throw new Error('HuggingFace API key not configured');
  }

  try {
    console.log('📝 Running BLIP image captioning...');
    
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`BLIP API error: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('📝 BLIP caption result:', result);
    
    // Extract caption text
    const caption = result[0]?.generated_text || '';
    return caption;
  } catch (error) {
    console.error('❌ BLIP analysis error:', error);
    throw error;
  }
}

export async function analyzeWithOpenAIVision(imageData: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    console.log('👁️ Running OpenAI Vision analysis...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify any characters, objects, or notable elements. If you recognize any specific characters (like from Star Wars, Marvel, DC, movies, TV shows, etc.), please name them specifically. Describe what you see in detail.'
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
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI Vision API error: ${response.status}`);
    }

    const result = await response.json();
    const description = result.choices[0]?.message?.content || '';
    
    console.log('👁️ OpenAI Vision result:', description);
    return description;
  } catch (error) {
    console.error('❌ OpenAI Vision analysis error:', error);
    throw error;
  }
}
