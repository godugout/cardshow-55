// CRD:DNA Image Path Management Utility
// This utility helps manage and validate image paths for the CRD:DNA system

export interface ImagePathMapping {
  crdCode: string;
  actualPath: string;
  isValidated: boolean;
}

// Known working image paths with DNA code-based filenames - matches reference image exactly
export const KNOWN_IMAGE_PATHS: Record<string, string> = {
  // Row 1
  'CRD_GRADIENT': '/lovable-uploads/CRD_GRADIENT.png',
  'CS_3D_WGB': '/lovable-uploads/CS_3D_WGB.png',
  'CS_MLB_BAL_OBS': '/lovable-uploads/CS_MLB_BAL_OBS.png',
  'CS_MLB_CL_BOS_RBB': '/lovable-uploads/CS_MLB_CL_BOS_RBB.png',
  'CS_MLB_CL_OAK_00s': '/lovable-uploads/CS_MLB_CL_OAK_00s.png',
  'CS_MLB_CL_SDP_70s': '/lovable-uploads/CS_MLB_CL_SDP_70s.png',
  
  // Row 2
  'CS_MLB_CL_SEA_80s': '/lovable-uploads/CS_MLB_CL_SEA_80s.png',
  'CS_MLB_CLE_RBS': '/lovable-uploads/CS_MLB_CLE_RBS.png',
  'CS_MLB_LAD_BS': '/lovable-uploads/CS_MLB_LAD_BS.png',
  'CS_MLB_MIA': '/lovable-uploads/CS_MLB_MIA.png',
  'CS_MLB_OAK': '/lovable-uploads/CS_MLB_OAK.png',
  'CS_MLB_PIT_BBY': '/lovable-uploads/CS_MLB_PIT_BBY.png',
  
  // Row 3
  'CS_NCAA_BIG10': '/lovable-uploads/CS_NCAA_BIG10.png',
  'CS_OLD_RS': '/lovable-uploads/CS_OLD_RS.png',
  'CS_ORIG_WS': '/lovable-uploads/CS_ORIG_WS.png',
  'CS_SK_RB': '/lovable-uploads/CS_SK_RB.png',
  'CS_SK_RS': '/lovable-uploads/CS_SK_RS.png',
  'CS_UNI_BB': '/lovable-uploads/CS_UNI_BB.png',
  
  // Row 4
  'CS_UNI_WRB': '/lovable-uploads/CS_UNI_WRB.png',
  'CS_UNI_YBB': '/lovable-uploads/CS_UNI_YBB.png',
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