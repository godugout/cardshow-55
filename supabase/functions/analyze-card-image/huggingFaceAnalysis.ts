
export async function analyzeImageWithHuggingFace(imageData: string) {
  try {
    const response = await fetch(imageData);
    const blob = await response.blob();
    
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
