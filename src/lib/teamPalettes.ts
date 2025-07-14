
export interface TeamPalette {
  id: string;
  name: string;
  description: string;
  teamCode: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  hsl: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

export const createTeamPalette = (
  id: string,
  name: string,
  description: string,
  primary: string,
  secondary: string,
  accent?: string,
  neutral?: string
): TeamPalette => ({
  id,
  name,
  description,
  teamCode: id.toUpperCase().replace('-', ''),
  colors: {
    primary,
    secondary,
    accent: accent || '#FFFFFF',
    neutral: neutral || '#F5F5F5'
  },
  hsl: {
    primary: `hsl(${primary})`,
    secondary: `hsl(${secondary})`,
    accent: `hsl(${accent || '#FFFFFF'})`,
    neutral: `hsl(${neutral || '#F5F5F5'})`
  }
});

// MLB Teams with proper team codes
export const teamPalettes: Record<string, TeamPalette> = {
  'dodgers': createTeamPalette('dodgers', 'Dodgers', 'Blue & White', '#005A9C', '#FFFFFF', '#EF3E42', '#F7F7F7'),
  'yankees': createTeamPalette('yankees', 'Yankees', 'Navy & Pinstripe', '#132448', '#FFFFFF', '#C4CED4', '#F8F9FA'),
  'red-sox': createTeamPalette('red-sox', 'Red Sox', 'Red & Navy', '#BD3039', '#0C2340', '#FFFFFF', '#F5F5F5'),
  'giants': createTeamPalette('giants', 'Giants', 'Orange & Black', '#FD5A1E', '#27251F', '#FFFFFF', '#F8F8F8'),
  'cubs': createTeamPalette('cubs', 'Cubs', 'Blue & Red', '#0E3386', '#CC3433', '#FFFFFF', '#F7F7F7'),
  'emerald-spark': createTeamPalette('emerald-spark', 'Emerald Spark', 'Emerald & Gold', '#50C878', '#FFD700', '#FFFFFF', '#F5F5F5'),
  'liberty-block': createTeamPalette('liberty-block', 'Liberty Block', 'Red White & Blue', '#B22234', '#FFFFFF', '#3C3B6E', '#F8F8F8'),
  'vintage-vibe': createTeamPalette('vintage-vibe', 'Vintage Vibe', 'Sepia & Cream', '#8B4513', '#F5F5DC', '#D2691E', '#FAF0E6'),
  'coastal-storm': createTeamPalette('coastal-storm', 'Coastal Storm', 'Ocean Blue & White', '#006994', '#FFFFFF', '#87CEEB', '#F0F8FF'),
  'cardinal-script': createTeamPalette('cardinal-script', 'Cardinal Script', 'Cardinal Red & Gold', '#C41E3A', '#FFB81C', '#FFFFFF', '#F5F5F5'),
  'neon-rush': createTeamPalette('neon-rush', 'Neon Rush', 'Electric Blue & Pink', '#00FFFF', '#FF1493', '#FFFFFF', '#F0F0F0'),
  'elite-emerald': createTeamPalette('elite-emerald', 'Elite Emerald', 'Deep Emerald & Silver', '#355E3B', '#C0C0C0', '#FFFFFF', '#F7F7F7'),
  'crimson-bold': createTeamPalette('crimson-bold', 'Crimson Bold', 'Crimson & Black', '#DC143C', '#000000', '#FFFFFF', '#F8F8F8'),
  'steel-force': createTeamPalette('steel-force', 'Steel Force', 'Steel Blue & Gray', '#4682B4', '#708090', '#FFFFFF', '#F5F5F5'),
  'vintage-burgundy': createTeamPalette('vintage-burgundy', 'Vintage Burgundy', 'Burgundy & Cream', '#800020', '#F5F5DC', '#D2691E', '#FAF0E6'),
  'shadow-force': createTeamPalette('shadow-force', 'Shadow Force', 'Black & Silver', '#000000', '#C0C0C0', '#FFFFFF', '#F7F7F7')
};

export const getPaletteByFileName = (fileName: string): TeamPalette | null => {
  // Extract team code from filename like "CS_MLB_LAD.png"
  const match = fileName.match(/CS_MLB_([A-Z]+)/);
  if (!match) return null;
  
  const teamCode = match[1].toLowerCase();
  
  // Map team codes to palette keys
  const codeMap: Record<string, string> = {
    'lad': 'dodgers',
    'nyy': 'yankees',
    'bos': 'red-sox',
    'sf': 'giants',
    'chc': 'cubs'
  };
  
  const paletteKey = codeMap[teamCode];
  return paletteKey ? teamPalettes[paletteKey] : null;
};
