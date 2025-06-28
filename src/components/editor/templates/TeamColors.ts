
export interface TeamColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export const PRO_SPORTS_TEAM_COLORS: TeamColorScheme[] = [
  // MLB Teams
  { id: 'yankees', name: 'New York Yankees', primary: '#132448', secondary: '#C4CED4', accent: '#C4CED4', text: '#FFFFFF' },
  { id: 'redsox', name: 'Boston Red Sox', primary: '#BD3039', secondary: '#0C2340', accent: '#C60C30', text: '#FFFFFF' },
  { id: 'dodgers', name: 'Los Angeles Dodgers', primary: '#005A9C', secondary: '#FFFFFF', accent: '#EF3E42', text: '#FFFFFF' },
  { id: 'giants', name: 'San Francisco Giants', primary: '#FD5A1E', secondary: '#27251F', accent: '#AE8F6F', text: '#FFFFFF' },
  { id: 'cubs', name: 'Chicago Cubs', primary: '#0E3386', secondary: '#CC3433', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'cardinals', name: 'St. Louis Cardinals', primary: '#C41E3A', secondary: '#FEDB00', accent: '#0C2340', text: '#FFFFFF' },
  
  // NFL Teams
  { id: 'patriots', name: 'New England Patriots', primary: '#002244', secondary: '#C60C30', accent: '#B0B7BC', text: '#FFFFFF' },
  { id: 'cowboys', name: 'Dallas Cowboys', primary: '#003594', secondary: '#869397', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'packers', name: 'Green Bay Packers', primary: '#203731', secondary: '#FFB612', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'steelers', name: 'Pittsburgh Steelers', primary: '#FFB612', secondary: '#101820', accent: '#C60C30', text: '#000000' },
  
  // NBA Teams
  { id: 'lakers', name: 'Los Angeles Lakers', primary: '#552583', secondary: '#FDB927', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'celtics', name: 'Boston Celtics', primary: '#007A33', secondary: '#BA9653', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'warriors', name: 'Golden State Warriors', primary: '#1D428A', secondary: '#FFC72C', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'bulls', name: 'Chicago Bulls', primary: '#CE1141', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // NHL Teams
  { id: 'bruins', name: 'Boston Bruins', primary: '#FFB81C', secondary: '#000000', accent: '#FFFFFF', text: '#000000' },
  { id: 'blackhawks', name: 'Chicago Blackhawks', primary: '#CF0A2C', secondary: '#000000', accent: '#FFFFFF', text: '#FFFFFF' },
  { id: 'rangers', name: 'New York Rangers', primary: '#0038A8', secondary: '#CE1126', accent: '#FFFFFF', text: '#FFFFFF' },
  
  // Default/Generic Options
  { id: 'classic', name: 'Classic Blue & Red', primary: '#1f2937', secondary: '#3b82f6', accent: '#ef4444', text: '#FFFFFF' },
  { id: 'modern', name: 'Modern Teal & Orange', primary: '#0f172a', secondary: '#06b6d4', accent: '#f59e0b', text: '#FFFFFF' },
  { id: 'vintage', name: 'Vintage Brown & Gold', primary: '#7c2d12', secondary: '#dc2626', accent: '#fbbf24', text: '#FFFFFF' }
];

export const getTeamColors = (colorSchemeId: string): TeamColorScheme => {
  return PRO_SPORTS_TEAM_COLORS.find(scheme => scheme.id === colorSchemeId) || PRO_SPORTS_TEAM_COLORS[0];
};
