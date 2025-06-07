
export const STYLE_COLORS = {
  'custom-style': {
    primary: '#8B5CF6',
    border: '#A855F7',
    bg: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7)'
  },
  'holographic-burst': {
    primary: '#06B6D4',
    border: '#0891B2',
    bg: 'rgba(6, 182, 212, 0.1)',
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #EC4899)'
  },
  'crystal-interference': {
    primary: '#3B82F6',
    border: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)'
  },
  'chrome-burst': {
    primary: '#6B7280',
    border: '#4B5563',
    bg: 'rgba(107, 114, 128, 0.1)',
    gradient: 'linear-gradient(135deg, #6B7280, #D1D5DB)'
  },
  'golden-fire': {
    primary: '#F59E0B',
    border: '#D97706',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(135deg, #F59E0B, #EAB308)'
  },
  'ocean-waves': {
    primary: '#0EA5E9',
    border: '#0284C7',
    bg: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4)'
  },
  'aurora-flare': {
    primary: '#10B981',
    border: '#059669',
    bg: 'rgba(16, 185, 129, 0.1)',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4, #8B5CF6)'
  },
  'metallic-prizm': {
    primary: '#EC4899',
    border: '#DB2777',
    bg: 'rgba(236, 72, 153, 0.1)',
    gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)'
  },
  'vintage-foil': {
    primary: '#92400E',
    border: '#78350F',
    bg: 'rgba(146, 64, 14, 0.1)',
    gradient: 'linear-gradient(135deg, #92400E, #A16207)'
  },
  'ice-crystal': {
    primary: '#0369A1',
    border: '#075985',
    bg: 'rgba(3, 105, 161, 0.1)',
    gradient: 'linear-gradient(135deg, #0369A1, #0EA5E9)'
  },
  'starlight-spray': {
    primary: '#7C3AED',
    border: '#6D28D9',
    bg: 'rgba(124, 58, 237, 0.1)',
    gradient: 'linear-gradient(135deg, #7C3AED, #EC4899)'
  },
  'lunar-shimmer': {
    primary: '#64748B',
    border: '#475569',
    bg: 'rgba(100, 116, 139, 0.1)',
    gradient: 'linear-gradient(135deg, #64748B, #94A3B8)'
  },
  // Exact lighting preset colors from the image
  'natural': {
    primary: '#22c55e',
    border: '#16a34a',
    bg: 'rgba(34, 197, 94, 0.1)',
    gradient: 'linear-gradient(90deg, #4ade80, #22c55e, #15803d)'
  },
  'dramatic': {
    primary: '#374151',
    border: '#4b5563',
    bg: 'rgba(55, 65, 81, 0.1)',
    gradient: 'linear-gradient(90deg, #6b7280, #374151, #1f2937)'
  },
  'soft': {
    primary: '#60a5fa',
    border: '#3b82f6',
    bg: 'rgba(96, 165, 250, 0.1)',
    gradient: 'linear-gradient(90deg, #93c5fd, #60a5fa, #2563eb)'
  },
  'vibrant': {
    primary: '#8b5cf6',
    border: '#7c3aed',
    bg: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(90deg, #a78bfa, #8b5cf6, #6d28d9)'
  },
  // Legacy lighting preset mappings for backwards compatibility
  'warm': {
    primary: '#F59E0B',
    border: '#EAB308',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(90deg, #F59E0B, #EAB308, #FCD34D)'
  },
  'cool': {
    primary: '#0EA5E9',
    border: '#06B6D4',
    bg: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(90deg, #0EA5E9, #06B6D4, #7DD3FC)'
  },
  'neutral': {
    primary: '#6B7280',
    border: '#9CA3AF',
    bg: 'rgba(107, 114, 128, 0.1)',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  }
} as const;

// Default fallback color to prevent undefined errors
const DEFAULT_STYLE_COLOR = {
  primary: '#45B26B',
  border: '#4ADE80',
  bg: 'rgba(69, 178, 107, 0.1)',
  gradient: 'linear-gradient(135deg, #45B26B, #4ADE80)'
};

export const getStyleColor = (styleId: string) => {
  console.log('Getting style color for:', styleId);
  
  if (!styleId) {
    console.warn('No styleId provided, using default');
    return DEFAULT_STYLE_COLOR;
  }
  
  const color = STYLE_COLORS[styleId as keyof typeof STYLE_COLORS];
  if (!color) {
    console.warn(`Style color not found for: ${styleId}, using default`);
    return DEFAULT_STYLE_COLOR;
  }
  
  return color;
};
