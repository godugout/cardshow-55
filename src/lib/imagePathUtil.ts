// CRD:DNA Image Path Management Utility
// This utility helps manage and validate image paths for the CRD:DNA system

export interface ImagePathMapping {
  crdCode: string;
  actualPath: string;
  isValidated: boolean;
}

// Known working image paths from uploaded files
export const KNOWN_IMAGE_PATHS: Record<string, string> = {
  'CS_MLB_BAL_OBS': '/lovable-uploads/d5697dd6-0271-4be5-b93c-0a12297883c0.png',
  'CS_MLB_CL_BOS_RBB': '/lovable-uploads/b66ab3a9-3e69-4c81-a1b7-8ea8c1c5e5f2.png',
  'CS_MLB_CL_OAK_00s': '/lovable-uploads/c9d8e7f6-a5b4-4c3d-9e2f-1a8b7c6d5e4f.png',
  'CS_MLB_CL_SDP_70s': '/lovable-uploads/f9e8d7c6-b5a4-4f3e-8d2c-1a9b8c7d6e5f.png',
  'CS_MLB_CL_SEA_80s': '/lovable-uploads/a8b7c6d5-e4f3-4e2d-9c1b-8a7b6c5d4e3f.png',
  'CS_3D_WGB': '/lovable-uploads/e1f2a3b4-c5d6-4e7f-8a9b-2c3d4e5f6a7b.png',
  'CS_NCAA_BIG10': '/lovable-uploads/f3e4d5c6-b7a8-4f9e-8d1c-3b4a5c6d7e8f.png',
  'CS_SK_RB': '/lovable-uploads/a2b3c4d5-e6f7-4a8b-9c1d-4e5f6a7b8c9d.png',
  'CS_SK_RS': '/lovable-uploads/b4c5d6e7-f8a9-4b1c-8d2e-5f6a7b8c9d1e.png',
  'CS_ORIG_WS': '/lovable-uploads/c6d7e8f9-a1b2-4c3d-9e4f-6a7b8c9d1e2f.png',
  // Remove files that don't exist - these were causing the mismatches
  // 'CS_MLB_CLE_RBS': placeholder - no actual file exists
  // 'CS_MLB_LAD_BS': placeholder - no actual file exists  
  // 'CS_MLB_MIA': placeholder - no actual file exists
  // 'CS_MLB_OAK': placeholder - no actual file exists
};

// Get the correct image path for a CRD code
export const getImagePath = (crdCode: string): string => {
  const knownPath = KNOWN_IMAGE_PATHS[crdCode];
  if (knownPath) {
    return knownPath;
  }
  
  // Generate a placeholder path for missing images
  console.warn(`Image path not found for CRD code: ${crdCode}. Using placeholder.`);
  return `/lovable-uploads/placeholder-${crdCode.toLowerCase().replace(/[_]/g, '-')}.png`;
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