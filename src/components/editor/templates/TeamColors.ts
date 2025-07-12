
// Legacy interface for backward compatibility
export interface TeamColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

// Convert database color theme to legacy format
export const convertColorThemeToScheme = (theme: any): TeamColorScheme => ({
  id: theme.id,
  name: theme.name,
  primary: theme.primary_color,
  secondary: theme.secondary_color,
  accent: theme.accent_color,
  text: theme.text_color
});

// Legacy static array kept for fallback
export const PRO_SPORTS_TEAM_COLORS: TeamColorScheme[] = [
  // New Cardshow brand themes
  { id: 'cardshow-official', name: 'Cardshow Official', primary: '#45B26B', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'cardshow-green-script', name: 'Green Script', primary: '#45B26B', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'cardshow-brown-orange', name: 'Brown Orange', primary: '#8B4513', secondary: '#FF8C00', accent: '#FFE4B5', text: '#FFFFFF' },
  { id: 'cardshow-blue-outline', name: 'Blue Outline', primary: '#3772FF', secondary: '#FFD700', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'cardshow-teal-sparkles', name: 'Teal Sparkles', primary: '#008B8B', secondary: '#FFD700', accent: '#000000', text: '#FFFFFF' },
  { id: 'cardshow-red-script', name: 'Red Script', primary: '#DC143C', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'cardshow-black-bold', name: 'Black Bold', primary: '#000000', secondary: '#FFFFFF', accent: '#808080', text: '#FFFFFF' },
  { id: 'cardshow-purple-outline', name: 'Purple Outline', primary: '#9757D7', secondary: '#FFFFFF', accent: '#FFD700', text: '#FFFFFF' },
  { id: 'cardshow-orange-black-bold', name: 'Orange Black Bold', primary: '#FF8C00', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Original team themes
  { id: 'navy-silver-white', name: 'NY Yankees', primary: '#132448', secondary: '#C4CED4', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'red-navy-white', name: 'BOS Red Sox', primary: '#BD3039', secondary: '#0C2340', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'blue-white-red', name: 'LA Dodgers', primary: '#005A9C', secondary: '#FFFFFF', accent: '#EF3E42', text: '#FFFFFF' },
  { id: 'orange-black-cream', name: 'SF Giants', primary: '#FD5A1E', secondary: '#27251F', accent: '#AE8F6F', text: '#FFFFFF' },
  { id: 'blue-red-white', name: 'CHI Cubs', primary: '#0E3386', secondary: '#CC3433', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'red-yellow-navy', name: 'STL Cardinals', primary: '#C41E3A', secondary: '#FEDB00', accent: '#0C2340', text: '#FFFFFF' },
  { id: 'purple-gold-white', name: 'LA Lakers', primary: '#552583', secondary: '#FDB927', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'green-gold-white', name: 'BOS Celtics', primary: '#007A33', secondary: '#BA9653', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'navy-gold-white', name: 'GS Warriors', primary: '#1D428A', secondary: '#FFC72C', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'red-black-white', name: 'CHI Bulls', primary: '#CE1141', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' }
];

export const getTeamColors = (colorSchemeId: string): TeamColorScheme => {
  return PRO_SPORTS_TEAM_COLORS.find(scheme => scheme.id === colorSchemeId) || PRO_SPORTS_TEAM_COLORS[0];
};
