export const LIGHTING_COLORS = {
  // Existing mappings
  'warm': {
    primary: '#F59E0B',
    secondary: '#EAB308',
    gradient: 'linear-gradient(90deg, #F59E0B, #EAB308, #FCD34D)'
  },
  'cool': {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(90deg, #0EA5E9, #06B6D4, #7DD3FC)'
  },
  'neutral': {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  },
  'dramatic': {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    gradient: 'linear-gradient(90deg, #8B5CF6, #A855F7, #C084FC)'
  },
  // Add missing preset mappings
  'natural': {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  },
  'soft': {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(90deg, #0EA5E9, #06B6D4, #7DD3FC)'
  },
  'vibrant': {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    gradient: 'linear-gradient(90deg, #8B5CF6, #A855F7, #C084FC)'
  }
} as const;

// Enhanced default fallback color with complete properties
const DEFAULT_LIGHTING_COLOR = {
  primary: '#6B7280',
  secondary: '#9CA3AF',
  gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
} as const;

// Type definition for lighting color object
export type LightingColor = {
  primary: string;
  secondary: string;
  gradient: string;
};

export const getLightingColor = (lightingId: string | undefined | null): LightingColor => {
  console.log('🎨 getLightingColor called with:', lightingId);
  
  // Handle null, undefined, or empty string inputs
  if (!lightingId || typeof lightingId !== 'string') {
    console.warn('⚠️ Invalid lightingId provided (null/undefined/empty):', lightingId, 'using default');
    return { ...DEFAULT_LIGHTING_COLOR };
  }
  
  // Attempt to get the color from the mapping
  const color = LIGHTING_COLORS[lightingId as keyof typeof LIGHTING_COLORS];
  
  if (!color) {
    console.warn(`⚠️ Lighting color not found for: "${lightingId}", using default. Available lighting styles:`, Object.keys(LIGHTING_COLORS));
    return { ...DEFAULT_LIGHTING_COLOR };
  }
  
  // Validate that the returned color has all required properties
  const requiredProps = ['primary', 'secondary', 'gradient'];
  const missingProps = requiredProps.filter(prop => !color[prop as keyof typeof color]);
  
  if (missingProps.length > 0) {
    console.warn(`⚠️ Incomplete lighting color for: "${lightingId}", missing properties:`, missingProps, 'using default');
    return { ...DEFAULT_LIGHTING_COLOR };
  }
  
  console.log('✅ Successfully retrieved lighting color for:', lightingId, color);
  return { ...color };
};
