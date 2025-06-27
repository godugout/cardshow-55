
export async function analyzeImageWithHuggingFace(imageData: string): Promise<string[]> {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    console.log('⚠️ HuggingFace API key not configured');
    return ['unknown'];
  }

  try {
    console.log('🤖 Running HuggingFace ResNet-50 analysis...');
    
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        },
        method: "POST",
        body: blob,
      }
    );

    if (!hfResponse.ok) {
      throw new Error(`HuggingFace API error: ${hfResponse.status}`);
    }

    const result = await hfResponse.json();
    console.log('🤖 HuggingFace ResNet-50 result:', result);
    
    // Extract labels from the result
    if (Array.isArray(result) && result.length > 0) {
      return result
        .filter(item => item.score > 0.1) // Filter low confidence results
        .map(item => item.label)
        .slice(0, 10); // Take top 10 results
    }
    
    return ['unknown'];
  } catch (error) {
    console.error('❌ HuggingFace analysis error:', error);
    return ['unknown'];
  }
}
