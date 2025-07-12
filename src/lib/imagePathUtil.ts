// CRD:DNA Image Path Management Utility
// This utility helps manage and validate image paths for the CRD:DNA system

export interface ImagePathMapping {
  crdCode: string;
  actualPath: string;
  isValidated: boolean;
}

// Map DNA codes to actual uploaded UUID filenames
export const KNOWN_IMAGE_PATHS: Record<string, string> = {
  // New Cardshow logo variations
  'CRD_GRADIENT_MULTI': '/lovable-uploads/880467b1-c3b1-4d5b-833f-43051fe529a0.png',
  'CS_GREEN_SPARKLE': '/lovable-uploads/806837e5-8a67-487c-82ac-dd63b147b161.png',
  'CS_ORANGE_SCRIPT': '/lovable-uploads/f582a941-4244-42ae-a443-5a445bcaac81.png',
  'CS_REDBLUE_BLOCK': '/lovable-uploads/a00092a2-18fc-47c7-b7a9-f7b2ba05a0d4.png',
  'CS_GREEN_SCRIPT_YELLOW': '/lovable-uploads/9904e7e9-d236-4921-aa91-5c0a1d697b0c.png',
  'CS_BROWN_ORANGE_RETRO': '/lovable-uploads/2b1197e8-9501-4fe3-b915-3fcedda9a4a5.png',
  'CS_BLUE_ORANGE_OUTLINE': '/lovable-uploads/c2a045cc-b1d5-4d98-81ac-b53e2475feee.png',
  'CS_RED_SCRIPT_BLUE': '/lovable-uploads/a1e97cec-f763-4616-b8f9-563d15a9b060.png',
  'CS_BLUE_SCRIPT': '/lovable-uploads/bd1b2459-1140-408e-99c4-b7153c6fb449.png',
  'CS_BLACK_TEAL_SPARKLE': '/lovable-uploads/5e6b3501-9224-4ae3-8b52-c47251daf54d.png',
};

// Get the correct image path for a CRD code
export const getImagePath = (crdCode: string): string => {
  const knownPath = KNOWN_IMAGE_PATHS[crdCode];
  if (knownPath) {
    return knownPath;
  }
  
  // Use DNA code-based filename directly
  return `/lovable-uploads/${crdCode}.png`;
};

// Validate if an image path exists
export const validateImagePath = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get fallback text for missing images
export const getFallbackText = (crdCode: string): string => {
  const parts = crdCode.split('_');
  if (parts.length >= 3) {
    const [system, category, teamOrStyle] = parts;
    return `${teamOrStyle} ${category}`;
  }
  return crdCode;
};

// Image health check utility
export const checkImageHealth = async (crdCodes: string[]): Promise<{ working: string[], broken: string[] }> => {
  const working: string[] = [];
  const broken: string[] = [];
  
  for (const code of crdCodes) {
    const path = getImagePath(code);
    const isValid = await validateImagePath(path);
    
    if (isValid) {
      working.push(code);
    } else {
      broken.push(code);
    }
  }
  
  return { working, broken };
};