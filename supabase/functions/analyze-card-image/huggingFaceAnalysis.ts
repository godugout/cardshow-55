
export async function analyzeImageWithHuggingFace(imageData: string) {
  const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
  
  if (!HUGGING_FACE_API_KEY) {
    console.log('❌ HuggingFace API key not found');
    throw new Error('HuggingFace API key not configured');
  }

  console.log('🔑 HuggingFace API key found, proceeding with analysis');

  try {
    console.log('🔗 Fetching image from URL...');
    const response = await fetch(imageData);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('📊 Image blob size:', blob.size);
    
    console.log('🤖 Calling HuggingFace ResNet-50 API...');
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

    console.log('📡 HuggingFace response status:', hfResponse.status);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error(`❌ HuggingFace API error: ${hfResponse.status}`);
      console.error('HuggingFace error details:', errorText);
      throw new Error(`HuggingFace API error: ${hfResponse.status} - ${errorText}`);
    }

    const result = await hfResponse.json();
    console.log('🎯 HuggingFace raw result:', result);

    if (!Array.isArray(result) || result.length === 0) {
      console.log('⚠️ No valid detection results from HuggingFace');
      return [];
    }

    // Filter and process results
    const detectedObjects = result
      .filter((item: any) => item.score > 0.1) // Higher threshold for better quality
      .map((item: any) => {
        // Clean up the label - take the first part before comma
        const cleanLabel = item.label.split(',')[0].trim().toLowerCase();
        console.log(`✅ Detected: "${cleanLabel}" (confidence: ${item.score.toFixed(3)})`);
        return cleanLabel;
      })
      .slice(0, 5); // Take top 5 results

    console.log('🔍 Final detected objects:', detectedObjects);
    return detectedObjects;
    
  } catch (error) {
    console.error('❌ HuggingFace analysis error:', error);
    throw error; // Re-throw to be handled by caller
  }
}
