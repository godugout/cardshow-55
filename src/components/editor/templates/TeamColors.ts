
export interface TeamColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export const PRO_SPORTS_TEAM_COLORS: TeamColorScheme[] = [
  // Navy/Silver/White - Most iconic: Yankees
  { id: 'navy-silver-white', name: 'New York Yankees Style', primary: '#132448', secondary: '#C4CED4', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Navy/White - Most popular: Red Sox
  { id: 'red-navy-white', name: 'Boston Red Sox Style', primary: '#BD3039', secondary: '#0C2340', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Blue/White/Red - Most iconic: Dodgers
  { id: 'blue-white-red', name: 'Los Angeles Dodgers Style', primary: '#005A9C', secondary: '#FFFFFF', accent: '#EF3E42', text: '#FFFFFF' },
  
  // Orange/Black/Cream - Most recognizable: Giants
  { id: 'orange-black-cream', name: 'San Francisco Giants Style', primary: '#FD5A1E', secondary: '#27251F', accent: '#AE8F6F', text: '#FFFFFF' },
  
  // Blue/Red/White - Most historic: Cubs
  { id: 'blue-red-white', name: 'Chicago Cubs Style', primary: '#0E3386', secondary: '#CC3433', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Yellow/Navy - Most classic: Cardinals
  { id: 'red-yellow-navy', name: 'St. Louis Cardinals Style', primary: '#C41E3A', secondary: '#FEDB00', accent: '#0C2340', text: '#FFFFFF' },
  
  // Purple/Gold/White - NBA Championship: Lakers
  { id: 'purple-gold-white', name: 'Los Angeles Lakers Style', primary: '#552583', secondary: '#FDB927', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Green/Gold/White - Historic franchise: Celtics
  { id: 'green-gold-white', name: 'Boston Celtics Style', primary: '#007A33', secondary: '#BA9653', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Navy/Gold/White - Championship dynasty: Warriors
  { id: 'navy-gold-white', name: 'Golden State Warriors Style', primary: '#1D428A', secondary: '#FFC72C', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Red/Black/White - Iconic sports franchise: Bulls/Blackhawks
  { id: 'red-black-white', name: 'Chicago Bulls Style', primary: '#CE1141', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Green/Black/White - Most recognizable: Packers
  { id: 'green-black-white', name: 'Green Bay Packers Style', primary: '#203731', secondary: '#000000', accent: '#FFB612', text: '#FFFFFF' },
  
  // Yellow/Black/Red - Most iconic: Steelers
  { id: 'yellow-black-red', name: 'Pittsburgh Steelers Style', primary: '#FFB612', secondary: '#101820', accent: '#C60C30', text: '#000000' },
  
  // Default/Generic Options
  { id: 'classic', name: 'Classic Blue & Red', primary: '#1f2937', secondary: '#3b82f6', accent: '#ef4444', text: '#FFFFFF' },
  { id: 'modern', name: 'Modern Teal & Orange', primary: '#0f172a', secondary: '#06b6d4', accent: '#f59e0b', text: '#FFFFFF' },
  { id: 'vintage', name: 'Vintage Brown & Gold', primary: '#7c2d12', secondary: '#dc2626', accent: '#fbbf24', text: '#FFFFFF' }
];

export const getTeamColors = (colorSchemeId: string): TeamColorScheme => {
  return PRO_SPORTS_TEAM_COLORS.find(scheme => scheme.id === colorSchemeId) || PRO_SPORTS_TEAM_COLORS[0];
};
