
export const LIGHTING_COLORS = {
  warm: {
    primary: '#F59E0B',
    secondary: '#EAB308',
    gradient: 'linear-gradient(90deg, #F59E0B, #EAB308, #FCD34D)'
  },
  cool: {
    primary: '#0EA5E9',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(90deg, #0EA5E9, #06B6D4, #7DD3FC)'
  },
  neutral: {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  },
  dramatic: {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    gradient: 'linear-gradient(90deg, #8B5CF6, #A855F7, #C084FC)'
  },
  // Add fallback for any missing presets
  default: {
    primary: '#6B7280',
    secondary: '#9CA3AF',
    gradient: 'linear-gradient(90deg, #6B7280, #9CA3AF, #D1D5DB)'
  }
};

export const getColorsForPreset = (presetId: string) => {
  return LIGHTING_COLORS[presetId as keyof typeof LIGHTING_COLORS] || LIGHTING_COLORS.default;
};
